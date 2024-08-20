import { Kamuss } from "./models.js";

export const readKamus = async (req, res) => {
  try {
    let { skip = 0, limit = 10, q = "", sort = "-createdAt" } = req.query;
    let criteria = {};
    if (q.length) criteria = { ...criteria, name: { $regex: `${q}`, $options: "i" } };
    const data = await Kamuss.find(criteria).sort(sort).select("-__v").skip(parseInt(skip)).limit(parseInt(limit));
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const readKamusById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Kamuss.findById(id);
    if (!data) return res.status(400).json({ message: `Data id ${id} not found!` });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const createKamus = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: `Name is required!` });
  try {
    const dupName = await Kamuss.findOne({ name });
    if (dupName) return res.status(409).json({ error: `Duplicate name!` });
    await Kamuss.create(req.body);
    res.status(200).json({ message: `Post ${name} success` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const updateKamus = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: `Name is required!` });
  try {
    const data = await Kamuss.findById(id);
    if (!data) return res.status(400).json({ message: `Data id ${id} not found!` });
    const dupName = await Kamuss.findOne({ name });
    if (dupName && dupName.name !== name) return res.status(409).json({ error: "Duplicate name!" });
    await Kamuss.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: `Update ${data.name} success` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteKamus = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Kamuss.findById(id);
    if (!data) return res.status(400).json({ message: `Data id ${id} not found` });
    await Kamuss.findByIdAndDelete(id);
    res.status(200).json({ message: `Delete ${data.name} succes` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
