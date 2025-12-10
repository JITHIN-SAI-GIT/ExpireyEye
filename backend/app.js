// ==================== ENV & DEPENDENCIES ====================
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const cors = require("cors");

const User = require("./models/User");
const Product = require("./models/Products");
const DashboardRoutes = require("./routes/Dashboardroutes");
const productRoutes = require("./routes/productRoutes");
const Expireeryproducts = require("./routes/ExpieryProducts");

const app = express();

// Trust proxy (Render / any reverse proxy) - REQUIRED for secure cookies
app.set("trust proxy", 1);

// ==================== DATABASE CONFIG ====================

const mongoURI = process.env.ATLAS_URL;

if (!mongoURI) {
  console.error("❌ ATLAS_URL is NOT defined in .env");
  process.exit(1);
}

// ==================== CORS CONFIG ====================

// Frontend origins that are allowed to call this API
const allowedOrigins = [
  "http://localhost:5173",                    // Local Vite dev
  "https://expireyeyefrontend.onrender.com",  // Deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow non-browser tools (Postman, curl) without Origin
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS: " + origin));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // allow cookies
  })
);

// Optional: clean CORS error response instead of crashing
app.use((err, req, res, next) => {
  if (err && err.message && err.message.startsWith("Not allowed by CORS")) {
    return res.status(403).json({ message: err.message });
  }
  next(err);
});

// ==================== MIDDLEWARE ====================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      // IMPORTANT for Render (HTTPS, cross-domain with frontend):
      // - In production: secure cookie + SameSite=None (so browser sends cookie)
      // - In dev: non-secure, SameSite=Lax (localhost)
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

// ==================== PASSPORT ====================

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
    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fields required" });
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
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Server error" });
    }
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("req.logIn error:", err);
        return res.status(500).json({ message: "Login failed" });
      }

      // At this point, session cookie should be set
      console.log("✅ Login success for:", user.username);
      return res.json({ message: "Logged in", user });
    });
  })(req, res, next);
});

// Logout
app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: "Logged out successfully" });
  });
});

// Check auth
app.get("/check-auth", (req, res) => {
  console.log("🔎 /check-auth isAuthenticated:", req.isAuthenticated());
  if (req.isAuthenticated()) {
    return res.json({ authenticated: true, user: req.user });
  }
  res.status(401).json({ authenticated: false });
});

// Protected dashboard
app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ message: "Welcome to dashboard", user: req.user });
  }
  res.status(401).json({ message: "You must log in first" });
});

// ==================== EXTRA ROUTES ====================

app.use("/summary", DashboardRoutes);
app.use("/products", productRoutes);
app.use("/stats", Expireeryproducts);

// ==================== PRODUCT ROUTES (basic CRUD) ====================

// Add a product
app.post("/products/add", async (req, res) => {
  try {
    const { name, category, price, quantity, expiryDate } = req.body;

    if (!name || !category || !price || !quantity || !expiryDate) {
      return res
        .status(400)
        .json({ msg: "All product fields are required" });
    }

    const username = req.user?.username || "guest";

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
    console.error("Add product error:", err);
    res.status(400).json({ msg: "Failed to add product", error: err });
  }
});

// Get all products
app.get("/products", async (req, res) => {
  try {
    const items = await Product.find();
    res.json(items);
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Products expiring soon
app.get("/products/expiring", async (req, res) => {
  try {
    const today = new Date();
  today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const expiring = await Product.find({
      expiryDate: { $gt: today, $lte: nextWeek },
    });

    res.json(expiring);
  } catch (err) {
    console.error("Get expiring products error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get expired items
app.get("/products/expired", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expired = await Product.find({
      expiryDate: { $lte: today },
    });

    res.json(expired);
  } catch (err) {
    console.error("Get expired products error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete
app.delete("/products/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Error deleting product" });
  }
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 3000;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ Database connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ DB Error:", err);
    process.exit(1);
  });
