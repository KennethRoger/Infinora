const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const mongoose = require("mongoose");
const {
  startOfDay,
  endOfDay,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} = require("date-fns");
const { verifyToken } = require("../utils/tokenValidator");

const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, reportType } = req.query;
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const vendorId = decoded.id;

    let queryStartDate, queryEndDate;
    const today = new Date();

    switch (reportType) {
      case "1d":
        queryStartDate = startOfDay(today);
        queryEndDate = endOfDay(today);
        break;
      case "7d":
        queryStartDate = startOfDay(subDays(today, 7));
        queryEndDate = endOfDay(today);
        break;
      case "30d":
        queryStartDate = startOfDay(subDays(today, 30));
        queryEndDate = endOfDay(today);
        break;
      case "month":
        queryStartDate = startOfMonth(today);
        queryEndDate = endOfMonth(today);
        break;
      case "year":
        queryStartDate = startOfYear(today);
        queryEndDate = endOfYear(today);
        break;
      default:
        queryStartDate = new Date(startDate);
        queryEndDate = new Date(endDate);
    }

    const orders = await Order.find({
      vendor: vendorId,
      createdAt: { $gte: queryStartDate, $lte: queryEndDate },
    });

    const summary = orders.reduce(
      (acc, order) => {
        if (order.status !== "cancelled") {
          acc.totalAmount += order.totalAmount || 0;
        }

        const totalDiscount =
          (order.totalAmount || 0) - (order.finalAmount || 0);
        acc.totalDiscount += totalDiscount;

        if (order.appliedCoupon && order.appliedCoupon.couponDiscount) {
          acc.couponDiscount += order.appliedCoupon.couponDiscount;
        }
        return acc;
      },
      {
        totalOrders: orders.length,
        totalAmount: 0,
        totalDiscount: 0,
        couponDiscount: 0,
      }
    );

    const formattedOrders = orders.map((order) => ({
      orderId: order.orderId,
      createdAt: order.createdAt,
      totalAmount: order.totalAmount || 0,
      finalAmount: order.finalAmount || 0,
      discount: order.discount || 0,
      appliedCoupon: order.appliedCoupon
        ? {
            couponCode: order.appliedCoupon.couponCode,
            couponDiscount: order.appliedCoupon.couponDiscount || 0,
          }
        : null,
      status: order.status || "pending",
      paymentMethod: order.paymentMethod || "N/A",
      paymentStatus: order.paymentStatus || "pending",
    }));

    res.json({
      orders: formattedOrders,
      summary,
    });
  } catch (error) {
    console.error("Error in getSalesReport:", error);
    res.status(500).json({ message: "Failed to fetch sales report" });
  }
};

const getAdminSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, reportType, vendorId } = req.query;
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let queryStartDate, queryEndDate;
    const today = new Date();

    switch (reportType) {
      case "1d":
        queryStartDate = startOfDay(today);
        queryEndDate = endOfDay(today);
        break;
      case "7d":
        queryStartDate = startOfDay(subDays(today, 7));
        queryEndDate = endOfDay(today);
        break;
      case "30d":
        queryStartDate = startOfDay(subDays(today, 30));
        queryEndDate = endOfDay(today);
        break;
      case "month":
        queryStartDate = startOfMonth(today);
        queryEndDate = endOfMonth(today);
        break;
      case "year":
        queryStartDate = startOfYear(today);
        queryEndDate = endOfYear(today);
        break;
      default:
        queryStartDate = new Date(startDate);
        queryEndDate = new Date(endDate);
    }

    const query = {
      createdAt: { $gte: queryStartDate, $lte: queryEndDate },
    };

    if (vendorId) {
      query.vendor = vendorId;
    }

    const orders = await Order.find(query).populate({
      path: "vendor",
      model: User,
      select: "name email",
    });

    const platformMetrics = orders.reduce(
      (acc, order) => {
        if (order.status !== "cancelled") {
          acc.totalRevenue += order.finalAmount || 0;

          const commission = (order.finalAmount || 0) * 0.1;
          acc.totalCommission += commission;

          const vendorId = order.vendor._id.toString();
          if (!acc.vendorPerformance[vendorId]) {
            acc.vendorPerformance[vendorId] = {
              name: order.vendor.name,
              email: order.vendor.email,
              revenue: 0,
              orderCount: 0,
            };
          }
          acc.vendorPerformance[vendorId].revenue += order.finalAmount || 0;
          acc.vendorPerformance[vendorId].orderCount += 1;
        }
        return acc;
      },
      {
        totalOrders: orders.length,
        totalRevenue: 0,
        totalCommission: 0,
        vendorPerformance: {},
      }
    );

    const topVendors = Object.values(platformMetrics.vendorPerformance)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const formattedOrders = orders.map((order) => ({
      orderId: order.orderId,
      createdAt: order.createdAt,
      vendorName: order.vendor.name,
      vendorEmail: order.vendor.email,
      totalAmount: order.totalAmount || 0,
      finalAmount: order.finalAmount || 0,
      discount: order.discount || 0,
      appliedCoupon: order.appliedCoupon
        ? {
            couponCode: order.appliedCoupon.couponCode,
            couponDiscount: order.appliedCoupon.couponDiscount || 0,
          }
        : null,
      status: order.status || "pending",
      paymentMethod: order.paymentMethod || "N/A",
      paymentStatus: order.paymentStatus || "pending",
      commission: (order.finalAmount || 0) * 0.1,
    }));

    res.json({
      orders: formattedOrders,
      summary: {
        ...platformMetrics,
        topVendors,
      },
    });
  } catch (error) {
    console.error("Error in getAdminSalesReport:", error);
    res.status(500).json({ message: "Failed to fetch admin sales report" });
  }
};

