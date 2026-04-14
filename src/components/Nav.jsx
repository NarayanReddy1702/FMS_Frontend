import React, { useState } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

function AvatarFallback({ name, size = "sm" }) {
  const letter = name?.charAt(0)?.toUpperCase() || "U";
  const sizeStyles =
    size === "sm"
      ? { width: "44px", height: "44px", fontSize: "17px" }
      : { width: "80px", height: "80px", fontSize: "30px" };

  return (
    <div
      style={{
        ...sizeStyles,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #7c3aed, #a855f7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: "600",
        border: "2px solid rgba(255,255,255,0.8)",
        boxShadow: "0 2px 8px rgba(124,58,237,0.4)",
        flexShrink: 0,
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {letter}
    </div>
  );
}

// ✅ Fixed ProfileAvatar with imgError fallback
function ProfileAvatar({ det, navigateTo, size = "sm" }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const dimension = size === "sm" ? "44px" : "80px";

  return (
    <div
      onClick={() => navigate(navigateTo)}
      className="hover:scale-110 transition"
      style={{ cursor: "pointer" }}
    >
      {det?.profilePic && !imgError ? (
        <div
          style={{
            width: dimension,
            height: dimension,
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid rgba(255,255,255,0.8)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          <img
            className="w-full h-full object-cover"
            src={det.profilePic}
            alt="Profile"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <AvatarFallback
          name={det?.firstName || det?.username || det?.name || "U"}
          size={size}
        />
      )}
    </div>
  );
}

export default function Nav() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const role = localStorage.getItem("role");
  const userToken = localStorage.getItem("userToken");
  const studentDet = JSON.parse(localStorage.getItem("studentDet"));
  const userDet = JSON.parse(localStorage.getItem("userDet"));

  // ✅ Normal user logout
  function handleLogout() {
    localStorage.removeItem("userToken");
    localStorage.removeItem("role");
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentDet");
    localStorage.removeItem("userDet");
    toast.success("Logout Successfully!");
    setTimeout(() => navigate("/login"), 1500);
  }

  // ✅ Admin logout
  function handleLogoutAdmin() {
    localStorage.removeItem("userToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userDet");
    toast.success("Admin Logged Out!");
    setTimeout(() => navigate("/login"), 1500);
  }

  return (
    <nav className="sticky top-0 z-50 bg-blue-900 shadow-2xl">
      <div className="px-6 py-3 flex justify-between items-center relative">

        {/* Logo */}
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

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl text-white"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Menu */}
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
              {/* ✅ Admin uses userDet */}
              <ProfileAvatar det={userDet} navigateTo="/admin/profile" size="sm" />
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
              {/* ✅ Student uses studentDet */}
              <ProfileAvatar det={studentDet} navigateTo="/profile" size="sm" />
            </>
          )}
        </div>

        {/* Mobile Menu */}
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
                    onClick={() => { handleLogoutAdmin(); setMenuOpen(false); }}
                    className="w-48 py-2 rounded-full bg-rose-500 text-white shadow"
                  >
                    Logout
                  </button>

                  {/* ✅ Admin mobile avatar — uses ProfileAvatar with imgError fix */}
                  <div onClick={() => { navigate("/admin/profile"); setMenuOpen(false); }}>
                    <ProfileAvatar det={userDet} navigateTo="/admin/profile" size="lg" />
                  </div>

                  {/* ✅ Admin name — uses correct fields */}
                  {(userDet?.firstName || userDet?.username || userDet?.name) && (
                    <p className="text-sm font-semibold text-purple-800 -mt-1">
                      {userDet?.firstName || userDet?.username || userDet?.name}
                    </p>
                  )}

                  <button
                    onClick={() => { navigate("/admin"); setMenuOpen(false); }}
                    className="w-48 py-2 rounded-full bg-indigo-600 text-white shadow"
                  >
                    Admin Panel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="w-48 py-2 rounded-full bg-rose-500 text-white shadow"
                  >
                    Logout
                  </button>

                  {/* ✅ Student mobile avatar — uses ProfileAvatar with imgError fix */}
                  <div onClick={() => { navigate("/profile"); setMenuOpen(false); }}>
                    <ProfileAvatar det={studentDet} navigateTo="/profile" size="lg" />
                  </div>

                  {/* ✅ Student name — uses correct fields */}
                  {(studentDet?.firstName || studentDet?.username || studentDet?.name) && (
                    <p className="text-sm font-semibold text-purple-800 -mt-1">
                      {studentDet?.firstName || studentDet?.username || studentDet?.name}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}