const Product = require("../models/Product");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const { deleteMultipleImages } = require("../config/cloudinary");

const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search = "",
      categoryId = "",
      subcategoryId = "",
    } = req.query;

    // Build query
    const query = { isActive: true };

    // Category filter
    if (categoryId) {
      query.categoryId = categoryId;
    }

    // Subcategory filter
    if (subcategoryId) {
      query.subcategoryId = subcategoryId;
    }

    // Search functionality
    let products;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    if (search) {
      // Search across product name, description, category name, and subcategory name
      const searchRegex = new RegExp(search, "i");

      // Find matching categories
      const matchingCategories = await Category.find({
        name: searchRegex,
      }).select("_id");

      // Find matching subcategories
      const matchingSubcategories = await Subcategory.find({
        name: searchRegex,
      }).select("_id");

      // Build search query
      const searchQuery = {
        ...query,
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { categoryId: { $in: matchingCategories.map((c) => c._id) } },
          { subcategoryId: { $in: matchingSubcategories.map((s) => s._id) } },
        ],
      };

      // Get total count for pagination
      const totalItems = await Product.countDocuments(searchQuery);

      // Get products
      products = await Product.find(searchQuery)
        .populate("categoryId", "name description")
        .populate("subcategoryId", "name description")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      const totalPages = Math.ceil(totalItems / limitNum);

      return res.status(200).json({
        success: true,
        data: products,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems,
          itemsPerPage: limitNum,
        },
      });
    }

    // Get total count for pagination
    const totalItems = await Product.countDocuments(query);

    // Get products without search
    products = await Product.find(query)
      .populate("categoryId", "name description")
      .populate("subcategoryId", "name description")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalItems / limitNum);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems,
        itemsPerPage: limitNum,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("categoryId", "name description")
      .populate("subcategoryId", "name description");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId, subcategoryId, stock } =
      req.body;

    // Get uploaded images from Cloudinary
    const images = req.files ? req.files.map((file) => file.path) : [];

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    // Validate category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Validate subcategory exists and belongs to the category
    const subcategory = await Subcategory.findById(subcategoryId);
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    if (subcategory.categoryId.toString() !== categoryId) {
      return res.status(400).json({
        success: false,
        message: "Subcategory does not belong to the specified category",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      images,
      categoryId,
      subcategoryId,
      stock,
    });

    const populatedProduct = await Product.findById(product._id)
      .populate("categoryId", "name description")
      .populate("subcategoryId", "name description");

    res.status(201).json({
      success: true,
      data: populatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      categoryId,
      subcategoryId,
      stock,
      isActive,
      keepExistingImages,
    } = req.body;

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Handle image updates
    let images = product.images; // Keep existing images by default

    // If new images are uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path);

      // If keepExistingImages is true, append new images to existing ones
      if (keepExistingImages === "true") {
        images = [...product.images, ...newImages];
      } else {
        // Otherwise, delete old images from Cloudinary and replace with new ones
        if (product.images.length > 0) {
          const publicIds = product.images.map((url) => {
            const parts = url.split("/");
            const filename = parts[parts.length - 1];
            return `products/${filename.split(".")[0]}`;
          });

          try {
            await deleteMultipleImages(publicIds);
          } catch (error) {
            console.error("Error deleting old images:", error);
          }
        }
        images = newImages;
      }
    }

    // Validate category if being updated
    if (categoryId && categoryId !== product.categoryId.toString()) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    // Validate subcategory if being updated
    if (subcategoryId && subcategoryId !== product.subcategoryId.toString()) {
      const subcategory = await Subcategory.findById(subcategoryId);
      if (!subcategory) {
        return res.status(404).json({
          success: false,
          message: "Subcategory not found",
        });
      }

      const checkCategoryId = categoryId || product.categoryId;
      if (subcategory.categoryId.toString() !== checkCategoryId.toString()) {
        return res.status(400).json({
          success: false,
          message: "Subcategory does not belong to the specified category",
        });
      }
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        images,
        categoryId,
        subcategoryId,
        stock,
        isActive,
      },
      { new: true, runValidators: true }
    )
      .populate("categoryId", "name description")
      .populate("subcategoryId", "name description");

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete images from Cloudinary
    if (product.images.length > 0) {
      const publicIds = product.images.map((url) => {
        const parts = url.split("/");
        const filename = parts[parts.length - 1];
        return `products/${filename.split(".")[0]}`;
      });

      try {
        await deleteMultipleImages(publicIds);
      } catch (error) {
        console.error("Error deleting images from Cloudinary:", error);
      }
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const bulkImportProducts = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of products",
      });
    }

    if (products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products array cannot be empty",
      });
    }

    const results = {
      successful: [],
      failed: [],
      skipped: [],
    };

    for (const productData of products) {
      try {
        const {
          name,
          description,
          price,
          images,
          categoryId,
          subcategoryId,
          stock,
          isActive,
        } = productData;

        if (!name) {
          results.failed.push({
            data: productData,
            reason: "Name is required",
          });
          continue;
        }

        if (!categoryId) {
          results.failed.push({
            data: productData,
            reason: "Category ID is required",
          });
          continue;
        }

        if (!subcategoryId) {
          results.failed.push({
            data: productData,
            reason: "Subcategory ID is required",
          });
          continue;
        }

        // Validate category exists
        const category = await Category.findById(categoryId);
        if (!category) {
          results.failed.push({
            data: productData,
            reason: "Category not found",
          });
          continue;
        }

        // Validate subcategory exists and belongs to the category
        const subcategory = await Subcategory.findById(subcategoryId);
        if (!subcategory) {
          results.failed.push({
            data: productData,
            reason: "Subcategory not found",
          });
          continue;
        }

        if (subcategory.categoryId.toString() !== categoryId) {
          results.failed.push({
            data: productData,
            reason: "Subcategory does not belong to the specified category",
          });
          continue;
        }

        // Check if product already exists
        const existingProduct = await Product.findOne({
          name,
          categoryId,
          subcategoryId,
        });
        if (existingProduct) {
          results.skipped.push({
            name,
            reason:
              "Product with same name already exists in this category/subcategory",
          });
          continue;
        }

        const product = await Product.create({
          name,
          description: description || "",
          price: price || 0,
          images: images || [],
          categoryId,
          subcategoryId,
          stock: stock || 0,
          isActive: isActive !== undefined ? isActive : true,
        });

        const populatedProduct = await Product.findById(product._id)
          .populate("categoryId", "name description")
          .populate("subcategoryId", "name description");

        results.successful.push(populatedProduct);
      } catch (error) {
        results.failed.push({
          data: productData,
          reason: error.message,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "Bulk import completed",
      summary: {
        total: products.length,
        successful: results.successful.length,
        failed: results.failed.length,
        skipped: results.skipped.length,
      },
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkImportProducts,
};
