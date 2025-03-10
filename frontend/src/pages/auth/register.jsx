import React, { useState } from "react";
import logo from "@/assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "@/store/slices/auth-slice";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function AuthRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()_\-+={}[\]|\'<>?/])\S{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      alert(
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
      );
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    } else {
      dispatch(registerUser(formData))
        .then((data) => {
          if (data?.payload?.success) {
            alert(data?.payload?.message || "Registration successful");
            navigate("/auth/login");
          } else {
            alert(data?.payload?.message || "Registration failed");
          }
        })
        .catch((error) => {
          alert(error?.payload?.message || "Registration failed");
        });
    }
  }

  return (
    <div className="justify-center sm:px-6 lg:px-8 bg-white">
      <div className="max-w-md w-full space-y-4 bg-white p-6 rounded-3xl shadow-xl">
        <div className="text-center">
          <img
            alt="Your Company"
            src={logo}
            className="mx-auto h-10 w-auto transform transition-transform duration-300 hover:scale-110"
          />
          <h2 className="mt-3 text-2xl font-bold text-gray-900 tracking-tight">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join us and start your journey
          </p>
        </div>

        <form className="mt-4 space-y-2" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="group text-left flex-1">
                <label
                  htmlFor="firstName"
                  className="text-sm font-medium text-gray-700 mb-1 transition-colors group-hover:text-indigo-600"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="Enter first name"
                  required
                  className="block w-full px-3 py-1.5 border border-indigo-200 rounded-2xl text-gray-900 placeholder-gray-400 
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-indigo-300 focus:outline-none"
                />
              </div>

              <div className="group text-left flex-1">
                <label
                  htmlFor="lastName"
                  className="text-sm font-medium text-gray-700 mb-1 transition-colors group-hover:text-indigo-600"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="Enter last name"
                  required
                  className="block w-full px-3 py-1.5 border border-indigo-200 rounded-2xl text-gray-900 placeholder-gray-400 
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-indigo-300 focus:outline-none"
                />
              </div>
            </div>

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
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter email"
                autoComplete="email"
                required
                className="block w-full px-3 py-1.5 border border-indigo-200 rounded-2xl text-gray-900 placeholder-gray-400 
                         focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-indigo-300 focus:outline-none"
              />
            </div>

            <div className="group text-left">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 mb-1 transition-colors group-hover:text-indigo-600"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Create a password"
                  required
                  className="block w-full px-3 py-1.5 border border-indigo-200 rounded-2xl text-gray-900 placeholder-gray-400
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-indigo-300 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <FaEye className="h-4 w-4" />
                  ) : (
                    <FaEyeSlash className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="group text-left">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700 mb-1 transition-colors group-hover:text-indigo-600"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm your password"
                  required
                  className="block w-full px-3 py-1.5 border border-indigo-200 rounded-2xl text-gray-900 placeholder-gray-400
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-indigo-300 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <FaEye className="h-4 w-4" />
                  ) : (
                    <FaEyeSlash className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-1.5 px-4 text-white bg-indigo-600 rounded-2xl font-medium text-sm
                       hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              Create Account
            </button>
          </div>

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
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
              >
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthRegister;
