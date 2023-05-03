const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
      count: Number,
      color: String,
    },
  ],
  status: {
    type: String,
    default: "Processing",
    enum: ["Processing", "Cancelled", "sucessed"],
  },
  total: Number,
  coupon: {
    type: mongoose.Types.ObjectId,
    ref: "Coupon",
  },
  paymentIntent: {},
  orderBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  slug: {
    type: String,
    // required: true,
  },
});

//Export the model
module.exports = mongoose.model("Order", orderSchema);
