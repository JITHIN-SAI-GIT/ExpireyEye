
const express = require("express");
const router = express.Router();
const axios = require("axios");


router.get("/stats", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the start of today

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // The start of tomorrow

    // 👇 CHANGE IS HERE: Define the end of the 2-day window
    // This will be the beginning of the day after tomorrow.
    const twoDaysLater = new Date(today);
    twoDaysLater.setDate(today.getDate() + 3);

    // 1. Get total number of products
    const totalProducts = await Product.countDocuments({});

    // 2. Get count of products expiring within the next 2 days (i.e., tomorrow and the day after)
    const expiringSoon = await Product.countDocuments({
      expiryDate: {
        $gte: tomorrow,      // From the start of tomorrow
        $lt: twoDaysLater,   // But before the start of the day after tomorrow
      },
    });
    
    // 3. Get count of products that expire today
    const expiredToday = await Product.countDocuments({
      expiryDate: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    res.json({
      totalProducts,
      expiringSoon,
      expiredToday,
    });
  } catch (error) {
    console.error("Error fetching product stats:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;