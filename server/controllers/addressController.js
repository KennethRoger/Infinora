const Address = require("../models/Address");
const { verifyToken } = require("../utils/tokenValidator");

const getUserAddress = async (req, res) => {
  
  try {
    const { token } = req.cookies;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    const decoded = verifyToken(token);

    const addresses = await Address.find({ userId: decoded.id });

    if (!addresses)
      return res
        .status(400)
        .json({ success: false, message: "No address present for the user" });

    res.status(200).json({ success: true, addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching address details" });
  }
};

const findAddress = async (req, res) => {
  try {
    const { addressId } = req.body;
    
    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "Address ID is required.",
      });
    }

    const address = await Address.findById(addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address retrieved successfully.",
      data: address,
    });
  } catch (error) {
    console.error("Error finding address:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

const addAddress = async (req, res) => {
  try {
    const {
      userId,
      fullName,
      phoneNumber,
      pincode,
      locality,
      address,
      district,
      state,
    } = req.body;

    if (
      !userId ||
      !fullName ||
      !phoneNumber ||
      !pincode ||
      !locality ||
      !address ||
      !district ||
      !state
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const addressCount = await Address.countDocuments({ userId });
    if (addressCount >= 5) {
      return res.status(400).json({
        success: false,
        message: "Address limit for the user has been exceeded.",
      });
    }

    const newAddress = new Address({
      userId,
      fullName,
      phoneNumber,
      pincode,
      locality,
      address,
      district,
      state,
    });

    await newAddress.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully.",
      data: newAddress,
    });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

const editAddress = async (req, res) => {
  try {
    const {
      addressId,
      fullName,
      phoneNumber,
      pincode,
      locality,
      address,
      district,
      state,
    } = req.body;

    console.log("req body: ", req.body);

    if (
      !addressId ||
      !fullName ||
      !phoneNumber ||
      !pincode ||
      !locality ||
      !address ||
      !district ||
      !state
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const existingAddress = await Address.findById(addressId);
    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    existingAddress.fullName = fullName;
    existingAddress.phoneNumber = phoneNumber;
    existingAddress.pincode = pincode;
    existingAddress.locality = locality;
    existingAddress.address = address;
    existingAddress.district = district;
    existingAddress.state = state;

    const updatedAddress = await existingAddress.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully.",
      data: updatedAddress,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.body;

    if (!addressId) {
      return res
        .status(400)
        .json({ success: false, message: "Address ID is required" });
    }

    const deletedAddress = await Address.findByIdAndDelete(addressId);

    if (!deletedAddress) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ success: false, message: "Error deleting address" });
  }
};

module.exports = {
  getUserAddress,
  findAddress,
  addAddress,
  editAddress,
  deleteAddress,
};
