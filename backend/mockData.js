const mongoose = require("mongoose");
const Product = require("./models/Products"); // ✅ fixed correct path

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
    await mongoose.connect("mongodb://127.0.0.1:27017/Expireery"); // ✅ use your main DB
    console.log("Connected to MongoDB ✅");

    await Product.deleteMany(); // Clear existing data (optional)

    const mockProducts = [
       {
    name: "Milk",
    category: "Dairy",
    quantity: 10,
    price: 40,
    expiryDate: new Date("2025-02-10"),
    username: "admin",
  },
  {
    name: "Bread",
    category: "Bakery",
    quantity: 20,
    price: 30,
    expiryDate: new Date("2025-01-20"),
    username: "store1",
  }
    ];

    for (let i = 0; i < 100; i++) {
      const category = randomItem(categories);
      const name = randomItem(productNames[category]);
      const username = randomItem(usernames);
      const expiryDate = randomExpiryDate();

      mockProducts.push({
        name: `${name} ${i + 1}`,
        category,
        quantity: randomQuantity(),
        price: randomPrice(),
        expiryDate,
        username,
      });
    }

    await Product.insertMany(mockProducts);
    console.log("✅ 100 mock grocery products inserted successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    mongoose.connection.close();
  }
}

seedProducts();
