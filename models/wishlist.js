const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var wishlistSchema = new mongoose.Schema(
  {
    list: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
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
module.exports = mongoose.model("WishList", wishlistSchema);
