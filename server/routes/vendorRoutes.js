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
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"), false);
      return;
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 8,
  },
}).array("images", 8);

const {
  verifyVendor,
  registerVendorDetails,
  addVendorProducts,
  editVendorProduct,
  getAVendorProducts,
} = require("../controllers/vendorController");
const { authorizeUser } = require("../middlewares/authenticate");

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
  productUpload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File size should not exceed 5MB",
        });
      }
      if (err.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
          success: false,
          message: "Maximum 8 images allowed",
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    next();
  });
};

router.post("/verify", verifyVendor);
router.post("/register", authorizeUser(["user", "vendor", "admin"]), handleRegistrationUpload, registerVendorDetails);
router.post("/product", authorizeUser(["vendor"]), handleProductUpload, addVendorProducts);
router.put("/product/:productId", authorizeUser(["vendor", "admin"]), handleProductUpload, editVendorProduct);
router.get("/products/:vendorId", getAVendorProducts);

module.exports = router;
