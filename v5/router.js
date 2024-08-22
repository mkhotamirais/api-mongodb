import express from "express";

const router = express.Router();

import cloudinary from "./cloudinary.js";
import upload from "./multer.js";

router.post("/image", upload.single("image"), (req, res) => {
  cloudinary.uploader.upload(req.file.path, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
    res.status(500).json({ message: "success", result });
  });
});

export default router;
