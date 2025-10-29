const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkImportProducts,
} = require("../controllers/productController");
const { handleUpload } = require("../middleware/uploadMiddleware");

router.route("/").get(getProducts).post(handleUpload, createProduct);

router.route("/bulk-import").post(bulkImportProducts);

router
  .route("/:id")
  .get(getProductById)
  .put(handleUpload, updateProduct)
  .delete(deleteProduct);

module.exports = router;
