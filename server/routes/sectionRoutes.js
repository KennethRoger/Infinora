const express = require("express");
const { getTopRatedProducts } = require("../controllers/sectionController");

const router = express.Router();

router.get("/top-rated", getTopRatedProducts);

module.exports = router;
