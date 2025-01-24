const express = require("express");
const router = express.Router();
const { toggleFavorite, getFavorites } = require("../controllers/favoriteController");
const { authorizeUser } = require("../middlewares/authenticate");

router.post("/toggle", authorizeUser(["user", "vendor"]), toggleFavorite);
router.get("/", authorizeUser(["user", "vendor", "admin"]), getFavorites);

module.exports = router;