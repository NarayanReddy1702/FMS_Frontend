import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../utils/Config";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

const StudentAdmin = () => {
  const [studentDet, setStudentDet] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/student/all-student`, { withCredentials: true })
      .then((res) => setStudentDet(res?.data?.student))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    try {
          const isConfirmed = window.confirm(`Do you want to delete this student with ID: ${id}?`);
          if(isConfirmed){
            const res = await axios.delete(`${BASE_URL}/student/delete-student/${id}`, {
        withCredentials: true,
      });
      if (res.data?.success) {
        toast.success(res.data?.message);
        setStudentDet((prev) => prev.filter((student) => student._id !== id));
      }
       }
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  return studentDet.length > 0 ? (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen  ">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        {/* 🔹 Header */}
        <h2 className="text-2xl font-bold text-center text-gray-800 py-5 bg-gray-100 border-b">
          🎓 Student Management Panel
        </h2>

        {/* 🔹 Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm sm:text-base text-gray-700">
            <thead className="bg-gray-200 text-gray-700 uppercase text-xs sm:text-sm tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left">SI No</th>
                <th className="px-6 py-3 text-left">Full Name</th>
                <th className="px-6 py-3 text-left">Father’s Name</th>
                <th className="px-6 py-3 text-left hidden md:table-cell">Mother’s Name</th>
                <th className="px-6 py-3 text-left hidden lg:table-cell">Phone No</th>
                <th className="px-6 py-3 text-left">Course</th>
                <th className="px-6 py-3 text-left">Year</th>
                <th className="px-6 py-3 text-left hidden md:table-cell">Email</th>
                <th className="px-6 py-3 text-left hidden lg:table-cell">Course Fee</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {studentDet.map((student, index) => (
                <tr
                  key={student._id}
                  className="border-b last:border-none hover:bg-orange-50 transition-all duration-200"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{index + 1}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {student.firstName} {student.lastName}
                  </td>
                  <td className="px-6 py-4">{student.fathersName}</td>
                  <td className="px-6 py-4 hidden md:table-cell">{student.mothersName}</td>
                  <td className="px-6 py-4 hidden lg:table-cell">{student.phoneNo}</td>
                  <td className="px-6 py-4">{student.course}</td>

                  {/* 🎨 Year Badge */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        student.year === "1st"
                          ? "bg-green-100 text-green-800"
                          : student.year === "2nd"
                          ? "bg-blue-100 text-blue-800"
                          : student.year === "3rd"
                          ? "bg-yellow-100 text-yellow-800"
                          : student.year === "4th"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {student.year}
                    </span>
                  </td>

                  <td className="px-6 py-4 hidden md:table-cell">{student.email}</td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    ₹{student.courseFee?.toLocaleString() || "-"}
                  </td>
                  

                  {/* ⚙️ Actions */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => navigate(`/admin/adminEdit/${student._id}`)}
                        className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-md bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-all shadow-sm"
                      >
                        <FaEdit />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-all shadow-sm"
                      >
                        <FaTrash />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 📱 Scroll hint */}
        <p className="text-center text-gray-500 text-xs sm:hidden py-2">
          Swipe → to see more columns
        </p>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center py-10">
      <h1 className="text-gray-600 text-lg font-medium">No student data found!</h1>
    </div>
  );
};

export default StudentAdmin;
