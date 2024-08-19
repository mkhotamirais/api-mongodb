import jwt from "jsonwebtoken";
import { Users } from "./models.js";
const ats = process.env.ACCESS_TOKEN_SECRET;

export const isLogin = (req, res, next) => {
  const token = req.cookies.accessTokenV3;
  if (!token) return res.status(401).json({ error: `unauthorized, your not logged in` });
  jwt.verify(token, ats, async (error, decoded) => {
    if (error) return res.status(403).json({ error: `forbidden: token invalid` });
    req.user = await Users.findById(decoded.id).select(["-__v", "-password"]);
    next();
  });
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: `admin only` });
  next();
};
