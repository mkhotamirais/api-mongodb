import { v2User } from "./v2-models.js";
import { genSalt, hash } from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const response = await v2User.find().select(["-password", "-__v"]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await v2User.findById(id).select(["-password", "-__v"]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// post user ada di auth register
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, confPassword } = req.body;
  if (!name) return res.status(400).json({ error: "name required" });
  if (!email) return res.status(400).json({ error: "email required" });
  if (!password) return res.status(400).json({ error: "password required" });

  try {
    const existingUser = await v2User.findById(id);
    if (!existingUser) return res.status(400).json({ error: `user id ${id} not found` });
    const dupName = v2User.findOne({ name });
    const dupEmail = v2User.findOne({ email });
    if (dupName) return res.status(409).json({ error: "duplicate name" });
    if (dupEmail) return res.status(409).json({ error: "duplicate email" });

    if (password !== confPassword) return res.status(400).json({ message: "confirm password wrong" });
    const salt = await genSalt(10);
    const hashPass = await hash(password, salt);
    req.body.password = hashPass;

    const response = await v2User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: `update ${name} success`, response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const existingUser = await v2User.findById(id);
    if (!existingUser) return res.status(400).json({ error: `User id ${id} not found` });
    if (existingUser.role === "admin") return res.status(400).json({ error: `Admin role cannot be deleted!` });
    await v2User.findByIdAndDelete(id);
    res.status(200).json({ message: `Delete ${existingUser.name} success` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
