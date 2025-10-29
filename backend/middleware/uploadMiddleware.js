const { upload } = require("../config/cloudinary");

// Middleware to handle multiple product images (up to 10)
const uploadProductImages = upload.array("images", 10);

// Error handling wrapper
const handleUpload = (req, res, next) => {
  uploadProductImages(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File size too large. Maximum size is 5MB per image.",
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || "Error uploading images",
      });
    }
    next();
  });
};

module.exports = { handleUpload };
