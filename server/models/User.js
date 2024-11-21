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
        return this.role === "user" || this.role === "vendor"
      },
      default: false
    },
    email: {
      type: String,
      required: function () {
        return this.role === "user" || this.role === "vendor";
      },
      unique: true,
      default: null,
    },
    phoneNumber: {
      type: String,
      required: function () {
        return this.role === "user" || this.role === "vendor";
      },
      unique: true,
      default: null,
    },
    password: {
      type: String,
      required: true,
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
      type: String,
      enum: [
        "fashion",
        "home decor",
        "jewelry",
        "footwear",
        "accessories",
        "pet products",
        "models",
        "artwork",
        "custom craft",
        "others",
      ],
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
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
