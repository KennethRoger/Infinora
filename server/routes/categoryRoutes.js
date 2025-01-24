const express = require("express");
const {
  createCategory,
  editCategory,
  deleteCategory,
  getCategories,
  toggleCategoryStatus,
} = require("../controllers/categoryController");
const { authorizeUser } = require("../middlewares/authenticate");
const router = express.Router();

router.get("/all", getCategories);
router.post("/create", authorizeUser(["admin"]), createCategory);
router.put("/edit/:id", authorizeUser(["admin"]), editCategory);
router.delete("/delete/:id", authorizeUser(["admin"]), deleteCategory);
router.patch(
  "/toggle-status/:id",
  authorizeUser(["admin"]),
  toggleCategoryStatus
);

module.exports = router;
