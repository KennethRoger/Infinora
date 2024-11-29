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
      required: function () {
        return this.role === "user" || this.role === "vendor";
      },
      default: false,
    },
    email: {
      type: String,
      required: function () {
        return this.role === "user" || this.role === "vendor";
      },
      unique: true,
      sparse: true,
    },
    phoneNumber: {
      type: String,
      required: function () {
        this.role === "vendor";
      },
      unique: true,
      sparse: true,
      default: null,
    },
    googleId: {
      type: String,
      sparse: true,
      default: null,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId || !this.googlePicture;
      },
      default: null
    },
    profileImagePath: {
      type: String,
      required: function () {
        return this.role === "vendor";
      },
      default: null,
    },
    name: {
      type: String,
      required: function () {
        return this.role === "vendor" || this.role === "admin";
      },
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
      required: function () {
        return this.role === "vendor";
      },
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
      required: function () {
        return this.role === "vendor";
      },
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
