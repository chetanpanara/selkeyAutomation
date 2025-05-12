import React, { useState } from "react";
import logo from "@/assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/slices/auth-slice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function AuthLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();
    // if password is less than 8 characters, show error
    if (formData.password.length < 8) {
      toast("Password must be at least 8 characters long");
      return;
    }
    // Check if password meets all requirements
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;
    const isPasswordValid = passwordRegex.test(formData.password);

    if (!isPasswordValid) {
      toast(
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
      );
      return;
    }

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast(data?.payload?.message || "Login successful");
        navigate("/");
      } else {
        toast(data?.payload?.message || "Login failed");
      }
    });
  }

  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl  ">
      {/* Card Header */}
      <div className="bg-gray-100 px-6 py-5 text-center">
        <img
          alt="Selkey Automation"
          src={logo}
          className="mx-auto h-12 w-auto transform transition-transform duration-300 hover:scale-110"
        />
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-indigo-500">
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-gray-700">
          Please sign in to continue your journey
        </p>
      </div>

      {/* Form Body */}
      <div className="px-4 py-4">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="group text-left">
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700 transition-colors group-hover:text-indigo-600"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 
                             focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 hover:border-indigo-300"
                />
              </div>
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
                  placeholder="Enter your password"
                  autoComplete="current-password"
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
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
            <a
              href="/auth/forgot-password"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          <div>
            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm
                         transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              Sign in
            </button>
          </div>



          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/auth/register"
                className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
              >
                Create one now
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthLogin;