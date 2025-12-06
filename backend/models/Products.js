const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  category: String,
  quantity: { 
    type: Number, 
    required: true 
  },
  price: { // <-- ADD THIS: What YOU paid for the item
    type: Number, 
    required: true 
  },
  expiryDate: Date,
});

module.exports = mongoose.model("Product", productSchema);