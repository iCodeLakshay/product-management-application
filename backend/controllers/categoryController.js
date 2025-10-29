const Category = require("../models/Category");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      name: 1,
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }

    const category = await Category.create({
      name,
      description,
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if name is being changed and if it already exists
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Category with this name already exists",
        });
      }
    }

    category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, isActive },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const bulkImportCategories = async (req, res) => {
  try {
    const { categories } = req.body;

    if (!categories || !Array.isArray(categories)) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of categories",
      });
    }

    if (categories.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Categories array cannot be empty",
      });
    }

    const results = {
      successful: [],
      failed: [],
      skipped: [],
    };

    for (const categoryData of categories) {
      try {
        const { name, description, isActive } = categoryData;

        if (!name) {
          results.failed.push({
            data: categoryData,
            reason: "Name is required",
          });
          continue;
        }

        // Check if category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
          results.skipped.push({
            name,
            reason: "Category already exists",
          });
          continue;
        }

        const category = await Category.create({
          name,
          description: description || "",
          isActive: isActive !== undefined ? isActive : true,
        });

        results.successful.push(category);
      } catch (error) {
        results.failed.push({
          data: categoryData,
          reason: error.message,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "Bulk import completed",
      summary: {
        total: categories.length,
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
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  bulkImportCategories,
};
