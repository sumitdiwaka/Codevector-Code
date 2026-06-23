const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
   
    timestamps: true,
  }
);

productSchema.index({ category: 1, _id: -1 });

productSchema.index({ _id: -1 });

module.exports = mongoose.model("Product", productSchema);