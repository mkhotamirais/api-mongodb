import { compare, genSalt, hash } from "bcrypt";
import { v2User } from "./v2-models.js";
import jwt from "jsonwebtoken";
import validator from "validator";

const ats = process.env.ACCESS_TOKEN_SECRET;

export const signup = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;
  try {
    if (!name) return res.status(400).json({ error: "name required" });
    if (!email) return res.status(400).json({ error: "email required" });
    if (!password) return res.status(400).json({ error: "password required" });

    const dupName = await v2User.findOne({ name });
    const dupEmail = await v2User.findOne({ email });
    if (dupName) return res.status(409).json({ error: "duplicate name" });
    if (dupEmail) return res.status(409).json({ error: "duplicate email" });
    if (!validator.isEmail(email)) return res.status(400).json({ error: "email invalid" });

    if (password !== confPassword) return res.status(400).json({ error: "confirm password error" });
    const salt = await genSalt(10);
    const hashPass = await hash(password, salt);
    req.body.password = hashPass;
    if (role && role === "admin") req.body.role = "user";

    const response = await v2User.create(req.body);
    res.status(201).json({ message: `Register ${name} success`, response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) return res.status(400).json({ error: `email required` });
    if (!password) return res.status(400).json({ error: `password required` });

    const existingEmail = await v2User.findOne({ email });
    if (!existingEmail) return res.status(400).json({ error: "wrong email" });
    const matchPass = await compare(password, existingEmail.password);
    if (!matchPass) return res.status(400).json({ error: "incorrect password" });

    const { _id: id, name, role } = existingEmail;
    const accessToken = jwt.sign({ id, name, role }, ats, { expiresIn: "1d" });
    res.cookie("accessToken", accessToken, {
      secure: true,
      httpOnly: true,
      // maxAge: 30 * 24 * 60 * 60 * 1000,
      // sameSite: "lax", //
      sameSite: "none",
      path: "/",
    });

    const response = await v2User
      .findOneAndUpdate({ email }, { $push: { accessToken } }, { new: true })
      .select(["-__v", "-password"]);

    res.status(200).json({ message: `Login ${email} success`, response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// token required
export const signout = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const existingDataToken = await v2User.findOne({ accessToken: { $in: accessToken } });
    if (!existingDataToken) return res.status(403).json({ error: `forbidden, token invalid` });
    res.clearCookie(`accessToken`, accessToken, {
      secure: true,
      httpOnly: true,
      // maxAge: 30 * 24 * 60 * 60 * 1000,
      // sameSite: "lax", //
      sameSite: "none",
      path: "/",
    });
    await v2User.findByIdAndUpdate(existingDataToken._id, { $pull: { accessToken } }, { new: true });
    res.status(200).json({ message: `Logout ${existingDataToken.name} success` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const existingDataToken = await v2User
      .findOne({ accessToken: { $in: req.cookies.accessToken } })
      .select(["-__v", "-password", "-accessToken"]);
    if (!existingDataToken) return res.status(403).json({ error: `forbidden, accessToken tidak valid` });
    res.status(200).json(existingDataToken);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateMe = async (req, res) => {
  try {
    const existingDataToken = await User.findOne({
      token: { $in: req.cookies.accessToken },
    });
    if (!existingDataToken) return err(res, 403, `forbidden: token tidak valid`);
    const { password, confPassword } = req.body;
    if (password) {
      if (password !== confPassword) return err(res, 400, `confirm password wrong`);
      const salt = await genSalt(10);
      req.body.password = await hash(password, salt);
    }
    const data = await User.findByIdAndUpdate(existingDataToken._id, req.body, { new: true });
    res.status(200).json({ message: `Update your account success` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteMe = async (req, res) => {
  try {
    const existingDataToken = await User.findOne({
      token: { $in: req.cookies.accessToken },
    });
    if (!existingDataToken) return err(res, 403, `forbidden: token tidak valid`);
    if (existingDataToken.role === "admin") return err(res, 400, `role admin cannot deleted, change role first`);
    const data = await User.findByIdAndDelete(existingDataToken._id);
    res.status(200).json({ message: `Delete your account success` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
