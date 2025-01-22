const Product = require("../models/Product");

const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const searchCriteria = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
      isListed: true,
    };

    const products = await Product.find(searchCriteria)
      .populate("category")
      .select("name description images price discount category tags vendor")
      .limit(10);

    res.json(products);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Error searching products" });
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

    const categories = await Product.aggregate([
      {
        $match: {
          "category.name": { $regex: query, $options: "i" },
          isListed: true,
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      { $limit: 3 },
    ]);

    res.json({
      products,
      categories,
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
