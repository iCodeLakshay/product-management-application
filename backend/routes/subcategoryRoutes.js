const express = require("express");
const router = express.Router();
const {
  getSubcategories,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} = require("../controllers/subcategoryController");

router.route("/").get(getSubcategories).post(createSubcategory);

router
  .route("/:id")
  .get(getSubcategoryById)
  .put(updateSubcategory)
  .delete(deleteSubcategory);

module.exports = router;
