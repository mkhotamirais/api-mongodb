import v1Text from "./v1-text-model.js";

export const getV1Texts = async (req, res) => {
  try {
    const response = await v1Text.find();
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getV1TextById = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await v1Text.findById(id);
    if (!response) return res.status(400).json({ error: `data id ${id} not found` });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const postV1Text = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: `name required` });
  if (!description) return res.status(400).json({ error: `description required` });
  try {
    const existingName = await v1Text.findOne({ name });
    if (existingName) return res.status(409).json({ error: "duplicate name" });
    const response = await v1Text.create({ name, description });
    res.status(201).json({ message: `create ${response.name} success`, response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateV1Text = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: `name required` });
  if (!description) return res.status(400).json({ error: `description required` });
  try {
    const existingData = await v1Text.findById(id);
    if (!existingData) return res.status(400).json({ error: `data id ${id} not found` });
    const existingName = await v1Text.findOne({ name });
    if (existingName && existingName.name !== name) return res.status(409).json({ error: `duplicate name` });

    const response = await v1Text.findByIdAndUpdate(id, { name, description });
    res.status(200).json({ message: `update ${response.name} success`, response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteV1Text = async (req, res) => {
  const { id } = req.params;
  try {
    const existingText = await v1Text.findById(id);
    if (!existingText) return res.status(400).json({ error: `Data id ${id} not found` });
    await v1Text.findByIdAndDelete(id);
    res.status(200).json({ message: `delete ${existingText.name} success` });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};
