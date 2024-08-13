import express from "express";
import cors from "cors";
import "dotenv/config";
import db from "./config/index.js";

import v1TextRouter from "./v1/v1-text-router.js";

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("this is api-mongodb");
});

app.use("/v1-text", v1TextRouter);

db.then(() => {
  app.listen(port, () => console.log(`connect to mongodb and running on http//:localhost:${port}`));
}).catch((err) => {
  console.log(err);
});
