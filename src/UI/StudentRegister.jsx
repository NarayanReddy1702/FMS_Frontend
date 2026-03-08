import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import BASE_URL from "../utils/Config";
import { useNavigate } from "react-router-dom";

export default function StudentRegister() {
  const navigate = useNavigate();
  const userDet = JSON.parse(localStorage.getItem("userDet"));

  const [formData, setFormData] = useState({
    firstName: userDet.username || "",
    lastName: "",
    fathersName: "",
    mothersName: "",
    phoneNo: "",
    course: "",
    year: "",
    email: userDet.email || "",
    gender: userDet.gender || "",
    dateOfBirth: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URL}/student/register`, formData, {
        withCredentials: true,
      });

      if (res.data?.success) {
        localStorage.setItem("studentToken", res.data?.token);
        localStorage.setItem("studentDet", JSON.stringify(res.data?.student));
        toast.success("Student registered successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          fathersName: "",
          mothersName: "",
          phoneNo: "",
          course: "",
          year: "",
          email: "",
          gender: "",
          dateOfBirth: "",
          address: "",
        });
        setTimeout(() => navigate("/"), 1000);
      } else {
        toast.error(res.data?.message || "Registration failed!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    /* 🌈 Animated Gradient Background */
    <div
      className="min-h-screen flex items-center justify-center p-6
      bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400
      animate-gradient"
    >
      {/* Card Wrapper */}
      <div className="relative w-full max-w-3xl">
        <div className="absolute inset-0 rounded-3xl bg-white/30 blur-2xl"></div>

        {/* Card */}
        <div
          className="relative bg-white/85 backdrop-blur-xl
          rounded-3xl p-8 shadow-2xl border border-white"
        >
          <h1
            className="text-3xl font-extrabold text-center mb-6
            text-transparent bg-clip-text
            bg-gradient-to-r from-indigo-600 to-purple-600"
          >
            Student Registration - CFMS
          </h1>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* First Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                disabled
                className="w-full bg-gray-200 border border-gray-300
                  rounded-xl px-4 py-2 outline-none"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl
                  px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>

            {/* Father's Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Father's Name
              </label>
              <input
                type="text"
                name="fathersName"
                value={formData.fathersName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl
                  px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>

            {/* Mother's Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Mother's Name
              </label>
              <input
                type="text"
                name="mothersName"
                value={formData.mothersName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl
                  px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Phone Number
              </label>
              <input
                type="number"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl
                  px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full bg-gray-200 border border-gray-300
                  rounded-xl px-4 py-2 outline-none"
              />
            </div>

            {/* Course */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Course
              </label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl
                  px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
              >
                <option value="">Select Course</option>
                <option>B.Tech</option>
                <option>MBA</option>
                <option>M.Tech</option>
                <option>Diploma</option>
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Year
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl
                  px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
              >
                <option value="">Select Year</option>
                <option>1st</option>
                <option>2nd</option>
                <option>3rd</option>
                <option>4th</option>
              </select>
            </div>

            {/* DOB */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl
                  px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                required
                className="w-full border border-gray-300 rounded-xl
                  px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none resize-none"
              />
            </div>

            {/* Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold text-white
                  bg-gradient-to-r from-indigo-600 to-purple-600
                  hover:scale-[1.03] hover:shadow-xl
                  active:scale-[0.97] transition-all"
              >
                Register Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
