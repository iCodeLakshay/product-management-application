const express = require("express");
const router = express.Router();
const {
  getSubcategories,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  bulkImportSubcategories,
} = require("../controllers/subcategoryController");

router.route("/").get(getSubcategories).post(createSubcategory);

router.route("/bulk-import").post(bulkImportSubcategories);

router
  .route("/:id")
  .get(getSubcategoryById)
  .put(updateSubcategory)
  .delete(deleteSubcategory);

module.exports = router;
