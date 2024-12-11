const express = require("express");
const router = express.Router();
const { addAddress } = require("../controllers/addressController");

router.post("/add", addAddress);

module.exports = router;