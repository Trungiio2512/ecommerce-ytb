const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var bannerSchema = new mongoose.Schema({
  images: {
    type: Array,
    default: [],
    required: true,
  },
  filenames: {
    type: Array,
    default: [],
  },
});

//Export the model
module.exports = mongoose.model("Banner", bannerSchema);
