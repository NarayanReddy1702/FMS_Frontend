import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import BASE_URL from "../utils/Config";
import { useNavigate } from "react-router-dom";

export default function StudentRegister() {
  const navigate = useNavigate()
  const userDet = JSON.parse(localStorage.getItem("userDet"))
  const [formData, setFormData] = useState({
    firstName: userDet.username||"",
    lastName: "",
    fathersName: "",
    mothersName: "",
    phoneNo: "",
    course: "",
    year: "",
    email: userDet.email || "",
    gender:userDet.gender || "",
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
        localStorage.setItem("studentToken",res.data?.token)
        localStorage.setItem("studentDet",JSON.stringify(res.data?.student))
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
        setTimeout(()=>{
         navigate("/")
        },1000)
      } else {
        toast.error(res.data?.message || "Registration failed!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br  from-orange-50 to-white ">
      <div className="bg-white p-8  rounded-2xl shadow-lg w-full max-w-3xl border border-orange-200 m-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Student Registration - FMS
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              
              placeholder="Enter first name"
              className="w-full border bg-gray-200 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              required
              disabled
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Father's Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Father's Name</label>
            <input
              type="text"
              name="fathersName"
              value={formData.fathersName}
              onChange={handleChange}
              placeholder="Enter father's name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Mother's Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Mother's Name</label>
            <input
              type="text"
              name="mothersName"
              value={formData.mothersName}
              onChange={handleChange}
              placeholder="Enter mother's name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
            <input
              type="number"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Enter email"
              className="w-full border border-gray-300 bg-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              required
              disabled
            />
          </div>

          {/* Course */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Course</label>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            >
              <option value="">Select Course</option>
              <option value="B.Tech">B.Tech</option>
              <option value="MBA">MBA</option>
              <option value="M.Tech">M.Tech</option>
              <option value="Diploma">Diploma</option>
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Year</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            >
              <option value="">Select Year</option>
              <option value="1st">1st</option>
              <option value="2nd">2nd</option>
              <option value="3rd">3rd</option>
              <option value="4th">4th</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              className="w-full border bg-gray-200 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              required
              gender
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Address (Full Width) */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter full address"
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none resize-none"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow-md transition duration-300"
            >
              Register Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
