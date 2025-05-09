const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Product = require("../models/Product");
const { verifyToken } = require("../utils/tokenValidator");
const cloudinary = require("../config/cloudinaryConfig");

const verifyVendor = async (req, res) => {
  const { password, terms } = req.body;

  if (!terms) {
    return res.status(400).json({
      success: false,
      message: "You must accept the terms and conditions.",
    });
  }

  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No authentication token found." });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password." });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Verification successful. You are now a vendor.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};

const registerVendorDetails = async (req, res) => {
  try {
    const { name, speciality, bio, socialLink, about } = req.body;
    // console.log(
    //   "Files received:",
    //   req.files ? Object.keys(req.files) : "No files"
    // );

    let profileImagePath = null;
    if (req.files && req.files.profileImage) {
      try {
        const b64 = Buffer.from(req.files.profileImage[0].buffer).toString(
          "base64"
        );
        const dataURI =
          "data:" + req.files.profileImage[0].mimetype + ";base64," + b64;

        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "infinora/vendors/profile",
          width: 500,
          height: 500,
          crop: "fill",
          quality: "auto",
        });
        profileImagePath = result.secure_url;
      } catch (error) {
        console.error("Error uploading profile image:", error);
        throw new Error("Failed to upload profile image: " + error.message);
      }
    }

    let idProofPath = null;
    if (req.files && req.files.idCard) {
      try {
        const b64 = Buffer.from(req.files.idCard[0].buffer).toString("base64");
        const dataURI =
          "data:" + req.files.idCard[0].mimetype + ";base64," + b64;

        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "infinora/vendors/id_proofs",
          format: "pdf",
          pages: true,
        });
        idProofPath = result.secure_url;
      } catch (error) {
        console.error("Error uploading ID card:", error);
        throw new Error("Failed to upload ID card: " + error.message);
      }
    }

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing",
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      {
        name,
        speciality,
        bio,
        socialLink,
        about,
        profileImagePath,
        idProofPath,
        vendorStatus: "pending",
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor details updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in registerVendorDetails:", error);
    res.status(500).json({
      success: false,
      message: "Error updating vendor details",
      error: error.message,
    });
  }
};

const addVendorProducts = async (req, res) => {
  try {
    let {
      name,
      description,
      category,
      subCategory,
      status,
      tags,
      discount,
      variants,
      variantCombinations,
      additionalDetails,
      customizable,
      price,
      stock,
      shipping,
    } = req.body;

    if (!name || !description || !category) {
      return res.status(400).json({
        success: false,
        message:
          "Required fields are missing: name, description, and category are mandatory",
      });
    }

    if (variants && typeof variants === "string") {
      try {
        variants = JSON.parse(variants);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid variants data format",
          error: error.message,
        });
      }
    }

    if (variantCombinations && typeof variantCombinations === "string") {
      try {
        variantCombinations = JSON.parse(variantCombinations);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid variant combinations data format",
          error: error.message,
        });
      }
    }

    if (shipping && typeof shipping === "string") {
      try {
        shipping = JSON.parse(shipping);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid shipping data format",
          error: error.message,
        });
      }
    }

    if (discount) {
      const discountValue = Number(discount);
      if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
        return res.status(400).json({
          success: false,
          message: "Discount must be a number between 0 and 100",
        });
      }
      discount = discountValue;
    }

    if (!price) {
      return res.status(400).json({
        success: false,
        message: "Base price is required for all products",
      });
    }

    price = Number(price);
    if (isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a non-negative number",
      });
    }

    if (variants?.length > 0) {
      for (const variant of variants) {
        if (!variant.variantName || !Array.isArray(variant.variantTypes)) {
          return res.status(400).json({
            success: false,
            message: `Invalid variant structure for variant: ${
              variant.variantName || "unnamed"
            }`,
          });
        }

        for (const type of variant.variantTypes) {
          if (!type.name) {
            return res.status(400).json({
              success: false,
              message: `Missing required fields in variant type for ${variant.variantName}`,
            });
          }
        }
      }

      if (!variantCombinations?.length) {
        return res.status(400).json({
          success: false,
          message:
            "Variant combinations are required when variants are specified",
        });
      }

      for (const combo of variantCombinations) {
        if (!combo.variants || !combo.stock) {
          return res.status(400).json({
            success: false,
            message: "Invalid variant combination structure",
          });
        }

        combo.stock = Number(combo.stock);
        combo.priceAdjustment = Number(combo.priceAdjustment || 0);

        if (isNaN(combo.stock) || combo.stock < 0) {
          return res.status(400).json({
            success: false,
            message: "Stock must be a non-negative number",
          });
        }

        if (isNaN(combo.priceAdjustment)) {
          return res.status(400).json({
            success: false,
            message: "Price adjustment must be a number",
          });
        }
      }
    }

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token found.",
      });
    }
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Vendor account not found.",
      });
    }

    if (user.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access. Only vendors can add products.",
      });
    }

    const processedTags = tags
      ? (Array.isArray(tags)
          ? tags
          : typeof tags === "string"
          ? tags.split(",")
          : []
        )
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const b64 = Buffer.from(file.buffer).toString("base64");
          const dataURI = "data:" + file.mimetype + ";base64," + b64;
          const result = await cloudinary.uploader.upload(dataURI, {
            folder: "infinora/products",
            width: 800,
            height: 800,
            crop: "fill",
            quality: "auto",
          });
          imageUrls.push(result.secure_url);
        } catch (error) {
          console.error("Error uploading image:", error);
          return res.status(500).json({
            success: false,
            message: "Failed to upload product images",
            error: error.message,
          });
        }
      }
    }

    const productData = {
      name: name.trim(),
      description: description.trim(),
      images: imageUrls,
      variants: variants || [],
      variantCombinations: variantCombinations || [],
      price,
      stock: variants?.length ? 0 : stock,
      shipping,
      discount: discount || 0,
      category,
      subCategory: subCategory || null,
      status: status || "available",
      tags: processedTags,
      additionalDetails: additionalDetails ? additionalDetails.trim() : "",
      customizable: Boolean(customizable),
      vendor: user._id,
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Error in addVendorProducts:", error);
    res.status(500).json({
      success: false,
      message: "Error adding product",
      error: error.message,
    });
  }
};

const editVendorProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      discount,
      category,
      subCategory,
      status,
      tags,
      variants,
      variantCombinations,
      shipping,
      additionalDetails,
      customizable,
      existingImages,
    } = req.body;
    const productId = req.params.productId;

    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No authentication token found." });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    if (product.vendor.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this product.",
      });
    }

    let parsedVariants = variants;
    let parsedVariantCombinations = variantCombinations;
    let parsedShipping = shipping;
    let parsedExistingImages = [];

    if (variants && typeof variants === "string") {
      try {
        parsedVariants = JSON.parse(variants);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid variants data format",
          error: error.message,
        });
      }
    }

    if (variantCombinations && typeof variantCombinations === "string") {
      try {
        parsedVariantCombinations = JSON.parse(variantCombinations);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid variant combinations data format",
          error: error.message,
        });
      }
    }

    if (shipping && typeof shipping === "string") {
      try {
        parsedShipping = JSON.parse(shipping);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid shipping data format",
          error: error.message,
        });
      }
    }

    if (existingImages && typeof existingImages === "string") {
      try {
        parsedExistingImages = JSON.parse(existingImages);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid existing images format",
          error: error.message,
        });
      }
    }

    if (price) {
      const priceValue = Number(price);
      if (isNaN(priceValue) || priceValue < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a non-negative number",
        });
      }
    }

    if (discount) {
      const discountValue = Number(discount);
      if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
        return res.status(400).json({
          success: false,
          message: "Discount must be a number between 0 and 100",
        });
      }
    }

    if (parsedVariants?.length > 0) {
      for (const variant of parsedVariants) {
        if (!variant.variantName || !Array.isArray(variant.variantTypes)) {
          return res.status(400).json({
            success: false,
            message: `Invalid variant structure for variant: ${
              variant.variantName || "unnamed"
            }`,
          });
        }

        for (const type of variant.variantTypes) {
          if (!type.name) {
            return res.status(400).json({
              success: false,
              message: `Missing required fields in variant type for ${variant.variantName}`,
            });
          }
        }
      }

      if (!parsedVariantCombinations?.length) {
        return res.status(400).json({
          success: false,
          message:
            "Variant combinations are required when variants are specified",
        });
      }

      for (const combo of parsedVariantCombinations) {
        if (!combo.variants || !combo.stock) {
          return res.status(400).json({
            success: false,
            message: "Invalid variant combination structure",
          });
        }

        combo.stock = Number(combo.stock);
        combo.priceAdjustment = Number(combo.priceAdjustment || 0);

        if (isNaN(combo.stock) || combo.stock < 0) {
          return res.status(400).json({
            success: false,
            message: "Stock must be a non-negative number",
          });
        }

        if (isNaN(combo.priceAdjustment)) {
          return res.status(400).json({
            success: false,
            message: "Price adjustment must be a number",
          });
        }
      }
    }

    const processedTags = tags ? tags.split(",").map((tag) => tag.trim()) : [];
    let updatedImages = [...parsedExistingImages];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const b64 = Buffer.from(file.buffer).toString("base64");
          const dataURI = "data:" + file.mimetype + ";base64," + b64;
          const result = await cloudinary.uploader.upload(dataURI, {
            folder: "infinora/products",
            width: 800,
            height: 800,
            crop: "fill",
            quality: "auto",
          });
          updatedImages.push(result.secure_url);
        } catch (error) {
          console.error("Error uploading image:", error);
          return res.status(500).json({
            success: false,
            message: "Failed to upload product images",
            error: error.message,
          });
        }
      }
    }

    const imagesToDelete = product.images.filter(
      (img) => !updatedImages.includes(img)
    );

    for (const imageUrl of imagesToDelete) {
      try {
        const publicId = imageUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error("Error deleting old image from Cloudinary:", error);
      }
    }

    const updateData = {
      name: name?.trim(),
      description: description?.trim(),
      price: price ? Number(price) : undefined,
      stock: parsedVariants?.length
        ? 0
        : stock !== undefined
        ? Number(stock)
        : undefined,
      discount: discount ? Number(discount) : undefined,
      category: category || undefined,
      subCategory: subCategory || undefined,
      status: status || undefined,
      tags: processedTags.length > 0 ? processedTags : undefined,
      variants: parsedVariants || undefined,
      variantCombinations: parsedVariantCombinations || undefined,
      shipping: parsedShipping || undefined,
      additionalDetails: additionalDetails?.trim(),
      customizable:
        customizable !== undefined ? Boolean(customizable) : undefined,
      images: updatedImages,
    };

    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error in editVendorProduct:", error);
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

const getAVendorProducts = async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (!vendorId) {
      return res.status(400).json({
        success: false,
        message: "Vendor ID is required"
      });
    }

    const products = await Product.find({ vendor: vendorId, isListed: true })
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("vendor", "name email profileImagePath")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    console.error("Error fetching vendor products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching vendor products",
      error: error.message,
    });
  }
};

module.exports = {
  verifyVendor,
  registerVendorDetails,
  addVendorProducts,
  editVendorProduct,
  getAVendorProducts,
};
