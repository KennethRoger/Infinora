const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
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

const getStorePerformance = async (req, res) => {
  try {
    const { timeRange = "7d" } = req.query;
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }
    const decoded = verifyToken(token);
    const vendorId = decoded.id;

    const endDate = endOfDay(new Date());
    let startDate;
    switch (timeRange) {
      case "30d":
        startDate = startOfDay(subDays(endDate, 30));
        break;
      case "90d":
        startDate = startOfDay(subDays(endDate, 90));
        break;
      case "1y":
        startDate = startOfDay(subDays(endDate, 365));
        break;
      default:
        startDate = startOfDay(subDays(endDate, 7));
    }

    const orders = await Order.find({
      vendor: vendorId,
      createdAt: { $gte: startDate, $lte: endDate },
      status: { $ne: "cancelled" },
    }).populate("product");

    const revenueByDay = {};
    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split("T")[0];
      revenueByDay[date] = (revenueByDay[date] || 0) + order.finalAmount;
    });

    const revenue = Object.entries(revenueByDay).map(([date, amount]) => ({
      date,
      amount,
    }));

    const orderCount = orders.length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.finalAmount,
      0
    );
    const avgOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

    const productSales = {};
    orders.forEach((order) => {
      const productId = order.product._id.toString();
      if (!productSales[productId]) {
        productSales[productId] = {
          id: productId,
          name: order.product.name,
          image: order.product.images[0],
          soldCount: 0,
          revenue: 0,
        };
      }
      productSales[productId].soldCount += order.quantity;
      productSales[productId].revenue += order.finalAmount;
    });

    const bestSellers = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    res.json({
      revenue,
      orderCount,
      avgOrderValue,
      bestSellers,
      totalRevenue,
    });
  } catch (error) {
    console.error("Error fetching store metrics:", error);
    res.status(500).json({ message: "Failed to fetch store metrics" });
  }
};

const getFinancialAnalytics = async (req, res) => {
  try {
    const { timeRange = "7d" } = req.query;
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const vendorId = decoded.userId;

    const endDate = endOfDay(new Date());
    let startDate;
    switch (timeRange) {
      case "30d":
        startDate = startOfDay(subDays(endDate, 30));
        break;
      case "90d":
        startDate = startOfDay(subDays(endDate, 90));
        break;
      case "1y":
        startDate = startOfDay(subDays(endDate, 365));
        break;
      default:
        startDate = startOfDay(subDays(endDate, 7));
    }

    const orders = await Order.find({
      vendor: vendorId,
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const totalRevenue = orders.reduce((sum, order) => {
      if (order.status !== "cancelled") {
        return sum + order.finalAmount;
      }
      return sum;
    }, 0);

    const commission = totalRevenue * 0.1;
    const revenueAfterCommission = totalRevenue - commission;

    const paymentMethods = orders.reduce((acc, order) => {
      if (order.status === "cancelled") return acc;

      const method = order.paymentMethod;
      const existingMethod = acc.find((m) => m.name === method);

      if (existingMethod) {
        existingMethod.value += 1;
      } else {
        acc.push({ name: method, value: 1 });
      }

      return acc;
    }, []);

    const refundedOrders = orders.filter(
      (order) => order.status === "cancelled"
    );
    const refundStats = {
      totalRefunds: refundedOrders.length,
      refundRate: orders.length > 0 ? refundedOrders.length / orders.length : 0,
      refundAmount: refundedOrders.reduce(
        (sum, order) => sum + order.finalAmount,
        0
      ),
    };

    res.json({
      totalRevenue,
      revenueAfterCommission,
      paymentMethods,
      refundStats,
    });
  } catch (error) {
    console.error("Error in getFinancialAnalytics:", error);
    res.status(500).json({ message: "Failed to fetch financial analytics" });
  }
};

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

module.exports = {
  getStorePerformance,
  getFinancialAnalytics,
  getSalesReport,
  getAdminSalesReport,
};
