import { compare, genSalt, hash } from "bcrypt";
import { v2User } from "./v2-models.js";
import jwt from "jsonwebtoken";
const ats = process.env.ACCESS_TOKEN_SECRET;

export const signup = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  try {
    if (!name) return res.status(400).json({ error: "name required" });
    if (!email) return res.status(400).json({ error: "email required" });
    if (!password) return res.status(400).json({ error: "password required" });

    const dupName = await v2User.findOne({ name });
    const dupEmail = await v2User.findOne({ email });
    if (dupName) return res.status(409).json({ error: "duplicate name" });
    if (dupEmail) return res.status(409).json({ error: "duplicate email" });

    if (password !== confPassword) return res.status(400).json({ error: "confirm password error" });

    const salt = await genSalt(10);
    const hashPass = await hash(password, salt);
    req.body.password = hashPass;

    const response = await v2User.create(req.body);
    res.status(201).json({ message: `create ${name} success`, response });
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

    const response = await v2User
      .findOneAndUpdate({ email }, { accessToken }, { new: true })
      .select(["-__v", "-password"]);
    res.status(200).json({ message: `Login ${email} success`, response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
