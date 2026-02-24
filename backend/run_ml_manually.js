require("dotenv").config();
const mongoose = require("mongoose");
const { predictDiscount } = require("./services/MLService");

const run = async () => {
    try {
        await mongoose.connect(process.env.ATLAS_URL);
        console.log("Connected to DB");
        
        console.log("Running ML Engine...");
        const result = await predictDiscount();
        console.log("Result:", result);
        
        console.log("✅ ML Engine ran successfully.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Failed:", err);
        process.exit(1);
    }
};

run();
