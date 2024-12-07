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
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
}).fields([
  { name: "profileImage", maxCount: 1 },
  { name: "idCard", maxCount: 1 },
]);

const {
  verifyVendor,
  registerVendorDetails,
} = require("../controllers/vendorController");


const handleUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        message: err.message || "Error uploading file",
      });
    } else if (err) {
      return res.status(400).json({
        message: err.message || "Error processing file upload",
      });
    }
    next();
  });
};

router.post("/verify", verifyVendor);
router.post("/register", handleUpload, registerVendorDetails);

module.exports = router;
