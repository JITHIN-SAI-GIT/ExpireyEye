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
      throw new Error("REPLICATE_API_TOKEN is missing in environment variables.");
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

    // Replicate run returns the output directly if it's sync, or we might need predictions.create for async polling.
    // For large models, it usually waits or we can use predictions.
    // However, replicate.run retrieves the output. If it times out or needs async, we should use predictions.create.
    // For SVD, it might be slow. Let's use predictions to be safe if we want to poll, 
    // but replicate.run polls by default in the node js SDK until completion.
    
    return output; 
  } catch (error) {
    console.error("Replicate API Error:", error);
    throw error;
  }
};
