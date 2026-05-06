require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const cors = require("cors");
const path = require("path");

const User = require("./models/User");
const Product = require("./models/Products");
const DashboardRoutes = require("./routes/Dashboardroutes");
const productRoutes = require("./routes/productRoutes");
const Expireeryproducts = require("./routes/ExpiryProducts");

const app = express();

// ==================== DATABASE CONFIG ====================

const connectURL = process.env.ATLAS_URL;
console.log("Checking ATLAS_URL...");

if (!connectURL) {
  console.error("❌ ATLAS_URL is NOT defined in .env");
  process.exit(1);
}
console.log("ATLAS_URL is defined.");

// ==================== CORS CONFIG ====================

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:5174"];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error("Not allowed by CORS: " + origin));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ==================== MIDDLEWARE ====================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public")); // Serve static files

app.set("trust proxy", 1); // REQUIRED when using cookies across ports


app.use(session({
  secret: process.env.SECRET || "fallback_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: "lax",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

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

    console.log(username,password,email)

    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fields required" });
    }
    const newUser = new User({ username, email });
    await User.register(newUser, password);
    res.json({ message: "User created successfully" });
  } catch (err) {
    console.error("[SIGNUP ERROR]", err.message || err);
    res.status(400).json({ message: "Signup failed", error: err.message || "An error occurred during signup." });
  }
});

app.post("/login", (req, res, next) => {
  console.log(`[LOGIN ATTEMPT] Username: ${req.body.username}`);
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("[LOGIN ERROR] Server error:", err.message || err);
      return res.status(500).json({ message: "Server error", error: err.message || "An error occurred during login." });
    }
    if (!user) {
      console.warn("[LOGIN FAILED] Invalid credentials:", info);
      return res.status(401).json({ message: "Invalid username or password" });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error("[LOGIN SESSION ERROR] Req.logIn failed:", err.message || err);
        return res.status(500).json({ message: "Session login failed", error: err.message || "Session error." });
      }
      console.log(`[LOGIN SUCCESS] User: ${user.username}`);
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
  if (req.isAuthenticated()) {
    return res.json({ authenticated: true, user: req.user });
  }
  res.status(401).json({ authenticated: false });
});

// Protected dashboard
app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      message: "Welcome to dashboard",
      user: req.user,
    });
  }

  res.status(401).json({ message: "You must log in first" });
});

// ==================== EXTRA ROUTES ====================

app.use("/summary", DashboardRoutes);
app.use("/products", productRoutes);
app.use("/stats", Expireeryproducts);
app.use("/orders", require("./routes/orders"));
app.use("/ml", require("./routes/mlRoutes"));
app.use("/marketing", require("./routes/marketingRoutes"));
app.use("/chat", require("./routes/chatRoutes"));


// ==================== SERVE FRONTEND ====================

// Serve frontend static files
const frontendDistPath = path.join(__dirname, "../project/dist");
app.use(express.static(frontendDistPath));

// Catch-all route to serve the React app for non-API requests
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 3000;

mongoose
  .connect(connectURL)
  .then(() => {
    console.log("✅ Database connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ DB Error:", err);
    process.exit(1);
  });
