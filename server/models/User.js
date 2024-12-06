const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "vendor", "admin"],
      required: true,
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      default: null
    },
    phoneNumber: {
      type: String,
      sparse: true,
      default: null,
    },
    googleId: {
      type: String,
      sparse: true,
      default: null,
    },
    adminId: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      default: null,
    },
    profileImagePath: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    speciality: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    socialLink: {
      type: String,
      default: null,
    },
    about: {
      type: String,
      default: null,
    },
    idProofPath: {
      type: String,
      default: null,
    },
    googlePicture: {
      type: String,
      default: null,
    },
    googleVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
