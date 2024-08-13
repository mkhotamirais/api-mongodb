import express from "express";
import { deleteV1Text, getV1TextById, getV1Texts, postV1Text, updateV1Text } from "./v1-text-controller.js";

const router = express.Router();

router.route("/").get(getV1Texts).post(postV1Text);
router.route("/:id").get(getV1TextById).patch(updateV1Text).delete(deleteV1Text);

export default router;
