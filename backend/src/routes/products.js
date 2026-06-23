const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100); 
    const category = req.query.category || null;
    const cursor = req.query.cursor || null;

    // Build the MongoDB query
    const query = {};

    // If a category filter is provided, add it
    if (category) {
      query.category = category;
    }
    if (cursor) {
      query._id = { $lt: cursor }; // products created before the cursor
    }

    const products = await Product.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1) 
      .lean();
    // Check if there are more pages
    const hasNextPage = products.length > limit;

    // If we fetched extra, remove it from response
    if (hasNextPage) {
      products.pop();
    }

    
    const nextCursor = hasNextPage ? products[products.length - 1]._id : null;

    res.json({
      products,
      nextCursor, 
      hasNextPage,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories.sort());
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;