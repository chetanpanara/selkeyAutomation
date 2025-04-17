const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    contact: {
      type: String,
      default: null, // Changed from "" to null for better consistency
    },
    resetPasswordOTP: {
      type: String,
      default: null,
    },
    resetPasswordOTPExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.methods.verifyResetPasswordOTP = function (otp) {
  return (
    this.resetPasswordOTP === otp &&
    this.resetPasswordOTPExpiry &&
    this.resetPasswordOTPExpiry > Date.now()
  );
};

userSchema.methods.clearResetPasswordOTP = function () {
  this.resetPasswordOTP = null;
  this.resetPasswordOTPExpiry = null;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
