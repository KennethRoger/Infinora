const express = require("express");
const router = express.Router();
const {
  findAddress,
  getUserAddress,
  addAddress,
  editAddress,
  deleteAddress,
} = require("../controllers/addressController");

router.post("/", findAddress);
router.get("/all", getUserAddress);
router.post("/add", addAddress);
router.post("/edit", editAddress);
router.post("/delete", deleteAddress);

module.exports = router;
