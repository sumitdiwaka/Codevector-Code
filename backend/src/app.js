require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // allow frontend to call this API
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);

// Health check — useful for Render to confirm service is alive
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start server only after DB is connected
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});