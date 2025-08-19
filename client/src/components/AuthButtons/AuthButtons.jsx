import React from 'react';
import { useAuth } from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthButtons = () => {
  const navigate = useNavigate();
  const { user} = useAuth();

  return (
    <div className="mb-4">
      {user &&
        <div className='flex gap-2.5'>
          <p>👋 Welcome, <strong>{user.name}</strong></p>
        </div>
     }
    </div>
  );
};

export default AuthButtons;
