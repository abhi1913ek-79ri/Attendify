import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/ApiPaths";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import "./Register.css";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student", // Default role
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({}); // Clear old errors
    setMessage("");

    // Basic client-side validation
    if (formData.password !== formData.confirmPassword) {
      setFormErrors({ confirmPassword: "Passwords do not match" });
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.REGISTER, formData);
      setMessage(res.data.message || "User registered successfully!");
      toast.success("User registered successfully!");
      navigate("/login");
    } catch (error) {
      const backendErrors = error.response?.data?.errors;

      if (Array.isArray(backendErrors)) {
        const fieldErrors = {};
        backendErrors.forEach((err) => {
          if (!fieldErrors[err.path]) {
            fieldErrors[err.path] = err.msg; // take only first error per field
          }
        });
        setFormErrors(fieldErrors);
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
        setFormErrors(error.response?.data?.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Create an Account</h2>

        <form onSubmit={handleSubmit} className="register-form">
          {/* Name */}
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          {formErrors.name && <p className="error-text">{formErrors.name}</p>}

          {/* Email */}
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
          {formErrors.email && <p className="error-text">{formErrors.email}</p>}

          {/* Password */}
          <div className="input-group relative">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {showPassword ? (
              <FaEye
                className="absolute top-3 right-2.5 cursor-pointer"
                onClick={toggleShowPassword}
              />
            ) : (
              <FaEyeSlash
                className="absolute top-3 right-2.5 cursor-pointer"
                onClick={toggleShowPassword}
              />
            )}
          </div>
          {formErrors.password && (
            <p className="error-text">{formErrors.password}</p>
          )}

          {/* Confirm Password */}
          <div className="input-group relative">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          {formErrors.confirmPassword && (
            <p className="error-text">{formErrors.confirmPassword}</p>
          )}

          {/* Role Selection */}
          <div className="role-selection">
            <label className="text-sm font-medium text-gray-700">
              Register as:
            </label>
            <div className="role-options">
              <label className="radio-label">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={formData.role === "student"}
                  onChange={handleChange}
                />
                Student
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === "admin"}
                  onChange={handleChange}
                />
                Admin
              </label>
            </div>
          </div>
          {formErrors.role && <p className="error-text">{formErrors.role}</p>}
          {/* Submit Button */}
          <button type="submit" disabled={isLoading}>
            {isLoading ? <Loader /> : "Register"}
          </button>
        </form>

        {/* Message */}
        {message && <p className="message">{message}</p>}

        {/* Link to Login */}
        <p className="login-link">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
