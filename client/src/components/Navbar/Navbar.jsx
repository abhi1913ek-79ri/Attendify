import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import {
  CheckCheckIcon,
  DownloadCloudIcon,
  Home,
  Settings,
  User,
  View,
  Menu,
  X
} from "lucide-react";

const Navbar = () => {
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Navigation items for desktop
  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/mark-attendance", icon: CheckCheckIcon, label: "Mark-Attendance" },
    { to: "/view", icon: View, label: "View" },
    { to: "/export", icon: DownloadCloudIcon, label: "Export" },
  ];

  // Mobile menu items (includes additional items)
  const mobileNavItems = [
    ...navItems,
    { 
      to: "/logged-user-export", 
      icon: DownloadCloudIcon, 
      label: "Export Your Record" 
    },
    { divider: true },
    { to: "/students", icon: User, label: "Students" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  // Avatar dropdown items
  const avatarDropdownItems = [
    { to: "/login", label: "Login" },
    { to: "/register", label: "Register" },
    { to: "/user-profile", label: "Profile" },
  ];

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsAvatarOpen(false);
  };

  const handleAvatarToggle = () => {
    setIsAvatarOpen(!isAvatarOpen);
    setIsMenuOpen(false);
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsAvatarOpen(false);
  };

  const renderNavLink = ({ to, icon: Icon, label, className = "" }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex gap-2 ${className} ${
          isActive ? "nav-link active-link" : "nav-link"
        }`
      }
      onClick={closeMenus}
    >
      <Icon />
      {label}
    </NavLink>
  );

  return (
    <nav className="navbar">
      {/* Left - Hamburger (Mobile Only) */}
      <button className="hamburger" onClick={handleMenuToggle}>
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Center - Logo */}
      <div className="logo">
        <NavLink to="/" className="navbar-logo hidden md:block">
          <img className="logo-image" src={assets.logo} alt="Logo" />
        </NavLink>
        <NavLink to="/" className="navbar-logo block md:hidden">
          <img className="logo-image" src={assets.logo} alt="Logo" />
        </NavLink>
      </div>

      {/* Desktop Navigation Links */}
      <div className="navbar-links">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex gap-2 nav-link"
            style={({ isActive }) => ({
              borderBottom: isActive ? "2px solid #007bff" : "none",
              color: isActive ? "#007bff" : "#333",
              fontWeight: isActive ? "600" : "normal",
              background: "none",
              boxShadow: "none",
              outline: "none"
            })}
          >
            <item.icon />
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Right - Avatar */}
      <div className="navbar-avatar">
        <img
          src={assets.avatar}
          alt="Avatar"
          onClick={handleAvatarToggle}
          className="avatar-img"
        />
        {isAvatarOpen && (
          <div className="avatar-dropdown">
            <div className="dropdown-arrow"></div>
            {avatarDropdownItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsAvatarOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <button className="logout-btn">Logout</button>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          {mobileNavItems.map((item, index) => {
            if (item.divider) {
              return <hr key={`divider-${index}`} className="text-gray-300" />;
            }
            return (
              <NavLink
                key={item.to}
                className="flex gap-2"
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;