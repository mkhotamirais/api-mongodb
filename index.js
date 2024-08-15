import express from "express";
import cors from "cors";
import "dotenv/config";
import db from "./config/index.js";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import cookieParser from "cookie-parser";
import { corsOptions, credentials, logError, logSuccess } from "./mw.js";

import v0Router from "./v0/router.js";
import v1Router from "./v1/router.js";
import v2Router from "./v2/router.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(logSuccess);

app.use(credentials); // --- built-in middleware
app.use(cors(corsOptions)); // mw for 'content-type: application/x-www-form-urlencoded' / form data
app.use(express.json()); // mw for json
app.use(express.static(path.join(__dirname, "public"))); // mw for serve static file (ex: public)
app.use(express.urlencoded({ extended: true })); // mw for cookies
app.use(cookieParser()); // mw for cookiescookieParser());

app.get("/", (req, res) => {
  res.send("this is api-mongodb");
});

// app.get("^/$|/index(.html)?", (req, res) => {
//   // res.sendFile("./views/index.html", { root: __dirname });
//   res.sendFile(path.join(__dirname, "views", "index.html"));
// });
// app.get("/newpage(.html)?", (req, res) => {
//   res.sendFile(path.join(__dirname, "views", "new-page.html"));
// });
// app.get("/oldpage(.html)?", (req, res) => {
//   res.redirect(301, "/newpage");
// });
// app.get("/subdir-page", (req, res) => {
//   res.sendFile(path.join(__dirname, "views", "subdir", "index.html"));
// });

// ------ route ------

app.use("/v0", v0Router);
app.use("/v1", v1Router);
app.use("/v2", v2Router);

// ------ route ------

// --- custom middleware
// const mw1 = (req, res, next) => {
//   req.nama = "ahmad";
//   next();
// };
// const mw2 = (req, res, next) => {
//   req.nama = "abdul";
//   req.umur = 20;
//   console.log(req.umur);
//   next();
// };
// app.use(mw1);
// app.use("/mw-a", mw2, (req, res) => {
//   res.json({
//     nama: req.nama,
//     message: "middleware mw1 dijalankan di semua endpoin di bawahnya, sedangkan mw2 hanya dijalankan di endpoin /mw-a",
//   });
// });
// app.use("/mw-b", (req, res) => {
//   res.json({ nama: req.nama });
// });

app.all("/*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) res.sendFile(path.join(__dirname, "views", "404.html"));
  else if (req.accepts("json")) res.json({ message: "404 Not Found" });
  else res.type("txt").send("404 Not Found");
});

app.use(logError);

db.then(() => {
  app.listen(port, () => console.log(`connect to mongodb and running on http//localhost:${port}`));
}).catch((err) => console.log(err));

// mongoose.connection.once("open", () => {
//   app.listen(port, () => log(`Server connected to mongodb and running on port ${port}`));
// });

// mongoose.connection.on("error", (error) => {
//   // logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, "mongoErrLog.log");
//   console.log(error);
// });

// Status Code
// 200: ok
// 201: created
// 204: no content
// 400: bad request
// 401: unauthorized
// 403: forbidden
// 409: conflict
// 500: internal server error
