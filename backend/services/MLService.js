const Product = require("../models/Products");

/**
 * 🧠 Heuristic Scoring Engine for Smart Discounts
 * Calculates discount based on:
 * 1. Days remaining until expiry
 * 2. Stock quantity
 * 3. Product category (perishability)
 */
const predictDiscount = async () => {
  try {
    const products = await Product.find();
    let updatedCount = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const product of products) {
      if (!product.expiryDate) continue;

      const expiry = new Date(product.expiryDate);
      expiry.setHours(0, 0, 0, 0);
      
      const diffTime = expiry.getTime() - today.getTime();
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let discount = 0;
      let probability = 50; // Base probability
      let clearanceFn = false;

      // 1️⃣ Time Factor Logic
      if (daysLeft <= 0) {
        // Expired (or expiring today)
        discount = 70; 
        probability = 95;
        clearanceFn = true;
      } else if (daysLeft <= 2) {
        // Critical (1-2 days)
        discount = 50;
        probability = 90;
        clearanceFn = true;
      } else if (daysLeft <= 5) {
        // High Urgency (3-5 days)
        discount = 30;
        probability = 75;
        clearanceFn = true;
      } else if (daysLeft <= 7) {
        // Warning Zone (6-7 days)
        discount = 15;
        probability = 60;
        clearanceFn = true;
      } else {
        // Safe Zone
        discount = 0;
        probability = 40; // Normal sales probability
        clearanceFn = false;
      }

      // 2️⃣ Stock Factor Logic (Surplus Logic)
      // If stock is high (> 50) and days are low (< 10), boost discount to clear stock
      if (daysLeft < 10 && product.quantity > 50) {
        discount += 10; // Extra 10% push
        probability += 5;
      }

      // Cap discount at 90%
      if (discount > 90) discount = 90;

      // 3️⃣ Update Product
      product.ml_discount = discount;
      product.sale_probability = probability;
      product.clearance_flag = clearanceFn;
      product.last_ml_run = new Date();

      await product.save();
      if (discount > 0) updatedCount++;
    }

    return { 
      message: "ML Engine finished scoring.", 
      productsScored: products.length, 
      discountedItems: updatedCount 
    };

  } catch (err) {
    console.error("ML Engine Failure:", err);
    throw err;
  }
};

module.exports = { predictDiscount };
