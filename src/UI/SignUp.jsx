import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import BASE_URL from "../utils/Config";
import toast from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    gender: "male",
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URL}/user/register`, formData, {
        withCredentials: true,
      });

      if (res.data?.success) {
        toast.success(res.data?.message);
        setFormData({
          username: "",
          email: "",
          password: "",
          role: "user",
          gender: "male",
        });
        navigate("/login");
      } else {
        toast.error(res.data?.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to register. Please try again.",
      );
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
      {/* Soft background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_60%)]" />

      {/* Card Wrapper */}
      <div
        className="relative w-full max-w-md rounded-3xl p-[1px]
  bg-gradient-to-br from-purple-400/60 via-indigo-400/50 to-pink-400/60
  shadow-2xl animate-fadeIn"
      >
        {/* Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-white/60 animate-float">
          {/* Header */}
          <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-indigo-700 to-pink-600 mb-2">
            Create Account
          </h2>

          <p className="text-center text-gray-600 mb-6">
            Join CFMS to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300
          focus:ring-2 focus:ring-purple-500 outline-none transition-all
          hover:shadow-sm focus:-translate-y-[1px]"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300
          focus:ring-2 focus:ring-purple-500 outline-none transition-all
          hover:shadow-sm focus:-translate-y-[1px]"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300
          focus:ring-2 focus:ring-purple-500 outline-none pr-12 transition-all
          hover:shadow-sm focus:-translate-y-[1px]"
                required
              />
              <div
                className="absolute right-4 top-9 cursor-pointer text-gray-500 hover:text-purple-600 transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={22} />
                ) : (
                  <AiOutlineEye size={22} />
                )}
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300
          focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300
          focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
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
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
