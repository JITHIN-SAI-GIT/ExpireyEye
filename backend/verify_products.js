require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Products");

const checkProducts = async () => {
  try {
    const mongoURI = process.env.ATLAS_URL;
    if (!mongoURI) {
        console.error("ATLAS_URL not found in .env");
        process.exit(1);
    }
    await mongoose.connect(mongoURI);
    console.log("Connected to DB");

    const products = await Product.find();
    console.log(`Found ${products.length} products.`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let discrepancies = 0;
    let notRunSince = 0;
    const now = new Date();

    for (const p of products) {
      if (!p.expiryDate) continue;

      const expiry = new Date(p.expiryDate);
      expiry.setHours(0, 0, 0, 0);
      
      const diffTime = expiry.getTime() - today.getTime();
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let expectedDiscount = 0;
      if (daysLeft <= 0) expectedDiscount = 70;
      else if (daysLeft <= 2) expectedDiscount = 50;
      else if (daysLeft <= 5) expectedDiscount = 30;
      else if (daysLeft <= 7) expectedDiscount = 15;
      
      // Stock logic
      if (daysLeft < 10 && p.quantity > 50) {
        expectedDiscount += 10;
      }
      if (expectedDiscount > 90) expectedDiscount = 90;

      // Check last run time (if it ran in the last hour)
      const lastRun = p.last_ml_run ? new Date(p.last_ml_run) : null;
      const hoursSinceRun = lastRun ? (now - lastRun) / (1000 * 60 * 60) : 999;

      if (hoursSinceRun > 1) {
          notRunSince++;
      }

      const currentDiscount = p.ml_discount || 0;
      
      if (currentDiscount !== expectedDiscount) {
          console.log(`[Mismatch] Product: ${p.name}, DaysLeft: ${daysLeft}, Expected: ${expectedDiscount}%, Actual: ${currentDiscount}%`);
          discrepancies++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`- Products needing update: ${discrepancies}`);
    console.log(`- Products not updated in last hour: ${notRunSince}`);
    
    if (discrepancies > 0) {
        console.log("\n⚠️ The ML Logic and DB state are out of sync. This suggests 'recalculate' is NOT running or failing to save.");
    } else {
        console.log("\n✅ ML Logic matches current DB state.");
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkProducts();
