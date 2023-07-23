const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        color: {
          type: mongoose.Types.ObjectId,
          ref: "Color",
        },
        internal: { type: mongoose.Types.ObjectId, ref: "Internal" },
        ram: { type: mongoose.Types.ObjectId, ref: "Ram" },
      },
    ],
    status: {
      type: String,
      default: "Processing",
      enum: ["Processing", "Cancelled", "Delivering", "Sucessed"],
    },
    totalPrice: Number,
    coupon: {
      type: mongoose.Types.ObjectId,
      ref: "Coupon",
    },
    paymentIntent: {},
    orderBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    address: {
      type: String,
      require: true,
    },
  },
  { timestamps: true },
);

//Export the model
module.exports = mongoose.model("Order", orderSchema);
