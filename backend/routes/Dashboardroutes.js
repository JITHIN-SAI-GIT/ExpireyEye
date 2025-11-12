// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Products'); // <-- Make sure this path is correct

// @route   GET api/dashboard/summary
// @desc    Get all data needed for the main dashboard
// @access  Private
router.get('/summary', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    // --- Dashboard summary counts ---
    const totalProducts = await Product.countDocuments();
    const expiringSoon = await Product.countDocuments({
      expiryDate: { $gte: today, $lte: nextWeek },
    });
    const expiredToday = await Product.countDocuments({
      expiryDate: { $gte: today, $lt: tomorrow },
    });

    // --- Urgent items (expiring within a week) ---
    const urgentItems = await Product.find({
      expiryDate: { $gte: today, $lte: nextWeek },
    })
      .sort({ expiryDate: 1 })
      .limit(5);

    // --- All products (for dashboard table & charts) ---
    const allProducts = await Product.find().sort({ expiryDate: 1 });

    // --- Send everything in one JSON ---
    res.json({
      totalProducts,
      expiringSoon,
      expiredToday,
      urgentItems,
      allProducts,
    });
  } catch (err) {
    console.error("Error in /api/dashboard/summary:", err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
