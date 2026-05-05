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
  image: {
    type: String,
    default: ""
  },
  expiryDate: Date,
  username: { type: String, default: "admin" }, // Track who added it
  info_updated: { type: Date, default: Date.now }, // Track manual updates
  // 🧠 ML / Smart Discount Fields
  ml_discount: { type: Number, default: 0 },
  clearance_flag: { type: Boolean, default: false },
  sale_probability: { type: Number, default: 0 }, // 0-100%
  last_ml_run: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);