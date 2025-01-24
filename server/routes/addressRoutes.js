const express = require("express");
const router = express.Router();
const {
  findAddress,
  getUserAddress,
  addAddress,
  editAddress,
  deleteAddress,
} = require("../controllers/addressController");
const { authorizeUser } = require("../middlewares/authenticate");

router.post("/", authorizeUser(["user", "vendor"]), findAddress);
router.get("/all", authorizeUser(["user", "vendor"]), getUserAddress);
router.post("/add", authorizeUser(["user", "vendor"]), addAddress);
router.post("/edit", authorizeUser(["user", "vendor"]), editAddress);
router.post("/delete", authorizeUser(["user", "vendor"]), deleteAddress);

module.exports = router;
