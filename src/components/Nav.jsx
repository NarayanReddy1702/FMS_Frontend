import React, { useState } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Nav() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const role = localStorage.getItem("role");
  const userToken = localStorage.getItem("userToken");
  const studentToken = localStorage.getItem("studentToken");
  const studentDet = JSON.parse(localStorage.getItem("studentDet"));
  const userDet = JSON.parse(localStorage.getItem("userDet"));

  // 🟢 Logout for Normal User
  function handleLogout() {
    localStorage.removeItem("userToken");
    localStorage.removeItem("role");
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentDet");
    localStorage.removeItem("userDet")
    toast.success("Logout Successfully!");
    setTimeout(() => navigate("/login"), 1500);
  }

  // 🔴 Logout for Admin
  function handleLogoutAdmin() {
    localStorage.removeItem("userToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userDet");
    toast.success("Admin Logged Out!");
    setTimeout(() => navigate("/login"), 1500);
  }

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center relative">
      {/* 🔷 Logo */}
      <div
        onClick={() => navigate("/")}
        className="text-2xl font-bold text-blue-600 cursor-pointer select-none"
      >
       <img  className="object-cover w-30" src="./fms_logo.jpg" alt="" />
      </div>

      {/* 🔹 Hamburger Menu (Visible on Mobile) */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="text-2xl cursor-pointer text-gray-700 md:hidden focus:outline-none"
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* 🔸 Desktop Menu */}
      <div className="hidden md:flex space-x-4 items-center">
        {/* Not Logged In */}
        {!userToken || !role ? (
          <>
            <NavLink to="/login">
              <button className="px-4 py-2 cursor-pointer border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition duration-200">
                Login
              </button>
            </NavLink>

            <NavLink to="/register">
              <button className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                Signup
              </button>
            </NavLink>
          </>
        ) : role === "admin" ? (
          // 🔴 Admin Section
          <>
            <button
              onClick={handleLogoutAdmin}
              className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
            >
              Logout
            </button>

            <div
              onClick={() => navigate("/admin/profile")}
              className="w-12 h-12 cursor-pointer rounded-full bg-gray-200 overflow-hidden border-2 border-gray-400"
            >
              <img
                className="w-full h-full object-cover"
                src={userDet?.profilePic || "https://via.placeholder.com/150"}
                alt="Admin Profile"
              />
            </div>

            <button
              onClick={() => navigate("/admin")}
              className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Admin
            </button>
          </>
        ) : (
          // 🟢 User Section
          <>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 cursor-pointer text-white rounded-lg hover:bg-red-700 transition duration-200"
            >
              Logout
            </button>

            <div
              onClick={() => navigate("/profile")}
              className="w-12 h-12 cursor-pointer  rounded-full bg-gray-200 overflow-hidden border-2 border-gray-400"
            >
              <img
                className="w-full h-full object-cover"
                src={studentDet?.profilePic || "https://via.placeholder.com/150"}
                alt="User Profile"
              />
            </div>
          </>
        )}
      </div>

      {/* 🔸 Mobile Menu (Dropdown) */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg flex flex-col items-center py-4 space-y-4 md:hidden z-50 border-t">
          {/* Not Logged In */}
          {!userToken || !role ? (
            <>
              <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                <button className="px-4 py-2 border cursor-pointer border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition duration-200 w-40">
                  Login
                </button>
              </NavLink>

              <NavLink to="/register" onClick={() => setMenuOpen(false)}>
                <button className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 transition duration-200 w-40">
                  Signup
                </button>
              </NavLink>
            </>
          ) : role === "admin" ? (
            <>
              <button
                onClick={() => {
                  handleLogoutAdmin();
                  setMenuOpen(false);
                }}
                className="px-4 py-2 bg-red-600 cursor-pointer text-white rounded-lg hover:bg-red-700 transition duration-200 w-40"
              >
                Logout
              </button>

              <div
                onClick={() => {
                  navigate("/admin/profile");
                  setMenuOpen(false);
                }}
                className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-400 cursor-pointer"
              >
                <img
                  className="w-full h-full object-cover"
                  src={userDet?.profilePic || "https://via.placeholder.com/150"}
                  alt="Admin Profile"
                />
              </div>

              <button
                onClick={() => {
                  navigate("/admin");
                  setMenuOpen(false);
                }}
                className="px-4 py-2 bg-blue-600  text-white rounded-lg hover:bg-blue-700 transition duration-200 w-40"
              >
                Admin Panel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 w-40"
              >
                Logout
              </button>

              <div
                onClick={() => {
                  navigate("/profile");
                  setMenuOpen(false);
                }}
                className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-400 cursor-pointer"
              >
                <img
                  className="w-full h-full object-cover"
                  src={studentDet?.profilePic || "https://via.placeholder.com/150"}
                  alt="User Profile"
                />
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
