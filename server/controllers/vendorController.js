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
    console.log(typeof password);
    console.log(typeof user.password);
    console.log(user.password);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Incorrect password");
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
    console.log("Processing vendor details update...");
    console.log(
      "Files received:",
      req.files ? Object.keys(req.files) : "No files"
    );

    let profileImagePath = null;
    if (req.files && req.files.profileImage) {
      try {
        const b64 = Buffer.from(req.files.profileImage[0].buffer).toString(
          "base64"
        );
        const dataURI =
          "data:" + req.files.profileImage[0].mimetype + ";base64," + b64;

        console.log("Uploading profile image to Cloudinary...");
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "infinora/vendors/profile",
          width: 500,
          height: 500,
          crop: "fill",
          quality: "auto",
        });
        profileImagePath = result.secure_url;
        console.log("Profile image uploaded successfully");
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

        console.log("Uploading ID card to Cloudinary...");
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "infinora/vendors/id_proofs",
          format: "pdf",
          pages: true,
        });
        idProofPath = result.secure_url;
        console.log("ID card uploaded successfully");
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

    console.log("Updating user details in database...");
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

    console.log("Vendor details updated successfully");
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
  console.log("Product addition initiated");
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

    // Parse JSON strings if needed
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

    // Validate discount
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

    // Validate base price
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

    // Validate variants and combinations
    if (variants?.length > 0) {
      // Validate each variant
      for (const variant of variants) {
        if (!variant.variantName || !Array.isArray(variant.variantTypes)) {
          return res.status(400).json({
            success: false,
            message: `Invalid variant structure for variant: ${
              variant.variantName || "unnamed"
            }`,
          });
        }

        // Validate variant types
        for (const type of variant.variantTypes) {
          if (!type.name) {
            return res.status(400).json({
              success: false,
              message: `Missing required fields in variant type for ${variant.variantName}`,
            });
          }
        }
      }

      // Validate variant combinations if variants exist
      if (!variantCombinations?.length) {
        return res.status(400).json({
          success: false,
          message:
            "Variant combinations are required when variants are specified",
        });
      }

      // Validate each combination
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
    if (decoded.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access. Only vendors can add products.",
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Vendor account not found.",
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

    // Parse JSON strings if needed
    let parsedVariants = variants;
    let parsedVariantCombinations = variantCombinations;
    let parsedShipping = shipping;

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

    // Validate price
    if (price) {
      const priceValue = Number(price);
      if (isNaN(priceValue) || priceValue < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a non-negative number",
        });
      }
    }

    // Validate discount
    if (discount) {
      const discountValue = Number(discount);
      if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
        return res.status(400).json({
          success: false,
          message: "Discount must be a number between 0 and 100",
        });
      }
    }

    // Validate variants and combinations if present
    if (parsedVariants?.length > 0) {
      // Validate each variant
      for (const variant of parsedVariants) {
        if (!variant.variantName || !Array.isArray(variant.variantTypes)) {
          return res.status(400).json({
            success: false,
            message: `Invalid variant structure for variant: ${
              variant.variantName || "unnamed"
            }`,
          });
        }

        // Validate variant types
        for (const type of variant.variantTypes) {
          if (!type.name) {
            return res.status(400).json({
              success: false,
              message: `Missing required fields in variant type for ${variant.variantName}`,
            });
          }
        }
      }

      // Validate variant combinations if variants exist
      if (!parsedVariantCombinations?.length) {
        return res.status(400).json({
          success: false,
          message: "Variant combinations are required when variants are specified",
        });
      }

      // Validate each combination
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
    let updatedImages = product.images.slice();

    if (req.files && req.files.length > 0) {
      const imagePositions = req.body.imagePositions
        ? JSON.parse(req.body.imagePositions)
        : Array(req.files.length).fill(null);

      if (!Array.isArray(imagePositions)) {
        return res.status(400).json({
          success: false,
          message: "Invalid image positions. Provide an array of positions.",
        });
      }

      for (let i = 0; i < req.files.length; i++) {
        const position = imagePositions[i];

        if (position !== null && updatedImages[position]) {
          const oldImageUrl = updatedImages[position];
          const publicId = oldImageUrl.split("/").pop().split(".")[0];

          try {
            await cloudinary.uploader.destroy(publicId);
            console.log(
              `Old image with public ID ${publicId} deleted from Cloudinary.`
            );
          } catch (error) {
            console.error("Error deleting old image from Cloudinary:", error);
            return res.status(500).json({
              success: false,
              message: "Failed to delete old image from Cloudinary",
              error: error.message,
            });
          }
        }

        try {
          const b64 = Buffer.from(req.files[i].buffer).toString("base64");
          const dataURI = "data:" + req.files[i].mimetype + ";base64," + b64;
          const result = await cloudinary.uploader.upload(dataURI, {
            folder: "infinora/products",
            width: 800,
            height: 800,
            crop: "fill",
            quality: "auto",
          });

          if (position !== null) {
            updatedImages[position] = result.secure_url;
          } else {
            updatedImages.push(result.secure_url);
          }
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

    const updateData = {
      ...(name && { name: name.trim() }),
      ...(description && { description: description.trim() }),
      ...(price && { price: Number(price) }),
      ...(parsedVariants?.length ? { stock: 0 } : stock !== undefined && { stock: Number(stock) }),
      ...(discount && { discount: Number(discount) }),
      ...(category && { category }),
      ...(subCategory && { subCategory }),
      ...(status && { status }),
      ...(processedTags.length > 0 && { tags: processedTags }),
      ...(parsedVariants && { variants: parsedVariants }),
      ...(parsedVariantCombinations && { variantCombinations: parsedVariantCombinations }),
      ...(parsedShipping && { shipping: parsedShipping }),
      ...(additionalDetails && { additionalDetails: additionalDetails.trim() }),
      ...(customizable !== undefined && { customizable: Boolean(customizable) }),
      images: updatedImages,
    };

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

module.exports = {
  verifyVendor,
  registerVendorDetails,
  addVendorProducts,
  editVendorProduct,
};
