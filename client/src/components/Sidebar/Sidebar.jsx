import React from 'react'
import './Sidebar.css'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, User, Settings, LogOut, Users, UserCheck, School, ArrowBigDownDash, LogIn, UserPlus } from "lucide-react";
import {useAuth} from '../../store/AuthContext'

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAuth();

  return (
    <div className='sidebar'>
      <ul className="sidebar-links">
        {user && (
          <>
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
              <ArrowBigDownDash /> Export Your Record
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
          </>
        )}
        {!user && (
          <> 
          <Link
              className={currentPath === '/students' ? 'active-sidebar': ""}
              to='/students'>
              <School /> Students
            </Link>
            <Link
              className={currentPath === '/login' ? 'active-sidebar': ""}
              to='/login'>
              <LogIn /> Login
            </Link>

            <Link
              className={currentPath === '/register' ? 'active-sidebar': ""}
              to='/register'>
              <UserPlus /> Register
            </Link>
          </>
        )}
      </ul>
    </div>
  )
}

export default Sidebar;
