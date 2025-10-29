const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subcategory name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique subcategory names within a category
subcategorySchema.index({ name: 1, categoryId: 1 }, { unique: true });

// Text index for searches
subcategorySchema.index({ name: "text", description: "text" });

const Subcategory = mongoose.model("Subcategory", subcategorySchema);

module.exports = Subcategory;
