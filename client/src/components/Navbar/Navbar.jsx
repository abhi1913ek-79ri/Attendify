import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import {
  Check,
  CheckCheckIcon,
  Download,
  DownloadCloudIcon,
  DownloadIcon,
  Home,
  Settings,
  User,
  View,
} from "lucide-react";
import DateTimeComponent from "../DateTimeComponent/DateTimeComponent";

const Navbar = () => {
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Left - Hamburger (Mobile Only) */}
      <button
        className="hamburger"
        onClick={() => {
          setIsMenuOpen(!isMenuOpen);
          setIsAvatarOpen(false);
        }}
      >
        ☰
      </button>

      {/* Center - Logo */}
      <div className="logo">
        <NavLink to="/" className="navbar-logo hidden md:block">
          <img className="logo-image" src={assets.logo} alt="" />
        </NavLink>
        {/* <NavLink to='/' className="navbar-logo block md:hidden"><img className='logo-image' src={assets.logo} alt="" /></NavLink> */}
      </div>

      {/* Desktop Nav (hidden on mobile) */}
      <div className="navbar-links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex gap-2 ${isActive ? "nav-link active-link" : "nav-link"}`
          }
        >
          <Home />
          Home
        </NavLink>
        <NavLink
          to="/mark-attendance"
          className={({ isActive }) =>
            `flex gap-2 ${isActive ? "nav-link active-link" : "nav-link"}`
          }
        >
          <CheckCheckIcon /> Mark-Attendance
        </NavLink>
        <NavLink
          to="/view"
          className={({ isActive }) =>
            `flex gap-2 ${isActive ? "nav-link active-link" : "nav-link"}`
          }
        >
          <View /> View
        </NavLink>
        <NavLink
          to="/export"
          className={({ isActive }) =>
            `flex gap-2 ${isActive ? "nav-link active-link" : "nav-link"}`
          }
        >
          <DownloadCloudIcon /> Export
        </NavLink>
      </div>

      {/* Right - Avatar */}
      
      <div className="navbar-avatar">
        <img
          src={assets.avatar}
          alt="Avatar"
          onClick={() => {
            setIsAvatarOpen(!isAvatarOpen);
            setIsMenuOpen(false);
          }}
          className="avatar-img"
        />
        {isAvatarOpen && (
          <div className="avatar-dropdown">
            <div className="dropdown-arrow"></div>
            <NavLink to="/login" onClick={() => setIsAvatarOpen(false)}>
              Login
            </NavLink>
            <NavLink to="/register" onClick={() => setIsAvatarOpen(false)}>
              Register
            </NavLink>
            <NavLink to="/dashboard" onClick={() => setIsAvatarOpen(false)}>
              Dashboard
            </NavLink>
            <button className="logout-btn">Logout</button>
          </div>
        )}
      </div>

      {/* Mobile Menu (on hamburger toggle) */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <NavLink
            className="flex gap-2"
            to="/"
            onClick={() => setIsMenuOpen(false)}
          >
            <Home />
            Home
          </NavLink>
          <NavLink
            className="flex gap-2"
            to="/mark-attendance"
            onClick={() => setIsMenuOpen(false)}
          >
            <CheckCheckIcon /> Mark-Attendance
          </NavLink>
          <NavLink
            className="flex gap-2"
            to="/view"
            onClick={() => setIsMenuOpen(false)}
          >
            <View /> View
          </NavLink>
          <NavLink
            className="flex gap-2"
            to="/export"
            onClick={() => setIsMenuOpen(false)}
          >
            <DownloadCloudIcon /> Export
          </NavLink>
          <hr className="text-gray-300" />
          <NavLink
            className="flex gap-2"
            to="/students"
            onClick={() => setIsMenuOpen(false)}
          >
            <User />
            Students
          </NavLink>
          <NavLink
            className="flex gap-2"
            to="/settings"
            onClick={() => setIsMenuOpen(false)}
          >
            <Settings /> Settings
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;