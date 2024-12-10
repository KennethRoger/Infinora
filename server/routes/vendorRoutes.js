const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file) {
    cb(new Error("No file uploaded"), false);
    return;
  }

  if (file.fieldname === "profileImage") {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Profile picture must be an image file"), false);
      return;
    }
  } else if (file.fieldname === "idCard") {
    if (file.mimetype !== "application/pdf") {
      cb(new Error("ID Card must be a PDF file"), false);
      return;
    }
  } else if (file.fieldname === "images") {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Product images must be image files"), false);
      return;
    }
  }

  cb(null, true);
};

const registrationUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
}).fields([
  { name: "profileImage", maxCount: 1 },
  { name: "idCard", maxCount: 1 },
]);

const productUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).array("images", 4);

const {
  verifyVendor,
  registerVendorDetails,
  addVendorProducts,
  editVendorProduct
} = require("../controllers/vendorController");


const handleRegistrationUpload = (req, res, next) => {
  registrationUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: err.message || "Error uploading file",
      });
    }
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "Error uploading file",
      });
    }
    next();
  });
};

const handleProductUpload = (req, res, next) => {
  productUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: err.message || "Error uploading product images",
      });
    }
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "Error uploading product images",
      });
    }
    next();
  });
};

router.post("/verify", verifyVendor);
router.post("/register", handleRegistrationUpload, registerVendorDetails);
router.post("/product", handleProductUpload, addVendorProducts);
router.put("/product/:productId", handleProductUpload, editVendorProduct);

module.exports = router;
