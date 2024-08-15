import express from "express";
const router = express.Router();
import { deleteMe, getMe, signin, signout, signup, updateMe } from "./authController.js";
import { createProduct, deleteProduct, readProductById, readProducts, updateProduct } from "./productController.js";
import { deleteUser, readUserById, readUsers, updateUser } from "./userController.js";
import { isAdmin, isLogin } from "./mw.js";

// auth
router.post("/signup", signup);
router.patch("/signin", signin);

// products
router.route("/product").get(readProducts).post(createProduct);
router.route("/product/:id").get(readProductById).patch(updateProduct).delete(deleteProduct);

// me
router.use(isLogin);
router.route("/me").get(getMe).patch(updateMe).delete(deleteMe);
router.patch("/signout", signout);

// user
router.use(isAdmin);
router.route("/user").get(readUsers);
router.route("/user/:id").get(readUserById).patch(updateUser).delete(deleteUser);

export default router;
