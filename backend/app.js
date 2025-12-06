// ==================== ENV & DEPENDENCIES ====================
require("dotenv").config(); // load .env FIRST

const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const cors = require("cors");

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

// CORS (frontend on port 5173)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // allow session cookies
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

// Signup
app.post("/signup", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const newUser = new User({ username, email });
    await User.register(newUser, password);
    res.send({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(400).send(err);
  }
});

// Login
app.post("/login", passport.authenticate("local"), (req, res) => {
  res.send({ message: "Logged in", user: req.user });
});

// Logout
app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.send({ message: "Logged out successfully" });
  });
});

// Check authentication status
app.get("/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
});

// Dashboard (protected)
app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    res.send({ message: "Welcome to the dashboard", user: req.user });
  } else {
    res.status(401).send({ message: "You must log in first" });
  }
});

// ==================== EXTRA ROUTES ====================

app.use("/summary", DashboardRoutes);
app.use("/products", productRoutes);
app.use("/stats", Expireeryproducts);

// ==================== PRODUCT ROUTES ====================

// Add product (POST)
app.post("/products/add", async (req, res) => {
  try {
    // if (!req.isAuthenticated()) {
    //   return res.status(401).json({ msg: "Unauthorized" });
    // }

    const { name, category, price, quantity, expiryDate } = req.body;
    const username = req.user?.username || "guest"; // fallback if not authenticated

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
    res.status(400).json({ msg: "Error: " + err });
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

// Get already expired products
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

    res.status(200).json({ message: "Product deleted successfully" });
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
