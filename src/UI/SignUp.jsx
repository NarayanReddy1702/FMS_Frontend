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
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD

=======
    setLoading(true);
>>>>>>> 589774a (Payment Page Added Successfully!)
    try {
      const res = await axios.post(`${BASE_URL}/user/register`, formData, {
        withCredentials: true,
      });
<<<<<<< HEAD

      if (res.data?.success) {
        toast.success(res.data?.message);
        setFormData({
          username: "",
          email: "",
          password: "",
          role: "user",
          gender: "male",
        });
=======
      if (res.data?.success) {
        toast.success(res.data?.message);
        setFormData({ username: "", email: "", password: "", role: "user", gender: "" });
>>>>>>> 589774a (Payment Page Added Successfully!)
        navigate("/login");
      } else {
        toast.error(res.data?.message || "Something went wrong!");
      }
    } catch (error) {
<<<<<<< HEAD
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
=======
      toast.error(error.response?.data?.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (name) => `
    w-full px-4 py-3 rounded-xl border text-sm font-medium text-gray-800
    bg-white/70 backdrop-blur-sm outline-none transition-all duration-200
    placeholder:text-gray-400 placeholder:font-normal
    ${focused === name
      ? "border-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
      : "border-gray-200 hover:border-gray-300"
    }
  `;

  return (
    <div
      className="min-h-screen flex items-center justify-center py-5 px-4"
      style={{
        background: "linear-gradient(135deg, #f8f9ff 0%, #eef0ff 40%, #f5f0ff 100%)",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      {/* Decorative blobs */}
      <div
        style={{
          position: "fixed", top: "-80px", right: "-80px", width: "320px", height: "320px",
          borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed", bottom: "-60px", left: "-60px", width: "260px", height: "260px",
          borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.14), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="w-full max-w-md"
        style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.9)",
          boxShadow: "0 8px 40px rgba(99,102,241,0.10), 0 1px 0 rgba(255,255,255,0.8) inset",
          padding: "40px 36px",
        }}
      >
        {/* Logo mark */}
        <div className="flex justify-center mb-5">
          <div
            style={{
              width: "48px", height: "48px", borderRadius: "14px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
              fontSize: "20px", fontWeight: 800, color: "#fff", letterSpacing: "-1px",
            }}
          >
            ELT
          </div>
        </div>

        <h2
          className="text-center mb-1"
          style={{ fontSize: "22px", fontWeight: 700, color: "#1e1b4b", letterSpacing: "-0.5px" }}
        >
          Create your account
        </h2>
        <p className="text-center text-sm text-gray-400 mb-7" style={{ fontWeight: 400 }}>
          Join EFT and get started today
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Username */}
          <div>
            <label className="block mb-1.5" style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onFocus={() => setFocused("username")}
              onBlur={() => setFocused("")}
              placeholder="e.g. john_doe"
              className={inputClass("username")}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1.5" style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused("")}
              placeholder="you@example.com"
              className={inputClass("email")}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1.5" style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused("")}
                placeholder="Min. 8 characters"
                className={inputClass("password") + " pr-11"}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors duration-150"
                tabIndex={-1}
              >
                {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
              </button>
>>>>>>> 589774a (Payment Page Added Successfully!)
            </div>

<<<<<<< HEAD
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
=======
          {/* Role & Gender in a row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1.5" style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
>>>>>>> 589774a (Payment Page Added Successfully!)
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
<<<<<<< HEAD
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300
          focus:ring-2 focus:ring-purple-500 outline-none transition-all"
=======
                onFocus={() => setFocused("role")}
                onBlur={() => setFocused("")}
                className={inputClass("role")}
                style={{ cursor: "pointer" }}
>>>>>>> 589774a (Payment Page Added Successfully!)
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
<<<<<<< HEAD

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
=======
            <div>
              <label className="block mb-1.5" style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
>>>>>>> 589774a (Payment Page Added Successfully!)
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
<<<<<<< HEAD
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300
          focus:ring-2 focus:ring-purple-500 outline-none transition-all"
=======
                onFocus={() => setFocused("gender")}
                onBlur={() => setFocused("")}
                className={inputClass("gender")}
                style={{ cursor: "pointer" }}
>>>>>>> 589774a (Payment Page Added Successfully!)
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
<<<<<<< HEAD

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
=======
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "6px",
              width: "100%",
              padding: "13px",
              borderRadius: "12px",
              background: loading
                ? "linear-gradient(135deg, #a5b4fc, #c4b5fd)"
                : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "15px",
              letterSpacing: "-0.2px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.45)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(99,102,241,0.35)"; }}
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Creating account…
              </>
            ) : "Create Account →"}
          </button>
        </form>

        <div
          className="flex items-center gap-3 my-5"
          style={{ color: "#d1d5db", fontSize: "12px", userSelect: "none" }}
        >
          <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
          <span style={{ color: "#9ca3af", fontSize: "12px" }}>Already have an account?</span>
          <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
        </div>

        <Link
          to="/login"
          className="block text-center w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{
            border: "1.5px solid #e0e7ff",
            color: "#6366f1",
            background: "rgba(238,240,255,0.5)",
            letterSpacing: "-0.1px",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.background = "#eef2ff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e0e7ff"; e.currentTarget.style.background = "rgba(238,240,255,0.5)"; }}
        >
          Log in instead
        </Link>
>>>>>>> 589774a (Payment Page Added Successfully!)
      </div>
    </div>
  );
}