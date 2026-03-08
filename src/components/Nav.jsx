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
    localStorage.removeItem("userDet");
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
    <nav className="sticky top-0 z-50 bg-purple-900 shadow-2xl">
      <div className="px-6 py-3 flex justify-between items-center relative">
        {/* 🔷 Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <img
            src="./fms_logo.png"
            alt="logo"
            className="w-14 h-14 rounded-full bg-white p-1 shadow-lg"
          />
          <span className="hidden sm:block text-xl font-bold text-white tracking-wide">
            CFMS Portal
          </span>
        </div>

        {/* 🍔 Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl text-white"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* 🖥 Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {!userToken || !role ? (
            <>
              <NavLink to="/login">
                <button className="px-5 py-2 rounded-full bg-white/20 backdrop-blur text-white border border-white/30 hover:bg-white hover:text-purple-700 transition font-medium shadow">
                  Login
                </button>
              </NavLink>

              <NavLink to="/register">
                <button className="px-5 py-2 rounded-full bg-white text-purple-700 font-semibold shadow-lg hover:scale-105 transition">
                  Signup
                </button>
              </NavLink>
            </>
          ) : role === "admin" ? (
            <>
              <button
                onClick={handleLogoutAdmin}
                className="px-4 py-2 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition shadow-lg"
              >
                Logout
              </button>

              <div
                onClick={() => navigate("/admin/profile")}
                className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition"
              >
                <img
                  className="w-full h-full object-cover"
                  src={userDet?.profilePic || "https://via.placeholder.com/150"}
                  alt="Admin"
                />
              </div>

              <button
                onClick={() => navigate("/admin")}
                className="px-4 py-2 rounded-full bg-black/20 text-white backdrop-blur hover:bg-black/40 transition shadow"
              >
                Admin
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition shadow-lg"
              >
                Logout
              </button>

              <div
                onClick={() => navigate("/profile")}
                className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition"
              >
                <img
                  className="w-full h-full object-cover"
                  src={
                    studentDet?.profilePic || "https://via.placeholder.com/150"
                  }
                  alt="User"
                />
              </div>
            </>
          )}
        </div>

        {/* 📱 Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white rounded-b-3xl shadow-2xl py-6 md:hidden">
            <div className="flex flex-col items-center gap-4">
              {!userToken || !role ? (
                <>
                  <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                    <button className="w-48 py-2 rounded-full bg-purple-600 text-white font-medium shadow">
                      Login
                    </button>
                  </NavLink>

                  <NavLink to="/register" onClick={() => setMenuOpen(false)}>
                    <button className="w-48 py-2 rounded-full border border-purple-600 text-purple-600 font-medium">
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
                    className="w-48 py-2 rounded-full bg-rose-500 text-white shadow"
                  >
                    Logout
                  </button>

                  <div
                    onClick={() => {
                      navigate("/admin/profile");
                      setMenuOpen(false);
                    }}
                    className="w-20 h-20 rounded-full overflow-hidden border-2 border-purple-600 shadow-lg"
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={
                        userDet?.profilePic || "https://via.placeholder.com/150"
                      }
                      alt="Admin"
                    />
                  </div>

                  <button
                    onClick={() => {
                      navigate("/admin");
                      setMenuOpen(false);
                    }}
                    className="w-48 py-2 rounded-full bg-indigo-600 text-white shadow"
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
                    className="w-48 py-2 rounded-full bg-rose-500 text-white shadow"
                  >
                    Logout
                  </button>

                  <div
                    onClick={() => {
                      navigate("/profile");
                      setMenuOpen(false);
                    }}
                    className="w-20 h-20 rounded-full overflow-hidden border-2 border-purple-600 shadow-lg"
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={
                        studentDet?.profilePic ||
                        "https://via.placeholder.com/150"
                      }
                      alt="User"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
