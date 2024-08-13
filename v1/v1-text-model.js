import mongoose from "mongoose";

const v1TextSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("v1Text", v1TextSchema);
