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
    <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
      {/* Card Header */}
      <div className="bg-indigo-600 px-6 py-5 text-center">
        <img
          alt="Selkey Automation"
          src={logo}
          className="mx-auto h-12 w-auto transform transition-transform duration-300 hover:scale-110"
        />
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
          Create an Account
        </h2>
        <p className="mt-2 text-sm text-indigo-100">
          Join us and start your journey
        </p>
      </div>

      {/* Form Body */}
      <div className="px-4 py-4">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="group text-left flex-1">
                <label
                  htmlFor="firstName"
                  className="mb-1 block text-sm font-medium text-gray-700 transition-colors group-hover:text-indigo-600"
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
                  className="block w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 
                             focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 hover:border-indigo-300"
                />
              </div>

              <div className="group text-left flex-1">
                <label
                  htmlFor="lastName"
                  className="mb-1 block text-sm font-medium text-gray-700 transition-colors group-hover:text-indigo-600"
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
                  className="block w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 
                             focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 hover:border-indigo-300"
                />
              </div>
            </div>

            <div className="group text-left">
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700 transition-colors group-hover:text-indigo-600"
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
                className="block w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 
                           focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 hover:border-indigo-300"
              />
            </div>

            <div className="group text-left">
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700 transition-colors group-hover:text-indigo-600"
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
                  className="block w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400
                             focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 hover:border-indigo-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-indigo-600 focus:outline-none"
                >
                  {showPassword ? (
                    <FaEye className="h-5 w-5" />
                  ) : (
                    <FaEyeSlash className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="group text-left">
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium text-gray-700 transition-colors group-hover:text-indigo-600"
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
                  className="block w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400
                             focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 hover:border-indigo-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-indigo-600 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <FaEye className="h-5 w-5" />
                  ) : (
                    <FaEyeSlash className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm
                         transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              Create Account
            </button>
          </div>



          <div className="mt-4 text-center">
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