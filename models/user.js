const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
      default: "",
    },
    fileName: {
      type: String,
      default: "",
    },
    firstName: {
      type: String,
      required: true,
      index: true,
    },
    lastName: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      // required: true,
      default: "user",
    },
    cart: { type: mongoose.Types.ObjectId, ref: "Cart" },
    order: [{ type: mongoose.Types.ObjectId, ref: "Order" }],

    address: {
      type: String,
      default: "",
    },
    wishlist: { type: mongoose.Types.ObjectId, ref: "WishList" },
    isBLocked: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    passwordChangeAt: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpired: {
      type: String,
    },
    registerToken: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods = {
  isCorrectPassword: async function (password) {
    return await bcrypt.compare(password, this.password);
  },
  createPasswordChangeToken: async function () {
    const hash = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256").update(hash).digest("hex");
    this.passwordResetExpired = Date.now() + 15 * 60 * 1000;
    return hash;
  },
};

//Export the model
module.exports = mongoose.model("User", userSchema);
