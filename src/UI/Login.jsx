import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BASE_URL } from "../utils/Config";


function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/user/login`, formData, {
        withCredentials: true,
      });

      if (res.data?.success) {
        toast.success(res.data.message);

        localStorage.setItem("userToken", res.data.token);
        localStorage.setItem("role", res.data?.user?.role);
        localStorage.setItem("userDet", JSON.stringify(res.data?.user));

        if (res.data.student) {
          localStorage.setItem("studentDet", JSON.stringify(res.data.student));
        }

        const role = res.data.user.role;
        const studentDet = res.data.student;

        if (role === "admin") navigate("/admin");
        else if (role === "user" && !studentDet) navigate("/student-register");
        else navigate("/");
      } else {
        toast.error(res.data?.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4"
      style={{
        backgroundImage:
          "url('https://giet.edu.in/wp-content/uploads/2023/02/bn1.jpg')",
      }}
    >
      {/* Very Light Overlay */}
      <div className="absolute inset-0 bg-white/10"></div>

      {/* Login Card */}
      <div
        className="relative w-full max-w-md rounded-3xl p-[1px]
  bg-gradient-to-br from-purple-600/50 via-indigo-600/40 to-pink-600/40
  shadow-2xl"
      >
        <div
          className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50
    rounded-3xl p-8 border border-purple-200 backdrop-blur-xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1
              className="text-4xl font-extrabold text-transparent bg-clip-text
        bg-gradient-to-r from-purple-700 via-indigo-700 to-pink-600"
            >
              CFMS Login
            </h1>
            <p className="text-purple-700 mt-2">
              Secure access to your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-purple-800">
                Email Address
              </label>
              <div className="relative mt-1">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-purple-300
              bg-white px-4 py-2.5 text-purple-900
              focus:ring-2 focus:ring-purple-500
              focus:border-transparent outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-purple-800">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-purple-300
              bg-white px-4 py-2.5 pr-12 text-purple-900
              focus:ring-2 focus:ring-purple-500
              focus:border-transparent outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
              text-purple-500 hover:text-purple-700 transition"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r
          from-purple-600 via-indigo-600 to-pink-600
          text-white py-3 rounded-xl font-semibold
          shadow-lg hover:shadow-xl hover:scale-[1.02]
          active:scale-[0.97] transition-all"
            >
              Sign In
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-purple-700 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;