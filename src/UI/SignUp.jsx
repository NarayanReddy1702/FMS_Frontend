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

    console.log(formData);
    
    try {
      const res = await axios.post(`${BASE_URL}/user/register`, formData, {
        withCredentials: true,
      });

      console.log(res.data);

      if (res.data?.success) {
        toast.success(res.data?.message);
        // navigate to login after signup
        setFormData({
          username: "",
          email: "",
          password: "",
          role: "user",
          gender: "",
        });
        navigate("/login");
      } else {
        toast.error(res.data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error.response?.data?.message || "Failed to register. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center px-5 min-h-screen bg-gradient-to-br  from-orange-100 to-white">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-500 mb-6">
          Welcome to CFMS
        </h2>

        <p className="text-gray-500 text-center mb-6">Create an new account</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Password with Eye Icon */}
          <div className="relative">
            <label className="block text-gray-700 font-semibold mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none pr-10"
              required
            />
            <div
              className="absolute right-3 top-9 cursor-pointer text-gray-600 hover:text-blue-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={22} />
              ) : (
                <AiOutlineEye size={22} />
              )}
            </div>
          </div>

          {/* Role Selector */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow-md transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
