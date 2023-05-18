const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
  list: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
      },
      color: { type: mongoose.Types.ObjectId, ref: "Color" },
    },
  ],
  userBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

//Export the model
module.exports = mongoose.model("Cart", cartSchema);
