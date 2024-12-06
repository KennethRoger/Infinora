const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload an image."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const {
  verifyVendor,
  registerVendorDetails,
} = require("../controllers/vendorController");

router.post("/verify", verifyVendor);
router.post(
  "/register",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "idCard", maxCount: 1 },
  ]),
  registerVendorDetails
);

module.exports = router;
