const Address = require("../models/Address");

const getUserAddress = (req, res) => {
  
}

const addAddress = async (req, res) => {
  try {
    const {
      userId,
      name,
      phoneNumber,
      pincode,
      locality,
      address,
      district,
      state,
    } = req.body;

    if (
      !userId ||
      !name ||
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
      fullName: name,
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
module.exports = { addAddress };
