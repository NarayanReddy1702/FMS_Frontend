import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../../utils/Config";

function UpdateUser() {
  const navigate = useNavigate();
 const {id} = useParams()
 console.log(id);
 const studentDet = JSON.parse(localStorage.getItem("studentDet"))
  const [formData, setFormData] = useState({
    firstName: studentDet.firstName||"",
    lastName: studentDet.lastName||"",
    fathersName: studentDet.fathersName||"",
    mothersName: studentDet.mothersName||"",
    phoneNo: studentDet.phoneNo||"",
    course: studentDet.course||"",
    year: studentDet.year||"",
    email: studentDet.email||"",
    gender: studentDet.gender||"",
    dateOfBirth: studentDet.dateOfBirth||"",
    address: studentDet.address||"",
  });



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${BASE_URL}/student/update-student/${id}`, formData);
      if (res.data?.success) {
        toast.success("Profile updated successfully");
        localStorage.setItem("studentDet",JSON.stringify(res?.data?.student))
        setTimeout(()=>{
            navigate("/profile");
        },2000) // redirect to profile or home page
      } else {
        toast.error(res.data?.message || "Update failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Update Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* First Name */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          {/* Father's Name */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Father's Name
            </label>
            <input
              type="text"
              name="fathersName"
              value={formData.fathersName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          {/* Mother's Name */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Mother's Name
            </label>
            <input
              type="text"
              name="mothersName"
              value={formData.mothersName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          {/* Course */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Course
            </label>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
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
            <label className="block text-gray-700 mb-1 font-medium">Year</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            >
              <option value="">Select Year</option>
              <option value="1st">1st</option>
              <option value="2nd">2nd</option>
              <option value="3rd">3rd</option>
              <option value="4th">4th</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1 font-medium">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none resize-none"
            />
          </div>
        </form>

        {/* Submit Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleSubmit}
            className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateUser;
