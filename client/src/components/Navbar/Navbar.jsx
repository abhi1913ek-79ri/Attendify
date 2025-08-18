import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import {
  CheckCheckIcon,
  DownloadCloudIcon,
  Home,
  Settings,
  User,
  UserPlus,
  View,
  School,
  Menu,
  X,
  LogIn,
  UserCheck,
  ArrowBigDownDash,
  LogOut
} from "lucide-react";
import { useAuth } from "../../store/AuthContext";

const Navbar = () => {
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, clearUser } = useAuth();

  // Desktop nav items
  const authNavItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/mark-attendance", icon: CheckCheckIcon, label: "Mark-Attendance" },
    // { to: "/view", icon: View, label: "View" },
    // { to: "/export", icon: DownloadCloudIcon, label: "Export" },
  ];

  const guestNavItems = [
    { to: "/", icon: Home, label: "Home" },
    // { to: "/view", icon: View, label: "View" },
  ];

  const navItems = user ? authNavItems : guestNavItems;

  // Mobile menu items
  const authMobileNavItems = [
    ...authNavItems,
    // { to: "/logged-user-export", icon: DownloadCloudIcon, label: "Export Your Record" },
    { divider: true },
    { to: "/user-profile", icon: UserCheck, label: "Profile" },
    { to: "/students", icon: School, label: "Students" },
    { to: "/logged-user-export", icon: ArrowBigDownDash, label: "Export Your Record" },
    { to: "/settings", icon: Settings, label: "Settings" },
    { to: "/logout", icon: LogOut, label: "Logout" },
  ];

  const guestMobileNavItems = [
    ...guestNavItems,
    { divider: true },
    { to: "/students", icon: School, label: "students" },
    { to: "/login", icon: LogIn, label: "Login" },
    { to: "/register", icon: UserPlus, label: "Register" },
  ];

  const mobileNavItems = user ? authMobileNavItems : guestMobileNavItems;

  // Avatar dropdown items
  const avatarDropdownItems = user
    ? [
        { to: "/user-profile", label: "Profile" },
        { to: "/settings", label: "Settings" },
        { label: "Logout", action: "logout" },
      ]
    : [
        { to: "/login", label: "Login" },
        { to: "/register", label: "Register" },
      ];

  const handleLogout = () => {
    clearUser?.();
    setIsAvatarOpen(false);
    setIsMenuOpen(false);
    navigate("/login");
  };
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
            {item.icon ? <item.icon /> : null}
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
            {avatarDropdownItems.map((item, idx) => {
              if (item.action === "logout") {
                return (
                  <button key={`action-${idx}`} className="logout-btn" onClick={handleLogout}>
                    {item.label}
                  </button>
                );
              }
              return (
                <NavLink
                  key={item.to || idx}
                  to={item.to}
                  onClick={() => setIsAvatarOpen(false)}
                >
                  {item.label}
                </NavLink>
              );
            })}
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
        {item.icon ? <item.icon /> : null}
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