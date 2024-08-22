import multer from "multer";
import { resolve } from "path";
import { rootPath } from "../config/constants.js";

const upload = multer({ dest: resolve(rootPath, "public/images/v4product") });

export default upload.single("image");

// chatgpt
// import multer from "multer";
// import { resolve } from "path";
// import { rootPath } from "../config/constants.js";

// // Mengatur multer untuk menyimpan file ke folder tertentu
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, resolve(rootPath, "public/images/v3product"));
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname); // Nama file yang unik
//   }
// });

// const upload = multer({ storage });

// // Mengekspor middleware upload untuk menangani satu file dengan field name "file"
// export default upload.single("file");
