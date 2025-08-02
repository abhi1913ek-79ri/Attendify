import React from 'react'
import './Sidebar.css'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, User, Settings, LogOut, Users, UserCheck, School } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className='sidebar'>
      <ul className="sidebar-links">
        <Link
          className={currentPath === '/user-profile' ? 'active-sidebar': ""}
          to='/user-profile'>
          <UserCheck /> Profile
        </Link>

        <Link
          className={currentPath === '/students' ? 'active-sidebar': ""}
          to='/students'>
          <School /> Students
        </Link>

        <Link
          className={currentPath === '/logged-user-export' ? 'active-sidebar': ""}
          to='/logged-user-export'>
          <School /> Export Your Record
        </Link>

        <Link
          className={currentPath === '/settings' ? 'active-sidebar': ""}
          to='/settings'>
          <Settings /> Settings
        </Link>

        <Link
          className={currentPath === '/logout' ? 'active-sidebar': ""}
          to='/logout'>
          <LogOut /> Logout
        </Link>
      </ul>
    </div>
  )
}

export default Sidebar;
