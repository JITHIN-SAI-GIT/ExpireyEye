const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const cors = require("cors");
const User = require("./models/User"); // Mongoose model with passport-local-mongoose

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Session configuration
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/Expireery")
  .then(() => console.log("Database connected"))
  .catch(err => console.log(err));

// ========== Routes ==========

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
  req.logout(err => {
    if (err) return next(err);
    res.send({ message: "Logged out successfully" });
  });
});

// Protected Dashboard
app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    res.send({ message: "Welcome to the dashboard", user: req.user });
  } else {
    res.status(401).send({ message: "You must log in first" });
  }
});

// Start server
app.listen(3000, () => console.log("Server running on port 3000"));
