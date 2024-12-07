const express = require("express");
const {
  createCategory,
  editCategory,
  deleteCategory,
  getCategories,
  toggleCategoryStatus,
} = require("../controllers/categoryController");
const router = express.Router();

router.get("/all", getCategories);
router.post("/create", createCategory);
router.put("/edit/:id", editCategory);
router.delete("/delete/:id", deleteCategory);
router.patch("/toggle-status/:id", toggleCategoryStatus);

module.exports = router;
