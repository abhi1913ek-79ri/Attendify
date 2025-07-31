import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AccessibilityIcon, Ban, LockKeyhole, LogIn, UserPlus } from 'lucide-react';
import './AuthPrompt.css';
import { assets } from '../../assets/assets';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const AuthPrompt = ({message,purpose}) => {
  const navigate = useNavigate();

  return (
    <div className="auth-prompt-container">
      <div className="w-4/12">
        <LazyLoadImage
          src={assets.ilustrations.login_illustration}
          alt="Please login"
          className="auth-illustration"
          effect="blur"
        />
      </div>
      <h2 className="text-2xl flex gap-2.5 justify-center items-center py-3 text-red-500 font-semibold mt-4"><span>{message}</span><Ban /></h2>
      <p className="text-gray-600 mt-2">Please login or register to {purpose}.</p>
      <div className="login_signup flex gap-2.5">
        <button
          className="login-btn flex items-center gap-2"
          onClick={() => navigate('/login')}
        >
          <LogIn size={18} />
          Login
        </button>
        <button
          className="login-btn flex items-center gap-2"
          onClick={() => navigate('/register')}
        >
          <UserPlus size={18} />
          Register
        </button>
      </div>
    </div>
  );
};

export default AuthPrompt;
