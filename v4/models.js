import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, minLength: [3, "3 characthers length required"], required: true },
    price: { type: Number, required: true },
    imageName: String,
    imageUrl: String,
  },
  { timestamps: true }
);

const Products = mongoose.model("v4Products", productSchema);

export { Products };
