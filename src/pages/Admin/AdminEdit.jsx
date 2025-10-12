import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../../utils/Config";
import toast from "react-hot-toast";

const AdminEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userDet, setUserDet] = useState({});
  const loggedUser = JSON.parse(localStorage.getItem("userDet"));

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    gender: "",
  });

  // ✅ Fetch user details
  useEffect(() => {
    axios
      .get(`${BASE_URL}/user/getAUser/${id}`)
      .then((res) => {
        setUserDet(res.data.userDet);
        setFormData({
          username: res.data.userDet.username || "",
          email: res.data.userDet.email || "",
          role: res.data.userDet.role || "",
          gender: res.data.userDet.gender || "",
        });
      })
      .catch((error) => console.log(error));
  }, [id]);

  // ✅ Handle change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${BASE_URL}/user/updateAuth/${id}`,
        formData,
        { withCredentials: true }
      );

      if (res.data?.success) {
        toast.success(res.data?.message);

        // ✅ Update localStorage if admin updates their own profile
        if (id.toString() === loggedUser._id.toString()) {
          localStorage.setItem("userDet", JSON.stringify(res.data?.user));
        }

        navigate("/admin");
      }
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* 🔹 Top Navbar */}
      <div className="w-full bg-gray-200 flex flex-wrap items-center justify-between px-6 sm:px-10 py-3 shadow-md">
        <h2 onClick={()=>navigate("/admin")}  className="text-lg cursor-pointer sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
          Admin Panel
        </h2>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-gray-700 font-medium text-sm sm:text-base">
            {loggedUser?.username}
          </span>
          <img
            onClick={() => navigate("/admin/profile")}
            src={loggedUser?.profilePic || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full cursor-pointer object-cover border border-gray-400"
          />
        </div>
      </div>

      {/* 🔸 Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 w-full max-w-3xl">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Edit Admin Details
          </h3>

          {/* ✅ Form */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {/* Username */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none text-sm sm:text-base"
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
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none text-sm sm:text-base"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Role
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                disabled
                className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg px-4 py-2 text-sm sm:text-base"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none text-sm sm:text-base"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* ✅ Buttons */}
            <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-8">
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="px-5 sm:px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition text-sm sm:text-base"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminEdit;
