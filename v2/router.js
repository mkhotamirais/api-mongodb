import express from "express";
const router = express.Router();
import { getUsers, getUserById, deleteUser, updateUser } from "./v2-user-controller.js";
import { signin, signup } from "./v2-auth-controller.js";

router.route("/v2-user").get(getUsers);
router.route("/v2-user/:id").get(getUserById).patch(updateUser).delete(deleteUser);

router.post("/v2-signup", signup);
router.patch("/v2-signin", signin);

export default router;