const calculateDateRange = (timeRange, startDate, endDate) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (timeRange) {
    case "today":
      return {
        startDate: startOfDay(today),
        endDate: endOfDay(today),
      };
    case "7d":
      return {
        startDate: startOfDay(subDays(today, 7)),
        endDate: endOfDay(today),
      };
    case "30d":
      return {
        startDate: startOfDay(subDays(today, 30)),
        endDate: endOfDay(today),
      };
    case "1y":
      return {
        startDate: startOfDay(subDays(today, 365)),
        endDate: endOfDay(today),
      };
    case "custom":
      if (!startDate || !endDate) {
        return {
          startDate: startOfDay(subDays(today, 7)),
          endDate: endOfDay(today),
        };
      }
      return {
        startDate: startOfDay(new Date(startDate)),
        endDate: endOfDay(new Date(endDate)),
      };
    default:
      return {
        startDate: startOfDay(subDays(today, 7)),
        endDate: endOfDay(today),
      };
  }
};

const getProductPerformance = async (req, res) => {
  try {
    const { timeRange } = req.query;
    const token = req.cookies.token;
    const decoded = verifyToken(token);
    const vendorId = decoded.id;

    const dateRange = calculateDateRange(
      timeRange,
      req.query.startDate,
      req.query.endDate
    );
    const vendorObjectId = new mongoose.Types.ObjectId(vendorId);

    const productPerformance = await Order.aggregate([
      {
        $match: {
          vendor: vendorObjectId,
          status: { $ne: "cancelled" },
          createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate },
        },
      },
      {
        $group: {
          _id: "$product",
          totalRevenue: { $sum: "$finalAmount" },
          totalQuantity: { $sum: "$quantity" },
          ordersCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $project: {
          name: "$productDetails.name",
          image: { $arrayElemAt: ["$productDetails.images", 0] },
          totalRevenue: 1,
          totalQuantity: 1,
          ordersCount: 1,
          averageOrderValue: { $divide: ["$totalRevenue", "$ordersCount"] },
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    res.json({
      success: true,
      data: productPerformance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSalesAndOrdersMetrics = async (req, res) => {
  try {
    const { timeRange } = req.query;
    const token = req.cookies.token;
    const decoded = verifyToken(token);
    const vendorId = decoded.id;

    const dateRange = calculateDateRange(
      timeRange,
      req.query.startDate,
      req.query.endDate
    );
    const vendorObjectId = new mongoose.Types.ObjectId(vendorId);

    const metrics = await Order.aggregate([
      {
        $match: {
          vendor: vendorObjectId,
          status: { $ne: "cancelled" },
          createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          totalSales: { $sum: "$finalAmount" },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          date: "$_id",
          totalSales: 1,
          orderCount: 1,
          _id: 0,
        },
      },
    ]);

    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAdminRevenueMetrics = async (req, res) => {
  try {
    const { timeRange } = req.query;
    const dateRange = calculateDateRange(
      timeRange,
      req.query.startDate,
      req.query.endDate
    );

    const metrics = await Order.aggregate([
      {
        $match: {
          status: { $ne: "cancelled" },
          createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          totalRevenue: { $sum: "$finalAmount" },
          platformFees: { $sum: { $multiply: ["$finalAmount", 0.1] } },
          vendorEarnings: { $sum: { $multiply: ["$finalAmount", 0.9] } },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          date: "$_id",
          totalRevenue: 1,
          platformFees: 1,
          vendorEarnings: 1,
          _id: 0,
        },
      },
    ]);

    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserActivityMetrics = async (req, res) => {
  try {
    const { timeRange } = req.query;
    const dateRange = calculateDateRange(
      timeRange,
      req.query.startDate,
      req.query.endDate
    );

    const userMetrics = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate },
        },
      },
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          role: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    const orderMetrics = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          status: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        users: userMetrics,
        orders: orderMetrics,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBestSellingProducts = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const vendorId = decoded.id;

    const bestSellingProducts = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
          status: { $ne: "cancelled" },
        },
      },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $match: {
          "productDetails.vendor": new mongoose.Types.ObjectId(vendorId),
        },
      },
      {
        $group: {
          _id: {
            productId: "$items.product",
            variantCombo: "$items.selectedVariants",
          },
          name: { $first: "$productDetails.name" },
          images: { $first: "$productDetails.images" },
          basePrice: { $first: "$productDetails.price" },
          discount: { $first: "$productDetails.discount" },
          variants: { $first: "$productDetails.variants" },
          variantCombinations: {
            $first: "$productDetails.variantCombinations",
          },
          selectedVariants: { $first: "$items.selectedVariants" },
          totalQuantitySold: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: {
              $multiply: [
                "$items.quantity",
                {
                  $subtract: [
                    "$items.price",
                    {
                      $multiply: [
                        "$items.price",
                        {
                          $divide: [
                            { $ifNull: ["$productDetails.discount", 0] },
                            100,
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        },
      },
      {
        $addFields: {
          variantName: {
            $reduce: {
              input: { $objectToArray: "$selectedVariants" },
              initialValue: "",
              in: {
                $concat: [
                  "$$value",
                  { $cond: [{ $eq: ["$$value", ""] }, "", " - "] },
                  "$$this.v",
                ],
              },
            },
          },
          mainImage: { $arrayElemAt: ["$images", 0] },
          variantImage: {
            $let: {
              vars: {
                variantImageIndexes: {
                  $reduce: {
                    input: "$variants",
                    initialValue: [],
                    in: {
                      $concatArrays: [
                        "$$value",
                        {
                          $map: {
                            input: "$$this.variantTypes",
                            as: "type",
                            in: {
                              name: "$$type.name",
                              imageIndex: "$$type.imageIndex",
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
              in: {
                $let: {
                  vars: {
                    matchedVariant: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$$variantImageIndexes",
                            as: "vi",
                            cond: {
                              $and: [
                                { $ne: ["$$vi.imageIndex", null] },
                                {
                                  $in: [
                                    "$$vi.name",
                                    { $objectToArray: "$selectedVariants" }.v,
                                  ],
                                },
                              ],
                            },
                          },
                        },
                        0,
                      ],
                    },
                  },
                  in: {
                    $cond: {
                      if: "$$matchedVariant",
                      then: {
                        $arrayElemAt: [
                          "$images",
                          "$$matchedVariant.imageIndex",
                        ],
                      },
                      else: { $arrayElemAt: ["$images", 0] },
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id.productId",
          name: { $first: "$name" },
          mainImage: { $first: "$mainImage" },
          basePrice: { $first: "$basePrice" },
          discount: { $first: "$discount" },
          variants: {
            $push: {
              combination: "$selectedVariants",
              variantName: "$variantName",
              image: "$variantImage",
              quantitySold: "$totalQuantitySold",
              revenue: "$totalRevenue",
            },
          },
          totalQuantitySold: { $sum: "$totalQuantitySold" },
          totalRevenue: { $sum: "$totalRevenue" },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      success: true,
      products: bestSellingProducts,
    });
  } catch (error) {
    console.error("Error getting best selling products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching best selling products",
    });
  }
};

const getBestSellingCategories = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const categoryMetrics = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          },
          status: { $ne: "cancelled" },
          paymentStatus: "completed"
        }
      },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $lookup: {
          from: "categories",
          localField: "productDetails.category",
          foreignField: "_id",
          as: "categoryDetails"
        }
      },
      { $unwind: "$categoryDetails" },
      {
        $group: {
          _id: "$categoryDetails._id",
          name: { $first: "$categoryDetails.name" },
          parent_id: { $first: "$categoryDetails.parent_id" },
          totalOrders: { $sum: 1 },
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: {
              $multiply: [
                "$items.quantity",
                {
                  $subtract: [
                    "$items.price",
                    {
                      $multiply: [
                        "$items.price",
                        { $divide: [{ $ifNull: ["$productDetails.discount", 0] }, 100] }
                      ]
                    }
                  ]
                }
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "parent_id",
          foreignField: "_id",
          as: "parentCategory"
        }
      },
      {
        $addFields: {
          parentName: {
            $cond: {
              if: { $gt: [{ $size: "$parentCategory" }, 0] },
              then: { $arrayElemAt: ["$parentCategory.name", 0] },
              else: null
            }
          }
        }
      },
      {
        $sort: { totalRevenue: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      categories: categoryMetrics
    });
  } catch (error) {
    console.error("Error getting best selling categories:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching best selling categories"
    });
  }
};

module.exports = {
  getSalesReport,
  getAdminSalesReport,
  getProductPerformance,
  getSalesAndOrdersMetrics,
  getAdminRevenueMetrics,
  getUserActivityMetrics,
  getBestSellingProducts,
  getBestSellingCategories
};
