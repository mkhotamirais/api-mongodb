import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { allowedOrigins } from "./config/origins.js";

export const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

export const corsOptions = {
  origin: (origin, callback) => {
    allowedOrigins.indexOf(origin) !== -1 || !origin
      ? callback(null, true)
      : callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export const logEvents = (message, fileName) => {
  const logItem = `${format(new Date(), "yyyyMMdd-HH:mm:ss")}\t${uuidv4()}\t${message}\n`;
  try {
    if (!fs.existsSync(path.join(__dirname, "logs"))) fs.mkdirSync(path.join(__dirname, "logs"));
    fs.appendFileSync(path.join(__dirname, "logs", fileName), logItem);
  } catch (error) {
    console.log(error);
  }
};

export const logSuccess = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "log-success.log");
  console.log(`${req.method}\t${req.path}`);
  next();
};

export const logError = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, "log-error.log");
  console.log(err.stack);
  res.status(500).json({ message: err.message });
};
