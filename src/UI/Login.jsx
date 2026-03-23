import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import BASE_URL from "../utils/Config";
import { FaEye, FaEyeSlash } from "react-icons/fa";

<<<<<<< HEAD
function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
=======
export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");
>>>>>>> 589774a (Payment Page Added Successfully!)

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
      const res = await axios.post(`${BASE_URL}/user/login`, formData, {
        withCredentials: true,
      });
<<<<<<< HEAD

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

=======
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
>>>>>>> 589774a (Payment Page Added Successfully!)
        if (role === "admin") navigate("/admin");
        else if (role === "user" && !studentDet) navigate("/student-register");
        else navigate("/");
      } else {
        toast.error(res.data?.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
<<<<<<< HEAD
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
      {/* 🤍 Very Light Overlay (NOT BLUR) */}
      <div className="absolute inset-0 bg-white/10"></div>

      {/* 🔐 Login Card (Glass Effect) */}
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
=======
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
      className="min-h-screen flex items-center justify-center px-4"
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
          padding: "44px 36px",
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

        <h1
          className="text-center mb-1"
          style={{ fontSize: "22px", fontWeight: 700, color: "#1e1b4b", letterSpacing: "-0.5px" }}
        >
          Welcome back
        </h1>
        <p className="text-center text-sm text-gray-400 mb-8" style={{ fontWeight: 400 }}>
          Sign in to your EFT account
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Email */}
          <div>
            <label className="block mb-1.5" style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
              Email address
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused("")}
              className={inputClass("email")}
              required
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
                Password
              </label>
              <button
                type="button"
                style={{
                  fontSize: "12px", color: "#6366f1", fontWeight: 500,
                  background: "none", border: "none", cursor: "pointer", padding: 0,
                }}
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused("")}
                className={inputClass("password") + " pr-11"}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors duration-150"
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </button>
>>>>>>> 589774a (Payment Page Added Successfully!)
            </div>

<<<<<<< HEAD
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
            Don’t have an account?{" "}
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
=======
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "4px",
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
            onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.45)"; } }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(99,102,241,0.35)"; }}
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Signing in…
              </>
            ) : "Sign In →"}
          </button>
        </form>

        {/* Divider + Sign up link */}
        <div
          className="flex items-center gap-3 mt-6 mb-4"
          style={{ color: "#d1d5db", fontSize: "12px", userSelect: "none" }}
        >
          <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
          <span style={{ color: "#9ca3af", fontSize: "12px" }}>New to EFT?</span>
          <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
        </div>

        <Link
          to="/register"
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
          Create an account
        </Link>
      </div>
    </div>
  );
}
>>>>>>> 589774a (Payment Page Added Successfully!)
