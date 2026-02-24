const express = require("express");
const router = express.Router();
const { generateProductVideo } = require("../services/videoService");
const auth = require("../middleware/auth"); // Assuming auth middleware exists

// Generate Video for Product
router.post("/generate-video", auth, async (req, res) => {
  try {
    const { imageUrl, prompt } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "Image URL is required" });
    }

    console.log("Generating video for:", imageUrl);
    const videoOutput = await generateProductVideo(imageUrl, prompt);
    
    // stable-video-diffusion output is usually a list of URLs or a single URL
    res.json({ videoUrl: videoOutput });
  } catch (error) {
    console.error("Video Generation Error:", error);
    res.status(500).json({ message: "Failed to generate video", error: error.message });
  }
});

module.exports = router;
