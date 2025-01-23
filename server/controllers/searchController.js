const Product = require("../models/Product");

const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const totalProducts = await Product.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "subCategory",
          foreignField: "_id",
          as: "subCategoryData",
        },
      },
      {
        $match: {
          $and: [
            { isListed: true },
            {
              $or: [
                { name: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
                { tags: { $regex: query, $options: "i" } },
                { "categoryData.name": { $regex: query, $options: "i" } },
                { "subCategoryData.name": { $regex: query, $options: "i" } },
              ],
            },
          ],
        },
      },
    ]).count("total");

    const total = totalProducts[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    const products = await Product.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "subCategory",
          foreignField: "_id",
          as: "subCategoryData",
        },
      },
      {
        $match: {
          $and: [
            { isListed: true },
            {
              $or: [
                { name: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
                { tags: { $regex: query, $options: "i" } },
                { "categoryData.name": { $regex: query, $options: "i" } },
                { "subCategoryData.name": { $regex: query, $options: "i" } },
              ],
            },
          ],
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          name: 1,
          description: 1,
          images: 1,
          price: 1,
          discount: 1,
          category: { $first: "$categoryData" },
          subCategory: { $first: "$subCategoryData" },
          tags: 1,
          vendor: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error searching products",
        error: error.message,
      });
  }
};

const getSearchSuggestions = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const products = await Product.find({
      name: { $regex: query, $options: "i" },
      isListed: true,
    })
      .select("name category")
      .populate("category", "name")
      .limit(5);

    res.json({
      products,
    });
  } catch (error) {
    console.error("Suggestion error:", error);
    res.status(500).json({ message: "Error getting search suggestions" });
  }
};

module.exports = {
  searchProducts,
  getSearchSuggestions,
};
