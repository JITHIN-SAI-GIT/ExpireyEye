const express = require("express");
const router = express.Router();
const { generateChatResponse } = require("../services/chatService");

// Middleware to ensure user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  // For development/testing if auth isn't fully set up yet, you might want to bypass
  // return next(); 
  res.status(401).json({ message: "Unauthorized" });
};

// POST /api/chat
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const response = await generateChatResponse(message, req.user._id);
    
    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: "Failed to process chat message", error: error.message });
  }
});

module.exports = router;
