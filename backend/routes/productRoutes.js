const express = require("express");
const router = express.Router();
const axios = require("axios");
const Product = require("../models/Products");
const auth = require("../middleware/auth");

// 🧾 Lookup product info by barcode
router.get("/addproducts/:barcode", async (req, res) => {
  const barcode = req.params.barcode;

  if (!barcode) {
    return res.status(400).json({ msg: "Barcode is required" });
  }

  try {
    const response = await axios.get(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );

    if (response.data.status === 0) {
      return res.status(404).json({ msg: "Product not found in database" });
    }

    const productData = response.data.product;
    const productInfo = {
      name: productData.product_name || "Unknown Product",
      category: productData.categories
        ? productData.categories.split(",")[0].trim()
        : "General",
    };

    res.json(productInfo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 🆕 Add a new product (Legacy/Alternative)
router.post("/new", auth, async (req, res) => {
  try {
    const { name, category, quantity, expiryDate, image } = req.body;

    if (!name || !category || !quantity || !expiryDate) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const newProduct = new Product({
      name,
      category,
      quantity,
      expiryDate,
      image: image || ""
    });

    await newProduct.save();

    res.status(201).json({ msg: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ msg: "Server error while adding product" });
  }
});

// Add a product (Main used by frontend)
router.post("/add", auth, async (req, res) => {
  try {
    const { name, category, price, quantity, expiryDate, image } = req.body;

    if (!name || !category || !price || !quantity || !expiryDate) {
      return res.status(400).json({ msg: "All product fields are required" });
    }

    const username = req.user?.username || "guest";

    const newProduct = new Product({
      name,
      category,
      price,
      quantity,
      expiryDate,
      image: image || "",
      username,
    });

    await newProduct.save();
    res.json({ msg: "Product added successfully" });
  } catch (err) {
    res.status(400).json({ msg: "Failed to add product", error: err });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const items = await Product.find();
    res.json(items);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Urgent items (Next 48 hours)
router.get("/urgent", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const next48Hours = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);

    const urgent = await Product.find({
      expiryDate: { $gt: today, $lte: next48Hours },
    });

    res.json(urgent);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Products expiring soon (Next 7 days)
router.get("/expiring", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const expiring = await Product.find({
      expiryDate: { $gt: today, $lte: nextWeek },
    });

    res.json(expiring);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Get expired items
router.get("/expired", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expired = await Product.find({
      expiryDate: { $lte: today },
    });

    res.json(expired);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// 🏷️ Manually Apply Discount
router.post("/:id/discount", auth, async (req, res) => {
  try {
    const { discount } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.ml_discount = discount || 50; // Default to 50% if not specified
    product.clearance_flag = true;
    product.info_updated = new Date(); // Track when it was manually updated

    await product.save();

    res.json({ message: "Discount applied successfully", product });
  } catch (err) {
    console.error("Error applying discount:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete product
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch {
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;




