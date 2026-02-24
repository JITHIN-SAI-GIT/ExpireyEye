const Replicate = require("replicate");
const Product = require("../models/Products");
const User = require("../models/User");
// If you have an Order model, import it here
// const Order = require("../models/Order"); 
require("dotenv").config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

/**
 * Generates a chat response using Replicate's Llama 3 model,
 * with context from the project's database.
 * 
 * @param {string} userMessage - The user's question or prompt.
 * @param {string} userId - The ID of the authenticated user (for context).
 * @returns {Promise<string>} - The AI's response.
 */
exports.generateChatResponse = async (userMessage, userId) => {
  try {
    // 1. Fetch relevant data from the database to build context
    // Limit to a reasonable amount of data to fit in context window
    const products = await Product.find().limit(20).lean(); 
    const totalProducts = await Product.countDocuments();
    // const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).lean();
    
    // 2. Construct the system prompt with this data
    const systemPrompt = `
You are an AI Assistant for the "Expireery" project, a grocery store management system.
Your goal is to help the store manager by answering questions about their inventory, sales, and products.

Current Database Context:
- Total Products in Database: ${totalProducts}
- Sample Products: ${JSON.stringify(products.map(p => ({ name: p.name, category: p.category, expiryDate: p.expiryDate, quantity: p.quantity })))}

Instructions:
- Answer questions based on the provided context.
- If the answer is not in the context, say "I don't have that information right now."
- Be helpful, concise, and professional.
- Use the provided product data to answer questions about specific items, categories, or expiry dates.
    `;

    console.log("Sending prompt to Replicate...");

    // 3. Call Replicate API (Llama 3)
    const input = {
      prompt: userMessage,
      system_prompt: systemPrompt,
      max_tokens: 512,
      min_tokens: 0,
      temperature: 0.7,
      top_p: 0.9,
      top_k: 50
    };

    // Using meta/meta-llama-3-8b-instruct
    const output = await replicate.run("meta/meta-llama-3-8b-instruct", { input });
    
    // Replicate returns an array of strings for Llama 3 stream, join them
    return Array.isArray(output) ? output.join("") : output;

  } catch (error) {
    console.error("AI Chat Service Error:", error);
    throw new Error("Failed to generate AI response");
  }
};
