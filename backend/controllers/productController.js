const Product = require("../models/Product");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");

// @desc    Get all products with pagination, search, and filters
// @route   GET /api/products
// @access  Public
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

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
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

// @desc    Create new product
// @route   POST /api/products
// @access  Public
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      images,
      categoryId,
      subcategoryId,
      stock,
    } = req.body;

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

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Public
const updateProduct = async (req, res) => {
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
    } = req.body;

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
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

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Public
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
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

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
