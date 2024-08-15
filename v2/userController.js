import { Users } from "./models.js";
import { genSalt, hash } from "bcrypt";

// read user ada di auth signup

export const readUsers = async (req, res) => {
  try {
    const data = await Users.find().select(["-password", "-__v"]);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const readUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Users.findById(id).select(["-password", "-__v"]);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, confPassword } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required!" });
  if (!email) return res.status(400).json({ error: "Email is required!" });

  try {
    const data = await Users.findById(id);
    if (!data) return res.status(400).json({ error: `Data id ${id} not found!` });
    const dupName = await Users.findOne({ name });
    const dupEmail = await Users.findOne({ email });
    if (dupName && dupName.name !== name) return res.status(409).json({ error: "Duplicate name!" });
    if (dupEmail && dupEmail.email !== email) return res.status(409).json({ error: "Duplicate email!" });

    if (password) {
      if (password !== confPassword) return res.status(400).json({ message: "Wrong confirm password!" });
      const salt = await genSalt(10);
      const hashPass = await hash(password, salt);
      req.body.password = hashPass;
    }

    await Users.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    res.status(200).json({ message: `Update ${name} success` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Users.findById(id);
    if (!data) return res.status(400).json({ error: `Data id ${id} not found!` });
    if (data.role === "admin") return res.status(400).json({ error: `Admin role cannot be deleted!` });
    await Users.findByIdAndDelete(id);
    res.status(200).json({ message: `Delete ${data.name} success` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
