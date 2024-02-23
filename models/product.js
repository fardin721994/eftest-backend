const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  code: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  categories: { type: Array, required: true },
  stock: { type: Number, required: true },
  colors: { type: Array, required: true },
  images: { type: Array, required: true },

  // creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User'}
});

module.exports = mongoose.model("Product", productSchema);
