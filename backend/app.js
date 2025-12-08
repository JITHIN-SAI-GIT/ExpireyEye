// ==================== ENV & DEPENDENCIES ====================
require("dotenv").config(); // load .env FIRST

const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const cors = require("cors");
const API_BASE_URL = "https://expireyeye.onrender.com";
const User = require("./models/User"); // passport-local-mongoose model
const Product = require("./models/Products");
const DashboardRoutes = require("./routes/Dashboardroutes");
const productRoutes = require("./routes/productRoutes");
const Expireeryproducts = require("./routes/ExpieryProducts");

const app = express();

// ==================== DATABASE SETUP ====================

// Read from .env → must match key name in .env
const mongoURI = process.env.ATLAS_URL;

// Optional: for debugging only (avoid logging in production)
// console.log("DEBUG ATLAS_URL:", JSON.stringify(mongoURI));

if (!mongoURI) {
  console.error("❌ ATLAS_URL is NOT defined in .env");
  process.exit(1);
}

// ==================== MIDDLEWARE ====================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const allowedOrigins = [
//   "http://localhost:5173",                    // local frontend
//   "https://expireyeye.onrender.com" // TODO: replace with actual frontend URL later
// ];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow mobile apps / tools (no origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Session (must be before passport.session)
app.use(
  session({
    secret: process.env.SECRET, // move this to process.env in production
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true in production with HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ==================== AUTH ROUTES ====================

// ======================================================
// AUTH ROUTES
// ======================================================

// Signup
app.post("/signup", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = new User({ username, email });
    await User.register(newUser, password);

    res.json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(400).json({ message: "Signup failed", error: err });
  }
});

// Login
app.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "Logged in", user: req.user });
});

// Logout
app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: "Logged out successfully" });
  });
});

// Check authentication status
app.get("/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.status(401).json({ authenticated: false, user: null });
  }
});

// Dashboard (protected)
app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: "Welcome to the dashboard", user: req.user });
  } else {
    res.status(401).json({ message: "You must log in first" });
  }
});

// ======================================================
// EXTRA ROUTES
// ======================================================
app.use("/summary", DashboardRoutes);
app.use("/products", productRoutes);
app.use("/stats", Expireeryproducts);

// ======================================================
// PRODUCT ROUTES
// ======================================================

// Add product (POST)
app.post("/products/add", async (req, res) => {
  try {
    const { name, category, price, quantity, expiryDate } = req.body;

    if (!name || !category || !price || !quantity || !expiryDate) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const username = req.user?.username || "guest"; // fallback if unauthenticated

    const newProduct = new Product({
      name,
      category,
      price,
      quantity,
      expiryDate,
      username,
    });

    await newProduct.save();

    res.json({ msg: "Product added successfully" });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(400).json({ msg: "Failed to add product", error: err });
  }
});

// Get all products
app.get("/products", async (req, res) => {
  try {
    const allProducts = await Product.find();
    res.json(allProducts);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get products expiring in next 7 days
app.get("/products/expiring", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const expiringProducts = await Product.find({
      expiryDate: { $gt: today, $lte: nextWeek },
    });

    res.json(expiringProducts);
  } catch (err) {
    console.error("Error fetching expiring products:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get expired products
app.get("/products/expired", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiredProducts = await Product.find({
      expiryDate: { $lte: today },
    });

    res.json(expiredProducts);
  } catch (err) {
    console.error("Error fetching expired products:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete product by ID
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error while deleting product" });
  }
});

// ==================== DB CONNECT & SERVER START ====================

const PORT = process.env.PORT || 3000;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ Database connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ DB Error:", err);
    process.exit(1);
  });
