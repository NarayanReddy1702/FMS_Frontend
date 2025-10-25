import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import BASE_URL from "../../utils/Config";

const UpdateAdmin = () => {
  const loggedUser = JSON.parse(localStorage.getItem("userDet"));
  const { id } = useParams();
  const navigate = useNavigate();

  const [studentDet, setStudentDet] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fathersName: "",
    mothersName: "",
    phoneNo: "",
    course: "",
    courseFee: "",
    year: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch student data
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/student/get-one-student/${id}`, { withCredentials: true })
      .then((res) => {
        if (res.data?.success) {
          setStudentDet(res.data.student);
        } else {
          toast.error("Failed to fetch student data");
        }
      })
      .catch(() => toast.error("Error fetching student data"))
      .finally(() => setLoading(false));
  }, [id]);

  // Update formData when studentDet changes
  useEffect(() => {
    if (studentDet && Object.keys(studentDet).length > 0) {
      setFormData({
        firstName: studentDet.firstName || "",
        lastName: studentDet.lastName || "",
        fathersName: studentDet.fathersName || "",
        mothersName: studentDet.mothersName || "",
        phoneNo: studentDet.phoneNo || "",
        course: studentDet.course || "",
        courseFee: studentDet.courseFee || "",
        year: studentDet.year || "",
        email: studentDet.email || "",
        gender: studentDet.gender || "",
        dateOfBirth: studentDet.dateOfBirth || "",
        address: studentDet.address || "",
      });
    }
  }, [studentDet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${BASE_URL}/student/update-admin/${id}`,
        formData,
        { withCredentials: true }
      );
      if (res.data?.success) {
        console.log(res.data.student.courseFee);
        console.log(!res.data.student.courseFee);
        
        toast.success(res.data.message || "Student updated successfully");
        navigate("/admin/students");
      } else {
        toast.error(res.data.message || "Failed to update student");
      }
    } catch {
      toast.error("Server error");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h1 className="text-xl font-semibold">Loading...</h1>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Admin Header */}
      <div className="w-full h-16 bg-gray-200 flex items-center justify-between px-10 shadow-md">
        <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">{loggedUser?.username}</span>
          <img
            onClick={() => navigate("/admin/profile")}
            src={loggedUser?.profilePic || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-10 h-10 rounded-full cursor-pointer object-cover border border-gray-400"
          />
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl my-5">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Update Student
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">First Name*</label>
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
            <label className="block text-gray-700 mb-1 font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          {/* Father's Name */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Father's Name</label>
            <input
              type="text"
              name="fathersName"
              value={formData.fathersName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          {/* Mother's Name */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Mother's Name*</label>
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
            <label className="block text-gray-700 mb-1 font-medium">Phone Number*</label>
            <input
              type="tel"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Email*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          {/* Course */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Course*</label>
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
            <label className="block text-gray-700 mb-1 font-medium">Year*</label>
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

          {/* Gender */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Gender*</label>
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
            <label className="block text-gray-700 mb-1 font-medium">Date of Birth*</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          {/* Course Fee */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Course Fee</label>
            <input
              type="number"
              name="courseFee"
              value={formData.courseFee}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1 font-medium">Address*</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 mt-4 text-center">
            <button
              type="submit"
              className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              Update Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAdmin;
