const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var internalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamps: true },
);

//Export the model
module.exports = mongoose.model("Internal", internalSchema);
