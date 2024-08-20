import express from "express";
const router = express.Router();
import { deleteMe, getMe, signin, signout, signup, updateMe } from "./authController.js";
import { createProduct, deleteProduct, readProductById, readProducts, updateProduct } from "./productController.js";
import { deleteUser, readUserById, readUsers, updateUser } from "./userController.js";
import {
  createCategory,
  deleteCategory,
  readCategories,
  readCategoryById,
  updateCategory,
} from "./categoryController.js";
import { isAdmin, isLogin } from "./mw.js";
import { createTag, deleteTag, readTagById, readTags, updateTag } from "./tagController.js";
import { createKamus, deleteKamus, readKamus, readKamusById, updateKamus } from "./kamusController.js";

router.post("/signup", signup);
router.patch("/signin", signin);

router.route("/product").get(readProducts).post(isLogin, isAdmin, createProduct);
router.route("/category").get(readCategories).post(isLogin, isAdmin, createCategory);
router.route("/tag").get(readTags).post(isLogin, isAdmin, createTag);
router.route("/kamus").get(readKamus).post(isLogin, isAdmin, createKamus);

router.use(isLogin);
router.route("/me").get(getMe).patch(updateMe).delete(deleteMe);
router.patch("/signout", signout);

router.use(isAdmin);
router.route("/product/:id").get(readProductById).patch(updateProduct).delete(deleteProduct);
router.route("/category/:id").get(readCategoryById).patch(updateCategory).delete(deleteCategory);
router.route("/tag/:id").get(readTagById).patch(updateTag).delete(deleteTag);
router.route("/kamus/:id").get(readKamusById).patch(updateKamus).delete(deleteKamus);

router.route("/user").get(readUsers);
router.route("/user/:id").get(readUserById).patch(updateUser).delete(deleteUser);

export default router;
