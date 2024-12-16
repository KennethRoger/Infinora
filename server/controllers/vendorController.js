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
  console.log("Product addition initaited");
  try {
    let {
      name,
      description,
      category,
      subCategory,
      status,
      tags,
      discount,
      variant,
      additionalDetails,
      customizable,
    } = req.body;

    if (typeof variant === "string") {
      try {
        variant = JSON.parse(variant);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid variant data format",
          error: error.message,
        });
      }
    }

    if (
      !variant ||
      !variant.variantName ||
      !Array.isArray(variant.variantTypes)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid variant data. Must include variantName and variantTypes array",
      });
    }

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

    const processedTags = tags ? tags.split(",").map((tag) => tag.trim()) : [];

    const imageUrls = [];
    if (req.files) {
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
            message: "Failed to upload image",
            error: error.message,
          });
        }
      }
    }

    const processedVariant = {
      variantName: variant.variantName,
      variantTypes: variant.variantTypes.map((type) => {
        if (!type.name || !type.price || !type.stock || !type.shipping) {
          throw new Error("Missing required fields in variant type");
        }

        return {
          name: type.name,
          price: Number(type.price),
          imageIndex: type.imageIndex !== null ? Number(type.imageIndex) : null,
          stock: Number(type.stock),
          shipping: {
            weight: type.shipping.weight,
            dimensions: {
              length: Number(type.shipping.dimensions?.length || 0),
              width: Number(type.shipping.dimensions?.width || 0),
              height: Number(type.shipping.dimensions?.height || 0),
            },
          },
        };
      }),
    };

    const product = new Product({
      name,
      description,
      images: imageUrls,
      variant: processedVariant,
      discount: Number(discount || 0),
      category,
      subCategory,
      status,
      tags: processedTags,
      additionalDetails,
      customizable: req.body.customizable === "true",
      vendor: user._id,
    });

    await product.save();
    console.log("Product added successfully:", product);
    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add product",
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
      status,
      tags,
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

    const processedTags = tags ? tags.split(",").map((tag) => tag.trim()) : [];
    let updatedImages = product.images.slice(); // Clone current images to update

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
          console.error("Error uploading new image:", error);
          return res.status(500).json({
            success: false,
            message: "Failed to upload image",
            error: error.message,
          });
        }
      }
    }

    while (updatedImages.length < 4) {
      updatedImages.push(null);
    }
    updatedImages = updatedImages.slice(0, 4);

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ? Number(price) : product.price;
    product.stock = stock ? Number(stock) : product.stock;
    product.discount = discount ? Number(discount) : product.discount;
    product.category = category || product.category;
    product.status = status || product.status;
    product.tags = processedTags.length > 0 ? processedTags : product.tags;
    product.images = updatedImages;

    await product.save();

    console.log("Product updated successfully:", product);
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error editing product:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to edit product",
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
