const Category = require("../models/Category");
const slugify = require("slugify");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    const buildCategoryHierarchy = (categories, parentId = null) => {
      return categories
        .filter(
          (category) => category.parent_id?.toString() === parentId?.toString()
        )
        .map((category) => ({
          _id: category._id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          parent_id: category.parent_id,
          isActive: category.isActive,
          children: buildCategoryHierarchy(categories, category._id),
        }));
    };

    const categoryTree = buildCategoryHierarchy(categories);

    res.status(200).json({
      success: true,
      categories: categoryTree,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, parent_id } = req.body;

    const slug = slugify(name, { lower: true });

    const category = new Category({
      name,
      slug,
      description,
      parent_id: parent_id || null,
      isActive: true,
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, parent_id } = req.body;

    const updatedData = {
      ...(name && { name, slug: slugify(name, { lower: true }) }),
      ...(description && { description }),
      parent_id: parent_id || null,
    };

    const updatedCategory = await Category.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const toggleCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (category.isActive && !req.body.isActive) {
      const activeChildren = await Category.find({
        parent_id: id,
        isActive: true,
      });

      if (activeChildren.length > 0) {
        return res.status(400).json({
          success: false,
          message:
            "Cannot deactivate category with active subcategories. Please deactivate subcategories first.",
        });
      }
    }

    category.isActive = !category.isActive;
    await category.save();

    res.status(200).json({
      success: true,
      message: `Category ${
        category.isActive ? "activated" : "deactivated"
      } successfully`,
      category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const childCategories = await Category.find({ parent_id: id });
    if (childCategories.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete category with subcategories. Please delete subcategories first.",
      });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deactivated successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  editCategory,
  deleteCategory,
  toggleCategoryStatus,
};
