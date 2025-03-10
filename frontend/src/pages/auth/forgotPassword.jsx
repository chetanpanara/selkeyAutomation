import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useDispatch } from "react-redux";
import { forgotPassword, resetPassword, verifyOTP } from "@/store/slices/auth-slice";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [resetToken, setResetToken] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSendOTP = async (e) => {
    e.preventDefault();

    dispatch(forgotPassword(email)).then((data) => {
      if (data?.payload?.success) {
        alert(
          data?.payload?.message ||
            "OTP sent successfully! Please check your email."
        );
        setStep(2);
      } else {
        alert(data?.error?.response?.data?.message || "Failed to send OTP");
      }
    });
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    dispatch(verifyOTP({ email, otp })).then((data) => {
      if (data?.payload?.resetToken) {
        setResetToken(data?.payload?.resetToken);
        alert(data?.payload?.message || "OTP verified successfully!");
        setStep(3);
      } else {
        alert(data?.error?.response?.data?.message || "Invalid OTP");
      }
    });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    dispatch(resetPassword({ resetToken, newPassword })).then((data) => {
      if (data?.payload?.message) {
        alert(data?.payload?.message || "Password reset successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        alert(
          data?.error?.response?.data?.message || "Failed to reset password"
        );
      }
    });
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <form className="mt-4 space-y-2" onSubmit={handleSendOTP}>
            <div className="space-y-2">
              <div className="group text-left">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 mb-1 transition-colors group-hover:text-indigo-600"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  className="block w-full px-3 py-1.5 border border-indigo-200 rounded-2xl text-gray-900 placeholder-gray-400 
                         focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-indigo-300 focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-1.5 px-4 text-white bg-indigo-600 rounded-2xl font-medium text-sm
                                                 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              Send OTP
            </button>
          </form>
        );
      case 2:
        return (
          <form className="mt-4 space-y-2" onSubmit={handleVerifyOTP}>
            <div className="space-y-2">
              <div className="group text-left">
                <label
                  htmlFor="otp"
                  className="text-sm font-medium text-gray-700 mb-1 transition-colors group-hover:text-indigo-600"
                >
                  Enter OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP sent to your email"
                  required
                  className="block w-full px-3 py-1.5 border border-indigo-200 rounded-2xl text-gray-900 placeholder-gray-400 
                                             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-indigo-300 focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-1.5 px-4 text-white bg-indigo-600 rounded-2xl font-medium text-sm
                                                 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              Verify OTP
            </button>
            <button
              type="button"
              onClick={handleSendOTP}
              className="w-full mt-2 py-1.5 px-4 text-indigo-600 bg-transparent border border-indigo-600 rounded-2xl font-medium text-sm
                                     hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              Resend OTP
            </button>
          </form>
        );
      case 3:
        return (
          <form className="mt-4 space-y-2" onSubmit={handleResetPassword}>
            <div className="space-y-2">
              <div className="group text-left">
                <label
                  htmlFor="newPassword"
                  className="text-sm font-medium text-gray-700 mb-1 transition-colors group-hover:text-indigo-600"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="block w-full px-3 py-1.5 border border-indigo-200 rounded-2xl text-gray-900 placeholder-gray-400 
                                             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-indigo-300 focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-1.5 px-4 text-white bg-indigo-600 rounded-2xl font-medium text-sm
                       hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              Reset Password
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-md w-full space-y-4 bg-white p-6 rounded-3xl shadow-xl">
        <div className="text-center">
          <img
            alt="Your Company"
            src={logo}
            className="mx-auto h-10 w-auto transform transition-transform duration-300 hover:scale-110"
          />
          <h2 className="mt-3 text-2xl font-bold text-gray-900 tracking-tight">
            {step === 1
              ? "Reset Your Password"
              : step === 2
              ? "Verify OTP"
              : "Set New Password"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1
              ? "Enter your email address and we'll send you instructions to reset your password."
              : step === 2
              ? "Enter the OTP sent to your email address."
              : "Enter your new password to complete the reset process."}
          </p>
        </div>

        {renderStepContent()}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <a
              href="/auth/login"
              className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
            >
              Back to login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
