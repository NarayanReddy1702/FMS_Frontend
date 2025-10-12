import React, { useState } from "react";
import {
  FaBars,
  FaHome,
  FaUsers,
  FaChartPie,
  FaSignOutAlt,
} from "react-icons/fa";
import { GrUserAdmin } from "react-icons/gr";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HomeAdmin from "./HomeAdmin";
import UserAdmin from "./UserAdmin";
import StudentAdmin from "./StudentAdmin";
import AdminProfile from "./AdminProfile";
import toast from "react-hot-toast";

function AdminDashboard() {
  const userDet = JSON.parse(localStorage.getItem("userDet"));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("userDet");
    localStorage.removeItem("userToken");
    localStorage.removeItem("role");
    toast.success("Admin Logout Successfully!");
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar (Responsive) */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 text-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          {/* Close button (Mobile) */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="mt-6 px-3 space-y-3">
          <Link
            to="/admin"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 py-2 px-4 rounded-lg ${
              location.pathname === "/admin" ? "bg-gray-700" : "hover:bg-gray-700"
            } transition`}
          >
            <FaHome /> <span>Home</span>
          </Link>

          <Link
            to="/admin/users"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 py-2 px-4 rounded-lg ${
              location.pathname === "/admin/users" ? "bg-gray-700" : "hover:bg-gray-700"
            } transition`}
          >
            <FaUsers /> <span>Users</span>
          </Link>

          <Link
            to="/admin/students"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 py-2 px-4 rounded-lg ${
              location.pathname === "/admin/students"
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            } transition`}
          >
            <FaChartPie /> <span>Students</span>
          </Link>

          <Link
            to="/admin/profile"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 py-2 px-4 rounded-lg ${
              location.pathname === "/admin/profile" ? "bg-gray-700" : "hover:bg-gray-700"
            } transition`}
          >
            <GrUserAdmin /> <span>Admin Profile</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-3 py-2 px-4 mt-8 rounded-lg hover:bg-red-600 bg-red-500 transition w-full text-left"
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Top Navbar */}
        <div className="flex items-center justify-between bg-gray-200 shadow-md px-4 py-3 md:px-6">
          {/* Sidebar Toggle Button (Mobile) */}
          <button
            className="text-gray-600 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars size={24} />
          </button>

          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            Dashboard
          </h2>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-gray-700 font-medium">
              {userDet?.username}
            </span>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-gray-400">
              <img
                onClick={() => navigate("/admin/profile")}
                src={userDet?.profilePic || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-full h-full object-cover cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100">
          {location.pathname === "/admin" ? (
            <HomeAdmin />
          ) : location.pathname === "/admin/users" ? (
            <UserAdmin />
          ) : location.pathname === "/admin/students" ? (
            <StudentAdmin />
          ) : location.pathname === "/admin/profile" ? (
            <AdminProfile />
          ) : (
            <div className="text-center text-gray-500 py-10 text-lg font-medium">
              Page Not Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
