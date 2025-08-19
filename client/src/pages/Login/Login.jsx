import React, { useState } from "react";
import axios from "axios";
import "./login.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { API_PATHS } from "../../utils/ApiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";

function Login() {
  const navigate = useNavigate();
  const {updateUser} = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setIsLoading(true);

    const res = await axiosInstance.post(API_PATHS.AUTH.LOGIN, formData);
    setMessage(res.data.message || "Login successfully!");
    toast.success(res.data.message || "Login successfully!");
    const { token } = res.data;

    if (token) {
      localStorage.setItem("token", token);
      updateUser(res.data); // use 'res' not 'response'
      navigate('/user-profile');
    } else {
      setMessage("Login failed: No token received");
    }
  } catch (error) {
    toast.error("Failed to login!");
    if (error.response && error.response.data.message) {
      setMessage(error.response.data.message);
    } else {
      setMessage("Something went wrong, Please try again.");
    }
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? <Loader /> : <span>Login</span>}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
        <p className="login-link">
          New User?{" "}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
