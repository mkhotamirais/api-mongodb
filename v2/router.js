import express from "express";
const router = express.Router();
import { getUsers, getUserById, deleteUser, updateUser } from "./v2-user-controller.js";
import { deleteMe, getMe, signin, signout, signup, updateMe } from "./v2-auth-controller.js";
import { isAdmin, isLogin } from "./middleware.js";

router.post("/v2-signup", signup);
router.patch("/v2-signin", signin);

router.use(isLogin);
router.route("/v2-me").get(getMe).patch(updateMe).delete(deleteMe);
router.patch("/v2-signout", signout);

router.use(isAdmin);
router.route("/v2-user").get(getUsers);
router.route("/v2-user/:id").get(getUserById).patch(updateUser).delete(deleteUser);

export default router;
