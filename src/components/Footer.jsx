import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300  px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
        {/* 🟠 Left Section - Logo */}
        <div className="text-3xl font-extrabold text-orange-500 tracking-wide">
          <img className="w-40 object-cover" src="./rm_fms.png" alt="" />
        </div>

       

        {/* 🟣 Right Section - Social Icons */}
        <div className="flex justify-center sm:justify-end space-x-5 text-xl">
          <a href="#" className="hover:text-orange-400 transition duration-200"><FaFacebook /></a>
          <a href="#" className="hover:text-orange-400 transition duration-200"><FaInstagram /></a>
          <a href="#" className="hover:text-orange-400 transition duration-200"><FaTwitter /></a>
          <a href="#" className="hover:text-orange-400 transition duration-200"><FaLinkedin /></a>
        </div>
      </div>

      {/* 🔻 Bottom Section */}
      <div className="text-center text-sm text-gray-500  border-t border-gray-700 py-4">
        © {new Date().getFullYear()} <span className="text-orange-400 font-semibold">Created by Swastika Team </span>
      </div>
    </footer>
  );
}
