import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    accessToken: [String],
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("v2User", userSchema);
const Products = mongoose.model("v2Product", productSchema);

export { Users, Products };
