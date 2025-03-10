const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  verifyOTP,
  resetPassword,
  authMiddleware,
} = require("../../controllers/auth/auth-controller");

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user,
  });
});
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/verify-otp", verifyOTP);
authRouter.post("/reset-password", resetPassword);

module.exports = authRouter;
