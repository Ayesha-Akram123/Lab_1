const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  isFeatured: { type: Boolean, default: false },
  image: { type: String, required: true }, // Path to the uploaded image
});

module.exports = mongoose.model("Product", productSchema);
