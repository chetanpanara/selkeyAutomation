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
    <div className="flex min-h-full items-center justify-center sm:px-6 lg:px-8 bg-white">
      <div className="max-w-md w-full space-y-4 bg-white p-6 rounded-3xl shadow-xl">
        <div className="text-center">
          <img
            alt="Selkey Automation"
            src={logo}
            className="mx-auto h-10 w-auto transform transition-transform duration-300 hover:scale-110"
          />
          <h2 className="mt-3 text-2xl font-bold text-gray-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to continue your journey
          </p>
        </div>

        <form className="mt-4 space-y-2" onSubmit={handleSubmit}>
          {/* {error && <div className="text-red-500 text-center">{error}</div>} */}
          <div className="space-y-2">
            <div className="group text-left">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 mb-1 transition-colors group-hover:text-indigo-600"
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
                  className="block w-full px-3 py-1.5 border border-indigo-200 rounded-2xl text-gray-900 placeholder-gray-400 
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-indigo-300 focus:outline-none"
                />
              </div>
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
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="block w-full px-3 py-1.5 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-400
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
          </div>

          <div className="flex items-center justify-end">
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
              className="w-full py-1.5 px-4 text-white bg-indigo-600 rounded-2xl font-medium text-sm
                       hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              Sign in
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
