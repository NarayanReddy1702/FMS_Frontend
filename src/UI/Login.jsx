import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import BASE_URL from "../utils/Config";
import { FaEye, FaEyeSlash } from "react-icons/fa";


 function Login() {
 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword,setShowPassword]=useState(false)

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

      // Save tokens and role
      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("role", res.data?.user?.role);
      localStorage.setItem("userDet", JSON.stringify(res.data?.user));

      if (res.data.student) {
        localStorage.setItem("studentDet", JSON.stringify(res.data.student));
      }

      const role = res.data.user.role;
      const studentDet = res.data.student;

      // ✅ Navigation logic
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "user" && !studentDet) {
        navigate("/student-register");
      } else if (role === "user" && studentDet) {
        navigate("/");
      } else {
        navigate("/");
      }
    } else {
      toast.error(res.data?.message || "Invalid credentials");
    }
  } catch (error) {
    console.error("Login error:", error);
    toast.error(error.response?.data?.message || "Login failed");
  }
};

  return (
     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br  px-5 from-orange-100 to-white">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-orange-200">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
          Welcome  to CFMS
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Login to access your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Password Field with Eye Icon */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-blue-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 cursor-pointer hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login