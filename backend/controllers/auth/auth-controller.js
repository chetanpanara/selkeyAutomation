const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const Folder = require("../../models/Folder");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const UserProfile = require("../../models/UserProfile");
dotenv.config();

//register user
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }
    // check if password is at least 8 characters long
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }
    // password must contain at least one uppercase letter, one lowercase letter, and one number
    if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
      // save new user
      const savedUser = await newUser.save();

      const profile = await UserProfile.findOne({ userId: savedUser._id });
      if (!profile) {
        // create user profile
        const userProfile = new UserProfile({
          userId: savedUser._id,
        });
        await userProfile.save();
      }

      return res.status(200).json({
        success: true,
        message: "User registration successful",
      });
    }
  } catch (error) {
    console.log("Error during registration:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.status(400).json({
        success: false,
        message: "User not found with this email",
      });
    }

    const isMatch = await bcrypt.compare(password, checkUser.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password for this email",
      });
    }

    // Create default folders: Home and Trash if not exist and user is not admin
    let homeFolder = await Folder.findOne({
      userId: checkUser._id,
      folderName: "Home",
    });
    let trashFolder = await Folder.findOne({
      userId: checkUser._id,
      folderName: "Trash",
    });

    if (!homeFolder && checkUser.role === "user") {
      homeFolder = new Folder({
        userId: checkUser._id,
        folderName: "Home",
        isSpecial: true,
      });
      await homeFolder.save();
    }

    if (!trashFolder && checkUser.role === "user") {
      trashFolder = new Folder({
        userId: checkUser._id,
        folderName: "Trash",
        isSpecial: true,
      });
      await trashFolder.save();
    }

    // create token
    const token = jwt.sign(
      {
        id: checkUser._id,
        email: checkUser.email,
        role: checkUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: 182.5 * 24 * 60 * 60 * 1000, //convert 182.5 days into milliseconds from current time
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      // max age or expiry date of the token in cookies
      // 182.5 days from current time
      maxAge: 182.5 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: checkUser._id,
        email: checkUser.email,
        role: checkUser.role,
      },
    });
  } catch (error) {
    console.log("Error during login:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

//logout user
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      path: "/",
      secure: true,
    });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

// send OTP email to user
const sendOTPEmail = async (email, otp) => {
  // Configure nodemailer here
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    html: `<p style="font-size: 16px;">Your OTP for password reset is: <strong>${otp}</strong>. This OTP will expire in 5 minutes.</p> <p style="font-size: 16px;">If you did not request this, please ignore this email.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

// generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = generateOTP();

    user.resetPasswordOTP = otp.toString();
    user.resetPasswordOTPExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await user.save();

    try {
      await sendOTPEmail(email, otp);
      res.status(200).json({
        success: true,
        message: "OTP sent successfully",
      });
    } catch (emailError) {
      user.clearResetPasswordOTP();
      await user.save();

      res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing request",
      error: error.message,
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    // check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // check if OTP is valid
    if (!user.verifyResetPasswordOTP(otp.toString())) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }
    // generate reset token
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    // clear OTP
    user.clearResetPasswordOTP();
    await user.save();

    res.json({
      success: true,
      message: "OTP verified",
      resetToken,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Error verifying OTP",
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    // verify reset token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

    if (!decoded) {
      return res.json({
        success: false,
        message: "Invalid reset token",
      });
    }

    const user = await User.findOne({ email: decoded.email });

    // check if user exists
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }
    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // update user password
    user.password = hashedPassword;
    // save user
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error resetting password",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  forgotPassword,
  verifyOTP,
  resetPassword,
};
