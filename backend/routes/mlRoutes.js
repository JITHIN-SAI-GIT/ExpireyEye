const express = require("express");
const router = express.Router();
const { predictDiscount } = require("../services/MLService");
const Product = require("../models/Products");
const auth = require("../middleware/auth");

// 🧠 Trigger ML Engine to Predict Discounts
router.post("/predict-discount", auth, async (req, res) => {
  try {
    const result = await predictDiscount();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "ML Engine failed", error: err.message });
  }
});

// 🏷️ Get Clearance Items
router.get("/clearance", async (req, res) => {
  try {
    const clearanceItems = await Product.find({ clearance_flag: true });
    res.json(clearanceItems);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
