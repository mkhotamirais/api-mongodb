import express from "express";
const router = express.Router();
import { createProduct, deleteProduct, readProductById, readProducts, updateProduct } from "./productController.js";
import upload from "./multer.js";

router.route("/product").get(readProducts).post(upload, createProduct);
router.route("/product/:id").get(readProductById).patch(upload, updateProduct).delete(deleteProduct);

export default router;
