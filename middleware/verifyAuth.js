const jwt = require("jsonwebtoken");
const { ats } = require("../config/constants");
const { forbidden, unauthorized, badRequest } = require("../app/utils");
const User = require("../app/v1/user/model");

const verifyToken = (req, res, next) => {
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

const verifyAdmin = async (req, res, next) => {
  if (req.role !== "admin") return badRequest(res, `anda bukan admin`);
  next();
};

module.exports = { verifyToken, verifyAdmin };
