import React from 'react'
import './Logout.css'
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../store/AuthContext';
import { useStudent } from '../../store/StudentContext';

const Logout = () => {
  const navigate = useNavigate();
  const { clearUser } = useAuth();
  const { clearStudent } = useStudent();

  const handleLogout = () =>{
  localStorage.clear();
  clearUser();
  clearStudent();
  navigate('/Login');
}

  return (
      <div className='relative min-h-[70vh] w-full flex flex-col items-center '>
        <div className='input-box absolute top-1/2 border-1 border-gray-400'>
        <h3>
           Are you sure you want to logout?
        </h3>
        <button className='logout-bt bg-red-600 text-white cursor-pointer p-3'
        onClick={handleLogout}>
                 Logout
        </button>
        </div>
      </div>
  )
}

export default Logout
