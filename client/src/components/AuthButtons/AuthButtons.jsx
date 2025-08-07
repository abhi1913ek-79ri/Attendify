import React from 'react';
import { useAuth } from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthButtons = () => {
  const navigate = useNavigate();
  const { user} = useAuth();

  return (
    <div className="mb-4">
      {user ? (
        <div className='flex gap-2.5'>
          <p>👋 Welcome, <strong>{user.name}</strong></p>
          <button onClick={()=>navigate('/logout')} className="bg-red-500 text-white px-4 py-3 rounded cursor-pointer">Logout</button>
        </div>
      ) : (
        <button onClick={()=>navigate('/login')} className="bg-green-500 text-white px-4 py-3 rounded cursor-pointer">Login</button>
      )}
    </div>
  );
};

export default AuthButtons;
