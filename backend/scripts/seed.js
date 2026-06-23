// seed.js — generates 200,000 products quickly using batch inserts

require("dotenv").config({ path: require("path").join(__dirname, "../.env") }); // adjust path if needed
const mongoose = require("mongoose");
const Product = require("../src/models/Product");

// Product data to randomize from
const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Kitchen",
  "Sports",
  "Toys",
  "Beauty",
  "Automotive",
  "Garden",
  "Food",
];

const ADJECTIVES = [
  "Premium",
  "Classic",
  "Modern",
  "Vintage",
  "Deluxe",
  "Ultra",
  "Pro",
  "Essential",
  "Compact",
  "Smart",
];

const NOUNS = [
  "Widget",
  "Gadget",
  "Tool",
  "Device",
  "Kit",
  "Pack",
  "Set",
  "Bundle",
  "Item",
  "Product",
];

// Returns a random element from an array
function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generates a single random product object (NOT saved to DB yet)
function generateProduct(index) {
  return {
    name: `${randomFrom(ADJECTIVES)} ${randomFrom(NOUNS)} ${index}`,
    category: randomFrom(CATEGORIES),
    price: parseFloat((Math.random() * 990 + 10).toFixed(2)), // $10 to $1000
  };
}

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data so we start fresh
    await Product.deleteMany({});
    console.log("Cleared existing products");

    const TOTAL = 200000;
    const BATCH_SIZE = 5000; // insert 5000 at a time — fast and memory safe
    const totalBatches = TOTAL / BATCH_SIZE;

    console.log(`Inserting ${TOTAL} products in ${totalBatches} batches...`);

    for (let batch = 0; batch < totalBatches; batch++) {
      // Build an array of 5000 products
      const products = [];
      for (let i = 0; i < BATCH_SIZE; i++) {
        const globalIndex = batch * BATCH_SIZE + i + 1;
        products.push(generateProduct(globalIndex));
      }

      // Insert entire batch at once — much faster than one-by-one
      await Product.insertMany(products, { ordered: false });

      // Progress update
      const inserted = (batch + 1) * BATCH_SIZE;
      console.log(`Inserted ${inserted}/${TOTAL} products`);
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();