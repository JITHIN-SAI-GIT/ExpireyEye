const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const cors = require("cors");

const User = require("./models/User"); // passport-local-mongoose model
const Product = require("./models/Products"); // ✅ relative path fixed
const DashboardRoutes = require("./routes/Dashboardroutes");
const productRoutes = require("./routes/productRoutes"); // if used elsewhere
const Expireeryproducts = require("./routes/ExpieryProducts")

const app = express();

// ==================== Middleware ====================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS setup (frontend on port 5173)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // allow session cookies
  })
);

// ✅ Session setup (before passport middleware)
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // should be true in production with HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// ✅ Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ==================== Database ====================

mongoose
  .connect("mongodb://127.0.0.1:27017/Expireery")
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ DB Error:", err));

// ==================== Routes ====================

// Signup
app.post("/signup", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const newUser = new User({ username, email });
    await User.register(newUser, password);
    res.send({ message: "User created successfully" });
  } catch (err) {
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

// Extra routes
app.use("/summary", DashboardRoutes);
app.use("/products", productRoutes); 
app.use("/stats",Expireeryproducts); 
// ==================== Product Routes ====================

// Add product (POST)
app.post("/products/add", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  const { name, category, price, quantity, expiryDate } = req.body;
  const username = req.user.username;

  const newProduct = new Product({
    name,
    category,
    price,
    quantity,
    expiryDate,
    username,
  });

  newProduct
    .save()
    .then(() => res.json({ msg: "Product added successfully" }))
    .catch((err) => res.status(400).json({ msg: "Error: " + err }));
});

// Get all products for logged-in user (GET)
app.get("/products", async  (req, res) =>{
  const Allproducts=await Product.find();
  res.json(Allproducts)
});

app.get("/products/expiring", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // start of today
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const expiringProducts = await Product.find({
      expiryDate: { $gt: today, $lte: nextWeek }
    });

    res.json(expiringProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get already expired products
app.get("/products/expired", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // start of today

    const expiredProducts = await Product.find({
      expiryDate: { $lte: today }
    });

    res.json(expiredProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



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


app.listen(3000, () => console.log("🚀 Server running on port 3000"));
