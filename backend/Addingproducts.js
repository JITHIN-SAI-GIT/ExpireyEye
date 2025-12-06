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

// ✅ Generate expiry dates (some soon, some far)
function randomExpiryDate() {
  const today = new Date();

  // 25% chance product expires soon (within 7 days)
  if (Math.random() < 0.25) {
    const soon = new Date(today);
    soon.setDate(today.getDate() + Math.floor(Math.random() * 7) + 1); // 1–7 days
    return soon;
  }

  // 75% chance it's fresh (1–12 months)
  const future = new Date(today);
  future.setMonth(today.getMonth() + Math.floor(Math.random() * 12) + 1);
  return future;
}

async function seedProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB ✅");

    // Optional: clear previous data
    await Product.deleteMany();
    console.log("Old products cleared ✅");

    // 🔹 Your predefined 100 products
    const baseMockProducts = [
      { "name": "Milk 1", "category": "Dairy", "quantity": 28, "price": 245.55, "expiryDate": "2025-07-14" },
      { "name": "Cheese 2", "category": "Dairy", "quantity": 12, "price": 189.22, "expiryDate": "2025-03-21" },
      { "name": "Butter 3", "category": "Dairy", "quantity": 34, "price": 322.10, "expiryDate": "2025-11-02" },
      { "name": "Yogurt 4", "category": "Dairy", "quantity": 9, "price": 156.77, "expiryDate": "2025-04-11" },
      { "name": "Cream 5", "category": "Dairy", "quantity": 43, "price": 275.30, "expiryDate": "2025-10-07" },

      { "name": "Bread 6", "category": "Bakery", "quantity": 25, "price": 199.66, "expiryDate": "2025-01-29" },
      { "name": "Croissant 7", "category": "Bakery", "quantity": 18, "price": 310.40, "expiryDate": "2025-08-16" },
      { "name": "Bagel 8", "category": "Bakery", "quantity": 11, "price": 140.95, "expiryDate": "2025-09-05" },
      { "name": "Muffin 9", "category": "Bakery", "quantity": 47, "price": 380.77, "expiryDate": "2025-06-13" },
      { "name": "Cake 10", "category": "Bakery", "quantity": 32, "price": 420.55, "expiryDate": "2025-12-22" },

      { "name": "Cola 11", "category": "Beverages", "quantity": 39, "price": 288.90, "expiryDate": "2025-05-03" },
      { "name": "Juice 12", "category": "Beverages", "quantity": 27, "price": 180.66, "expiryDate": "2025-11-28" },
      { "name": "Coffee 13", "category": "Beverages", "quantity": 13, "price": 499.40, "expiryDate": "2025-04-19" },
      { "name": "Tea 14", "category": "Beverages", "quantity": 17, "price": 210.32, "expiryDate": "2025-02-14" },
      { "name": "Energy Drink 15", "category": "Beverages", "quantity": 6, "price": 202.80, "expiryDate": "2025-03-08" },

      { "name": "Chips 16", "category": "Snacks", "quantity": 44, "price": 233.15, "expiryDate": "2025-05-12" },
      { "name": "Cookies 17", "category": "Snacks", "quantity": 15, "price": 344.10, "expiryDate": "2025-09-22" },
      { "name": "Popcorn 18", "category": "Snacks", "quantity": 29, "price": 178.90, "expiryDate": "2025-04-27" },
      { "name": "Nuts 19", "category": "Snacks", "quantity": 10, "price": 455.77, "expiryDate": "2025-07-19" },
      { "name": "Chocolate Bar 20", "category": "Snacks", "quantity": 38, "price": 299.23, "expiryDate": "2025-12-09" },

      { "name": "Apple 21", "category": "Fruits", "quantity": 18, "price": 260.11, "expiryDate": "2025-01-25" },
      { "name": "Banana 22", "category": "Fruits", "quantity": 30, "price": 155.75, "expiryDate": "2025-06-18" },
      { "name": "Orange 23", "category": "Fruits", "quantity": 24, "price": 233.44, "expiryDate": "2025-10-29" },
      { "name": "Mango 24", "category": "Fruits", "quantity": 49, "price": 365.10, "expiryDate": "2025-08-04" },
      { "name": "Grapes 25", "category": "Fruits", "quantity": 41, "price": 412.33, "expiryDate": "2025-03-16" },

      { "name": "Carrot 26", "category": "Vegetables", "quantity": 38, "price": 144.90, "expiryDate": "2025-06-03" },
      { "name": "Tomato 27", "category": "Vegetables", "quantity": 19, "price": 199.77, "expiryDate": "2025-04-09" },
      { "name": "Spinach 28", "category": "Vegetables", "quantity": 44, "price": 155.11, "expiryDate": "2025-05-27" },
      { "name": "Potato 29", "category": "Vegetables", "quantity": 50, "price": 289.55, "expiryDate": "2025-09-08" },
      { "name": "Onion 30", "category": "Vegetables", "quantity": 14, "price": 201.77, "expiryDate": "2025-12-30" },

      { "name": "Chicken Breast 31", "category": "Meat", "quantity": 20, "price": 455.77, "expiryDate": "2025-07-09" },
      { "name": "Beef Steak 32", "category": "Meat", "quantity": 28, "price": 332.45, "expiryDate": "2025-11-17" },
      { "name": "Pork Chops 33", "category": "Meat", "quantity": 13, "price": 389.77, "expiryDate": "2025-05-02" },
      { "name": "Mutton 34", "category": "Meat", "quantity": 9, "price": 480.22, "expiryDate": "2025-03-11" },
      { "name": "Sausages 35", "category": "Meat", "quantity": 36, "price": 265.80, "expiryDate": "2025-10-14" },

      { "name": "Salmon 36", "category": "Seafood", "quantity": 12, "price": 499.10, "expiryDate": "2025-08-07" },
      { "name": "Shrimp 37", "category": "Seafood", "quantity": 17, "price": 229.40, "expiryDate": "2025-04-13" },
      { "name": "Tuna 38", "category": "Seafood", "quantity": 21, "price": 311.33, "expiryDate": "2025-03-01" },
      { "name": "Crab 39", "category": "Seafood", "quantity": 9, "price": 455.50, "expiryDate": "2025-12-11" },
      { "name": "Lobster 40", "category": "Seafood", "quantity": 4, "price": 390.66, "expiryDate": "2025-05-16" },

      { "name": "Pizza 41", "category": "Frozen Foods", "quantity": 35, "price": 233.20, "expiryDate": "2025-09-22" },
      { "name": "French Fries 42", "category": "Frozen Foods", "quantity": 12, "price": 175.77, "expiryDate": "2025-12-03" },
      { "name": "Ice Cream 43", "category": "Frozen Foods", "quantity": 50, "price": 240.99, "expiryDate": "2025-07-19" },
      { "name": "Frozen Vegetables 44", "category": "Frozen Foods", "quantity": 43, "price": 411.13, "expiryDate": "2025-11-12" },
      { "name": "Nuggets 45", "category": "Frozen Foods", "quantity": 16, "price": 185.55, "expiryDate": "2025-03-20" },

      { "name": "Rice 46", "category": "Pantry", "quantity": 47, "price": 220.77, "expiryDate": "2025-05-14" },
      { "name": "Pasta 47", "category": "Pantry", "quantity": 22, "price": 260.55, "expiryDate": "2025-12-01" },
      { "name": "Flour 48", "category": "Pantry", "quantity": 39, "price": 140.33, "expiryDate": "2025-08-13" },
      { "name": "Sugar 49", "category": "Pantry", "quantity": 33, "price": 190.10, "expiryDate": "2025-10-09" },
      { "name": "Salt 50", "category": "Pantry", "quantity": 8, "price": 250.77, "expiryDate": "2025-03-25" },

      { "name": "Shampoo 51", "category": "Personal Care", "quantity": 15, "price": 310.44, "expiryDate": "2025-09-02" },
      { "name": "Soap 52", "category": "Personal Care", "quantity": 18, "price": 129.22, "expiryDate": "2025-02-11" },
      { "name": "Toothpaste 53", "category": "Personal Care", "quantity": 49, "price": 255.77, "expiryDate": "2025-05-29" },
      { "name": "Lotion 54", "category": "Personal Care", "quantity": 27, "price": 412.90, "expiryDate": "2025-04-20" },
      { "name": "Deodorant 55", "category": "Personal Care", "quantity": 21, "price": 365.66, "expiryDate": "2025-11-30" },

      { "name": "Detergent 56", "category": "Household", "quantity": 11, "price": 230.11, "expiryDate": "2025-07-28" },
      { "name": "Dish Soap 57", "category": "Household", "quantity": 32, "price": 155.10, "expiryDate": "2025-01-22" },
      { "name": "Tissue 58", "category": "Household", "quantity": 29, "price": 199.40, "expiryDate": "2025-04-04" },
      { "name": "Cleaner 59", "category": "Household", "quantity": 20, "price": 377.13, "expiryDate": "2025-10-27" },
      { "name": "Air Freshener 60", "category": "Household", "quantity": 16, "price": 290.55, "expiryDate": "2025-08-17" },

      { "name": "Milk 61", "category": "Dairy", "quantity": 7, "price": 289.40, "expiryDate": "2025-02-18" },
      { "name": "Cheese 62", "category": "Dairy", "quantity": 33, "price": 188.77, "expiryDate": "2025-09-09" },
      { "name": "Butter 63", "category": "Dairy", "quantity": 22, "price": 355.99, "expiryDate": "2025-06-11" },
      { "name": "Yogurt 64", "category": "Dairy", "quantity": 39, "price": 198.22, "expiryDate": "2025-03-14" },
      { "name": "Cream 65", "category": "Dairy", "quantity": 17, "price": 210.10, "expiryDate": "2025-12-15" },

      { "name": "Bread 66", "category": "Bakery", "quantity": 44, "price": 311.55, "expiryDate": "2025-05-02" },
      { "name": "Croissant 67", "category": "Bakery", "quantity": 13, "price": 290.80, "expiryDate": "2025-10-30" },
      { "name": "Bagel 68", "category": "Bakery", "quantity": 28, "price": 222.90, "expiryDate": "2025-01-13" },
      { "name": "Muffin 69", "category": "Bakery", "quantity": 18, "price": 388.66, "expiryDate": "2025-07-27" },
      { "name": "Cake 70", "category": "Bakery", "quantity": 31, "price": 350.44, "expiryDate": "2025-04-29" },

      { "name": "Cola 71", "category": "Beverages", "quantity": 42, "price": 205.77, "expiryDate": "2025-08-06" },
      { "name": "Juice 72", "category": "Beverages", "quantity": 37, "price": 288.50, "expiryDate": "2025-11-01" },
      { "name": "Coffee 73", "category": "Beverages", "quantity": 26, "price": 411.10, "expiryDate": "2025-12-24" },
      { "name": "Tea 74", "category": "Beverages", "quantity": 10, "price": 220.40, "expiryDate": "2025-06-05" },
      { "name": "Energy Drink 75", "category": "Beverages", "quantity": 23, "price": 240.90, "expiryDate": "2025-04-17" },

      { "name": "Chips 76", "category": "Snacks", "quantity": 35, "price": 250.30, "expiryDate": "2025-09-03" },
      { "name": "Cookies 77", "category": "Snacks", "quantity": 24, "price": 145.55, "expiryDate": "2025-02-19" },
      { "name": "Popcorn 78", "category": "Snacks", "quantity": 47, "price": 222.18, "expiryDate": "2025-03-07" },
      { "name": "Nuts 79", "category": "Snacks", "quantity": 11, "price": 480.77, "expiryDate": "2025-10-22" },
      { "name": "Chocolate Bar 80", "category": "Snacks", "quantity": 39, "price": 312.40, "expiryDate": "2025-05-28" },

      { "name": "Apple 81", "category": "Fruits", "quantity": 16, "price": 260.88, "expiryDate": "2025-04-15" },
      { "name": "Banana 82", "category": "Fruits", "quantity": 29, "price": 170.11, "expiryDate": "2025-11-26" },
      { "name": "Orange 83", "category": "Fruits", "quantity": 7, "price": 220.55, "expiryDate": "2025-01-18" },
      { "name": "Mango 84", "category": "Fruits", "quantity": 19, "price": 300.77, "expiryDate": "2025-08-03" },
      { "name": "Grapes 85", "category": "Fruits", "quantity": 21, "price": 445.33, "expiryDate": "2025-07-09" },

      { "name": "Carrot 86", "category": "Vegetables", "quantity": 37, "price": 144.87, "expiryDate": "2025-05-05" },
      { "name": "Tomato 87", "category": "Vegetables", "quantity": 23, "price": 195.55, "expiryDate": "2025-12-28" },
      { "name": "Spinach 88", "category": "Vegetables", "quantity": 40, "price": 168.70, "expiryDate": "2025-03-12" },
      { "name": "Potato 89", "category": "Vegetables", "quantity": 50, "price": 260.22, "expiryDate": "2025-10-21" },
      { "name": "Onion 90", "category": "Vegetables", "quantity": 15, "price": 210.10, "expiryDate": "2025-09-30" },

      { "name": "Chicken Breast 91", "category": "Meat", "quantity": 18, "price": 465.20, "expiryDate": "2025-06-25" },
      { "name": "Beef Steak 92", "category": "Meat", "quantity": 27, "price": 355.33, "expiryDate": "2025-05-10" },
      { "name": "Pork Chops 93", "category": "Meat", "quantity": 12, "price": 340.55, "expiryDate": "2025-11-03" },
      { "name": "Mutton 94", "category": "Meat", "quantity": 30, "price": 490.10, "expiryDate": "2025-08-09" },
      { "name": "Sausages 95", "category": "Meat", "quantity": 21, "price": 275.77, "expiryDate": "2025-01-29" },

      { "name": "Salmon 96", "category": "Seafood", "quantity": 6, "price": 485.44, "expiryDate": "2025-03-22" },
      { "name": "Shrimp 97", "category": "Seafood", "quantity": 12, "price": 229.55, "expiryDate": "2025-04-06" },
      { "name": "Tuna 98", "category": "Seafood", "quantity": 29, "price": 318.10, "expiryDate": "2025-07-30" },
      { "name": "Crab 99", "category": "Seafood", "quantity": 17, "price": 430.66, "expiryDate": "2025-10-18" },
      { "name": "Lobster 100", "category": "Seafood", "quantity": 5, "price": 390.55, "expiryDate": "2025-11-28" }
    ];

    // 🔹 Add username + ensure expiryDate is a Date object
    const mockProducts = baseMockProducts.map((p) => ({
      ...p,
      username: randomItem(usernames),
      expiryDate: p.expiryDate ? new Date(p.expiryDate) : randomExpiryDate(),
    }));

    // 🔹 Add 100 more randomly generated products
    for (let i = 0; i < 100; i++) {
      const category = randomItem(categories);
      const baseName = randomItem(productNames[category]);
      const username = randomItem(usernames);
      const expiryDate = randomExpiryDate();

      mockProducts.push({
        name: `${baseName} ${mockProducts.length + 1}`, // keep names somewhat unique
        category,
        quantity: randomQuantity(),
        price: randomPrice(),
        expiryDate,
        username,
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
