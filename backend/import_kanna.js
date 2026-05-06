const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();
const User = require("./models/User"); // Assuming User.js is the user model

mongoose.connect(process.env.ATLAS_URL)
  .then(async () => {
    try {
      const kannaData = JSON.parse(fs.readFileSync("testuser2.json", "utf8"));
      
      // Upsert kanna user
      await User.findOneAndUpdate(
        { email: kannaData.email },
        kannaData,
        { upsert: true, new: true }
      );
      
      console.log("testuser2 imported successfully!");
    } catch (err) {
      console.error("Error importing kanna:", err.message);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
