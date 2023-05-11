const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var ramSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    index: true,
  },
});

//Export the model
module.exports = mongoose.model("Ram", ramSchema);
