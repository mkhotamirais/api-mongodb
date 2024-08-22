import { rootPath } from "../config/constants.js";
import { Products } from "./models.js";
import { existsSync, unlinkSync, renameSync } from "fs";
import path from "path";

export const readProducts = async (req, res) => {
  try {
    const data = await Products.find().select("-__v");
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const readProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Products.findById(id);
    if (!data) return res.status(400).json({ error: `Data id ${id} not found` });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { name } = req.body;

  if (req.file) {
    const { originalname, filename, path: pathFile, size } = req.file;
    const validExt = [".jpg", ".jpeg", ".png"];
    const ext = path.extname(originalname);

    if (!validExt.includes(ext)) {
      if (existsSync(pathFile)) unlinkSync(pathFile);
      return res.status(400).json({ error: `Invalid extension` });
    } else if (size > 2000000) {
      if (existsSync(pathFile)) unlinkSync(pathFile);
      return res.status(400).json({ error: `File max 2Mb` });
    }

    req.body.imageName = filename + ext;
    req.body.imageUrl = `${req.protocol}://${req.get("host")}/images/v4product/${filename + ext}`;
    try {
      await Products.create(req.body);
      if (existsSync(pathFile)) renameSync(pathFile, pathFile + ext);
      res.status(201).json({ message: `Create ${name} success` });
    } catch (error) {
      if (existsSync(pathFile + ext)) unlinkSync(pathFile + ext);
      if (existsSync(pathFile)) unlinkSync(pathFile);
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  } else {
    try {
      await Products.create(req.body);
      res.status(201).json({ message: `Create ${name} success` });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Products.findById(id);
    if (!data) return res.status(400).json({ error: `Data id ${id} not found` });
    const pathImage = path.join(rootPath, "public/images/v4product", `${data.imageName}`);
    if (existsSync(pathImage)) unlinkSync(pathImage);
    await data.deleteOne({ _id: id });
    res.status(200).json({ message: `Delete ${data.name} success` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (req.file) {
    const data = await Products.findById(id);
    const { originalname, filename, path: pathFile, size } = req.file;
    const validExt = [".jpg", ".jpeg", ".png"];
    const ext = path.extname(originalname);

    if (!data) {
      if (existsSync(pathFile)) unlinkSync(pathFile);
      return res.status(400).json({ error: `Data id ${id} not found` });
    }

    if (!validExt.includes(ext)) {
      if (existsSync(pathFile)) unlinkSync(pathFile);
      return res.status(400).json({ error: `Invalid extension` });
    } else if (size > 2000000) {
      if (existsSync(pathFile)) unlinkSync(pathFile);
      return res.status(400).json({ error: `File max 2Mb` });
    }

    req.body.imageName = filename + ext;
    req.body.imageUrl = `${req.protocol}://${req.get("host")}/images/v4product/${filename + ext}`;

    try {
      const result = await Products.findByIdAndUpdate({ _id: id }, req.body, { new: true });
      const pathImage = path.join(rootPath, "public/images/v4product", `${data.imageName}`);
      if (!existsSync(pathImage) && !result.imageName) {
        renameSync(pathFile, pathFile + ext);
        return ok(res, `update product ${req.body.name} berhasil`, result);
      }
      if (existsSync(pathImage)) unlinkSync(pathImage);
      renameSync(pathFile, pathFile + ext);
      res.status(200).json({ message: `Update ${name} success` });
    } catch (error) {
      if (existsSync(pathFile + ext)) unlinkSync(pathFile + ext);
      if (existsSync(pathFile)) unlinkSync(pathFile);
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  } else {
    try {
      const data = await Products.findById(id);
      if (!data) return res.status(400).json({ error: `Data id ${id} not found` });

      await Products.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json({ message: `Update ${name} success` });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }
};
