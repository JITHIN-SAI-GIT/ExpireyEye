const express = require("express");
const router = express.Router();
const axios = require("axios");
const Product = require("../models/Products"); // ✅ ensure you have this model

// 🧾 Lookup product info by barcode
router.get("/addproducts/:id", async (req, res) => {
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

// 🆕 Add a new product
router.post("/new", async (req, res) => {
  try {
    const { name, category, quantity, expiryDate } = req.body;

    if (!name || !category || !quantity || !expiryDate) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Save to MongoDB
    const newProduct = new Product({
      name,
      category,
      quantity,
      expiryDate,
    });

    await newProduct.save();

    res.status(201).json({ msg: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ msg: "Server error while adding product" });
  }
});

module.exports = router;
