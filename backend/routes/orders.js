const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Products");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { generateReceiptPDF } = require("../services/pdfService");
const { sendReceiptToWhatsApp } = require("../services/whatsappService");

// Configure Multer for PDF Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "public/receipts";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `Receipt-${Date.now()}.pdf`);
  },
});
const upload = multer({ storage });

// UPLOAD Receipt PDF
router.post("/upload-receipt", upload.single("pdf"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const fileUrl = `${req.protocol}://${req.get("host")}/public/receipts/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// GET all orders (for Reports)
router.get("/", async (req, res) => {
  try {
    // Sort by newest first
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new order (Transaction)
router.post("/", async (req, res) => {
  const { customerName, phoneNumber, totalAmount, paymentMethod, items } = req.body;

  // Start a session for transaction (if replica set enabled, but typical for single instance locally we just do sequential updates)
  // For simplicity and assuming standalone MongoDB, we'll do sequential updates.
  try {
    // 1. Validate Stock
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
      }
    }

    // 2. Reduce Stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity },
      });
    }

    // 3. Create Order
    const newOrder = new Order({
      customerName,
      phoneNumber,
      totalAmount,
      paymentMethod,
      items,
    });

    const savedOrder = await newOrder.save();

    // --- Generate Receipt & Send WhatsApp ---
    try {
      const pdfBuffer = await generateReceiptPDF(savedOrder);
      await sendReceiptToWhatsApp(
        savedOrder.customerName,
        savedOrder.phoneNumber,
        pdfBuffer,
        savedOrder._id
      );
      console.log(`Receipt generated and sent to ${savedOrder.phoneNumber}`);
    } catch (serviceErr) {
      console.error("Receipt Service Error:", serviceErr);
      // We don't fail the order if receipt fails, just log it
    }

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Order Error:", err);
    res.status(500).json({ message: "Failed to process order" });
  }
});

// DELETE specific order
router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
