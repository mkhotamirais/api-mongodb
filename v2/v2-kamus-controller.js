import { v2Kamus } from "./v2-models.js";

export const getKamus = async (req, res) => {
  try {
    let { skip = 0, limit = 10, q = "", sort = "name" } = req.query;
    let criteria = {};
    if (q.length) criteria = { ...criteria, name: { $regex: `${q}`, $options: "i" } };
    const data = await v2Kamus.find(criteria).sort(sort).select("-__v").skip(parseInt(skip)).limit(parseInt(limit));
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getKamusById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await v2Kamus.findById(id);
    if (!data) return res.status(400).json({ error: `data id ${id} not found` });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const postKamus = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "name required" });
  if (!description) return res.status(400).json({ error: "description required" });
  try {
    const existingName = await v2Kamus.findOne({ name });
    if (existingName) return res.status(409).json({ error: "duplicate name" });

    const data = await v2Kamus.create(req.body);
    res.status(201).json({ message: `Post ${data.name} success`, data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateKamus = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "name required" });
  if (!description) return res.status(400).json({ error: "description required" });

  try {
    const existingKamus = await v2Kamus.findById(id);
    if (!existingKamus) return res.status(400).json({ error: `kamus id ${id} not found` });

    const existingName = await v2Kamus.findOne({ name });
    if (existingName && existingName.name !== name) return res.status(409).json({ error: "duplicate name" });

    const data = await v2Kamus.findByIdAndUpdate(existingKamus?._id, req.body, { new: true });
    res.status(200).json({ message: `Update ${data.name} success` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteKamus = async (req, res) => {
  const { id } = req.params;
  try {
    const existingKamus = await v2Kamus.findById(id);
    if (!existingKamus) return res.status(400).json({ error: `kamus id ${id} not found` });
    await v2Kamus.findByIdAndDelete(existingKamus?._id);
    res.status(200).json({ message: `Delete ${existingKamus.name} success` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
