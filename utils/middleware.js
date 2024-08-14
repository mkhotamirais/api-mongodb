import jwt from "jsonwebtoken";
import { allowedOrigins } from "../config/origins.js";

export const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

export const notFound = (req, res, next) => {
  console.log("not found");
  const error = new Error(`not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  console.log("error handler");
  const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
  req.status(statusCode);
  res.json({
    message: err?.message,
    stack: err?.stack,
  });
};

export const verifyToken = (req, res, next) => {
  const authToken = req.headers.authorization || req.headers.Authorization || req.headers["authorization"];
  if (!authToken?.startsWith("Bearer ")) return unauthorized(res, "no token");
  const token = authToken.split(" ")[1];
  jwt.verify(token, ats, (err, decoded) => {
    if (err) return forbidden(res);
    req.id = decoded.id;
    req.username = decoded.username;
    req.role = decoded.role;
    next();
  });
};

export const verifyAdmin = async (req, res, next) => {
  if (req.role !== "admin") return badRequest(res, `anda bukan admin`);
  next();
};
