import React from 'react';
import './Logout.css';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../store/AuthContext';
import { useStudent } from '../../store/StudentContext';

const Logout = () => {
  const navigate = useNavigate();
  const { clearUser } = useAuth();
  const { clearStudent } = useStudent();

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    clearStudent();
    navigate('/Login');
  };

  return (
    <div className="logout-container">
      <div className="logout-card">
        <h2>Logout Confirmation</h2>
        <p>Are you sure you want to log out? You will need to log in again to access your account.</p>
        <div className="button-group">
          <button className="logout-btn" onClick={handleLogout}>Yes, Logout</button>
          <button className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
