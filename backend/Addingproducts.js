const mongoose = require("mongoose");
const Product = require("./models/Products"); // ✅ correct path
require("dotenv").config();
// ✅ If you want to use Atlas URL from .env, uncomment next 2 lines:
// require("dotenv").config();
// const MONGODB_URI = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/Expireery";

// ✅ For now using local DB (change this if needed)
const MONGODB_URI = process.env.ATLAS_URL;
const categories = [
  "Dairy",
  "Bakery",
  "Beverages",
  "Snacks",
  "Fruits",
  "Vegetables",
  "Meat",
  "Seafood",
  "Frozen Foods",
  "Pantry",
  "Personal Care",
  "Household",
];

const usernames = ["admin", "store1", "manager", "employeeA", "employeeB"];

const productNames = {
  Dairy: ["Milk", "Cheese", "Butter", "Yogurt", "Cream"],
  Bakery: ["Bread", "Croissant", "Bagel", "Muffin", "Cake"],
  Beverages: ["Cola", "Juice", "Coffee", "Tea", "Energy Drink"],
  Snacks: ["Chips", "Cookies", "Popcorn", "Nuts", "Chocolate Bar"],
  Fruits: ["Apple", "Banana", "Orange", "Mango", "Grapes"],
  Vegetables: ["Carrot", "Tomato", "Spinach", "Potato", "Onion"],
  Meat: ["Chicken Breast", "Beef Steak", "Pork Chops", "Mutton", "Sausages"],
  Seafood: ["Salmon", "Shrimp", "Tuna", "Crab", "Lobster"],
  "Frozen Foods": ["Pizza", "French Fries", "Ice Cream", "Frozen Vegetables", "Nuggets"],
  Pantry: ["Rice", "Pasta", "Flour", "Sugar", "Salt"],
  "Personal Care": ["Shampoo", "Soap", "Toothpaste", "Lotion", "Deodorant"],
  Household: ["Detergent", "Dish Soap", "Tissue", "Cleaner", "Air Freshener"],
};

    // 🧩 Utility functions
    function randomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function randomPrice() {
        return parseFloat((Math.random() * 500 + 20).toFixed(2));
    }

    function randomQuantity() {
        return Math.floor(Math.random() * 50) + 1;
    }

    // ✅ Generate realistic expiry dates relative to today
    function generateSmartExpiryDate() {
        const today = new Date();
        const rand = Math.random();

        if (rand < 0.15) {
            // 💀 15% Expired (1 to 30 days ago)
            const past = new Date(today);
            past.setDate(today.getDate() - Math.floor(Math.random() * 30) - 1);
            return past;
        } else if (rand < 0.30) {
            // ⚠️ 15% Expiring Soon (1 to 7 days from now)
            const soon = new Date(today);
            soon.setDate(today.getDate() + Math.floor(Math.random() * 7) + 1);
            return soon;
        } else {
            // 🟢 70% Fresh (8 days to 1 year from now)
            const fresh = new Date(today);
            fresh.setDate(today.getDate() + Math.floor(Math.random() * 360) + 8);
            return fresh;
        }
    }

    async function seedProducts() {
        try {
            await mongoose.connect(MONGODB_URI);
            console.log("Connected to MongoDB ✅");

            // Optional: clear previous data
            await Product.deleteMany();
            console.log("Old products cleared ✅");

            // 🔹 Base products with just Names (Dates will be dynamic)
            const baseNames = [
                { name: "Milk", category: "Dairy" }, { name: "Cheese", category: "Dairy" }, { name: "Butter", category: "Dairy" },
                { name: "Bread", category: "Bakery" }, { name: "Croissant", category: "Bakery" }, { name: "Bagel", category: "Bakery" },
                { name: "Cola", category: "Beverages" }, { name: "Juice", category: "Beverages" }, { name: "Coffee", category: "Beverages" },
                { name: "Chips", category: "Snacks" }, { name: "Cookies", category: "Snacks" }, { name: "Popcorn", category: "Snacks" },
                { name: "Apple", category: "Fruits" }, { name: "Banana", category: "Fruits" }, { name: "Orange", category: "Fruits" },
                { name: "Carrot", category: "Vegetables" }, { name: "Tomato", category: "Vegetables" }, { name: "Spinach", category: "Vegetables" },
                { name: "Chicken Breast", category: "Meat" }, { name: "Beef Steak", category: "Meat" }, { name: "Pork Chops", category: "Meat" },
                { name: "Salmon", category: "Seafood" }, { name: "Shrimp", category: "Seafood" }, { name: "Tuna", category: "Seafood" },
                { name: "Pizza", category: "Frozen Foods" }, { name: "Ice Cream", category: "Frozen Foods" }, { name: "Fries", category: "Frozen Foods" },
                { name: "Rice", category: "Pantry" }, { name: "Pasta", category: "Pantry" }, { name: "Flour", category: "Pantry" },
                { name: "Shampoo", category: "Personal Care" }, { name: "Soap", category: "Personal Care" }, { name: "Lotion", category: "Personal Care" },
                { name: "Detergent", category: "Household" }, { name: "Cleaner", category: "Household" }, { name: "Tissue", category: "Household" }
            ];

            const mockProducts = [];

            // Generate 200 items
            for (let i = 0; i < 200; i++) {
                // Pick a base template or random
                const template = randomItem(baseNames);
                const isTemplate = Math.random() < 0.3; // 30% chance to stick to simple name
                
                const category = isTemplate ? template.category : randomItem(categories);
                const nameRoot = isTemplate ? template.name : randomItem(productNames[category] || ["Generic Item"]);
                
                mockProducts.push({
                    name: `${nameRoot} ${Math.floor(Math.random() * 1000)}`,
                    category: category,
                    quantity: randomQuantity(),
                    price: randomPrice(),
                    expiryDate: generateSmartExpiryDate(),
                    username: randomItem(usernames),
                });
            }

            const result = await Product.insertMany(mockProducts);
            console.log(`✅ ${result.length} products inserted successfully!`);

            await mongoose.connection.close();
            console.log("MongoDB connection closed ✅");
        } catch (err) {
            console.error("❌ Error seeding data:", err);
            await mongoose.connection.close();
        }
    }

seedProducts();
