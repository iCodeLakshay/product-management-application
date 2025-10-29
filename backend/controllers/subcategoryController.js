const Subcategory = require("../models/Subcategory");
const Category = require("../models/Category");

// @desc    Get all subcategories
// @route   GET /api/subcategories
// @access  Public
const getSubcategories = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const filter = { isActive: true };

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    const subcategories = await Subcategory.find(filter)
      .populate("categoryId", "name")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: subcategories.length,
      data: subcategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get single subcategory
// @route   GET /api/subcategories/:id
// @access  Public
const getSubcategoryById = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id).populate(
      "categoryId",
      "name"
    );

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    res.status(200).json({
      success: true,
      data: subcategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Create new subcategory
// @route   POST /api/subcategories
// @access  Public
const createSubcategory = async (req, res) => {
  try {
    const { name, description, categoryId } = req.body;

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if subcategory already exists in this category
    const existingSubcategory = await Subcategory.findOne({ name, categoryId });
    if (existingSubcategory) {
      return res.status(400).json({
        success: false,
        message: "Subcategory with this name already exists in this category",
      });
    }

    const subcategory = await Subcategory.create({
      name,
      description,
      categoryId,
    });

    const populatedSubcategory = await Subcategory.findById(
      subcategory._id
    ).populate("categoryId", "name");

    res.status(201).json({
      success: true,
      data: populatedSubcategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Update subcategory
// @route   PUT /api/subcategories/:id
// @access  Public
const updateSubcategory = async (req, res) => {
  try {
    const { name, description, categoryId, isActive } = req.body;

    let subcategory = await Subcategory.findById(req.params.id);

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    // Check if category exists if categoryId is being updated
    if (categoryId && categoryId !== subcategory.categoryId.toString()) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    // Check if name is being changed and if it already exists in the category
    if (name && (name !== subcategory.name || categoryId)) {
      const checkCategoryId = categoryId || subcategory.categoryId;
      const existingSubcategory = await Subcategory.findOne({
        name,
        categoryId: checkCategoryId,
        _id: { $ne: req.params.id },
      });

      if (existingSubcategory) {
        return res.status(400).json({
          success: false,
          message: "Subcategory with this name already exists in this category",
        });
      }
    }

    subcategory = await Subcategory.findByIdAndUpdate(
      req.params.id,
      { name, description, categoryId, isActive },
      { new: true, runValidators: true }
    ).populate("categoryId", "name");

    res.status(200).json({
      success: true,
      data: subcategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Delete subcategory
// @route   DELETE /api/subcategories/:id
// @access  Public
const deleteSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id);

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    await subcategory.deleteOne();

    res.status(200).json({
      success: true,
      message: "Subcategory deleted successfully",
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
  getSubcategories,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
};
