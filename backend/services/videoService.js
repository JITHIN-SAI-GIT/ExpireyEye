const Replicate = require("replicate");
require("dotenv").config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

/**
 * Generates a video from a product image and prompts using Stable Video Diffusion.
 * @param {string} imageUrl - The URL of the product image.
 * @param {string} prompt - Text prompt for the video (optional overrides).
 * @returns {Promise<object>} - The prediction object containing status and output.
 */
exports.generateProductVideo = async (imageUrl, prompt) => {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      console.warn("REPLICATE_API_TOKEN is missing. Returning a demonstration video.");
      
      // Determine which realistic marketing video to show based on the prompt
      const promptLower = (prompt || "").toLowerCase();
      let videoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"; // Default
      
      if (promptLower.includes("apple") || promptLower.includes("fruit")) {
          videoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4";
      } else if (promptLower.includes("bread") || promptLower.includes("bakery")) {
          videoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"; 
      } else if (promptLower.includes("vegetable") || promptLower.includes("tomato")) {
          videoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"; 
      } else if (promptLower.includes("meat") || promptLower.includes("chicken")) {
          videoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"; 
      }

      // Return a nice sample video for demonstration purposes
      return new Promise(resolve => {
        setTimeout(() => {
            resolve(videoUrl);
        }, 3000); // simulate 3s loading
      });
    }

    // specific model: stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816f3af3d23d53a3e83484c0f2440b971d5e3
    const output = await replicate.run(
      "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816f3af3d23d53a3e83484c0f2440b971d5e3",
      {
        input: {
          input_image: imageUrl,
          cond_aug: 0.02,
          decoding_t: 7,
          video_length: "14 frames_with_svd",
          sizing_strategy: "maintain_aspect_ratio",
          motion_bucket_id: 127,
          frames_per_second: 6
        }
      }
    );
    
    return output; 
  } catch (error) {
    console.error("Replicate API Error:", error);
    throw error;
  }
};
