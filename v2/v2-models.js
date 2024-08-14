import mongoose from "mongoose";

const v2UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // mobile: { type: String, unique: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    // cart: { type: Array, default: [] },
    // address: [{ type: ObjectId, ref: "v1address" }],
    // wishlist: [{ type: ObjectId, ref: "v1product" }],
    accessToken: [String],
  },
  {
    timestamps: true,
  }
);

// v2userSchema.pre("save", async function () {
//   const salt = genSaltSync(10);
//   const hash = hashSync(this.password, salt);
//   this.password = hash;
// });

// v2userSchema.method.isPasswordMatched = async function (password) {
//   return compareSync(password, this.password);
// };

const v2KamusSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    reference: [{ refName: { type: String }, refLink: { type: String } }],
  },
  {
    timestamps: true,
  }
);

const v2User = mongoose.model("v2User", v2UserSchema);
const v2Kamus = mongoose.model("v2Kamus", v2KamusSchema);

export { v2User, v2Kamus };
