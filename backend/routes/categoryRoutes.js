const express = require("express");
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  bulkImportCategories,
} = require("../controllers/categoryController");

router.route("/").get(getCategories).post(createCategory);

router.route("/bulk-import").post(bulkImportCategories);

router
  .route("/:id")
  .get(getCategoryById)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
