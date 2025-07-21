import React from 'react';
import { useAuth } from '../../store/AuthContext';

const AuthButtons = () => {
  const { isLoggedIn, user, login, logout } = useAuth();

  return (
    <div className="mb-4">
      {isLoggedIn ? (
        <div className='flex gap-2.5'>
          <p>👋 Welcome, <strong>{user.name}</strong></p>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-3 rounded">Logout</button>
        </div>
      ) : (
        <button onClick={login} className="bg-green-500 text-white px-4 py-3 rounded">Login</button>
      )}
    </div>
  );
};

export default AuthButtons;
