import express from "express";
import cors from "cors";
import "dotenv/config";
import db from "./config/index.js";
import { credentials } from "./utils/middleware.js";
import { allowedOrigins } from "./config/origins.js";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import v1Router from "./v1/router.js";
import v2Router from "./v2/router.js";

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: (origin, callback) => {
    allowedOrigins.indexOf(origin) !== -1 || !origin
      ? callback(null, true)
      : callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(credentials);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("this is api-mongodb");
});

app.use("/v1-text", v1Router);
app.use("/", v2Router);

app.all("/*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) res.sendFile(path.join(__dirname, "views", "404.html"));
  else if (req.accepts("json")) res.json({ message: "404 Not Found" });
  else res.type("txt").send("404 Not Found");
});

db.then(() => {
  app.listen(port, () => console.log(`connect to mongodb and running on http//localhost:${port}`));
}).catch((err) => console.log(err));
