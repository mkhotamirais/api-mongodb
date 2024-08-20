import mongoose from "mongoose";

const kamusSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    reference: [{ refName: { type: String }, refLink: { type: String } }],
  },
  {
    timestamps: true,
  }
);

const tagSchema = new mongoose.Schema({ name: { type: String, required: true, unique: true } }, { timestamps: true });

const categorySchema = new mongoose.Schema(
  { name: { type: String, required: true, unique: true } },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, requried: true, unique: true },
    price: { type: Number, required: true },
    tag: [{ type: mongoose.Schema.Types.ObjectId, ref: "v3Tags", required: true }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "v3Categories",
      required: true,
    },
    description: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "b3Users" },
  },
  {
    timestamps: true,
  }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, requried: true, unique: true },
    password: { type: String, requried: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    accessToken: [String],
  },
  {
    timestamps: true,
  }
);

const Kamuss = mongoose.model("v3Kamuss", kamusSchema);
const Tags = mongoose.model("v3Tags", tagSchema);
const Categories = mongoose.model("v3Categories", categorySchema);
const Products = mongoose.model("v3Products", productSchema);
const Users = mongoose.model("v3Users", userSchema);

export { Kamuss, Tags, Categories, Products, Users };
