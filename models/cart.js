const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema(
  {
    list: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          require: true,
        },
        color: { type: mongoose.Types.ObjectId, ref: "Color" },
        internal: { type: mongoose.Types.ObjectId, ref: "Internal" },
        ram: { type: mongoose.Types.ObjectId, ref: "Ram" },
      },
    ],
    userBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

//Export the model
module.exports = mongoose.model("Cart", cartSchema);
