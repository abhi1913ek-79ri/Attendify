import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/ApiPaths";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import "./Register.css";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaKey } from "react-icons/fa";
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

  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(false); // ✅ controls which form to show
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);
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

  // ✅ Step 1: Register & Send OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setFormErrors({ confirmPassword: "Passwords do not match" });
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.REGISTER, formData);
      toast.success(res.data.message || "OTP sent to your email!");
      setOtpStep(true); // Switch to OTP input form
      // start a short cooldown for resend
      setResendCooldown(60);
    } catch (error) {
      const backendErrors = error.response?.data?.errors;
      if (Array.isArray(backendErrors)) {
        const fieldErrors = {};
        backendErrors.forEach((err) => {
          if (!fieldErrors[err.param]) fieldErrors[err.param] = err.msg;
        });
        setFormErrors(fieldErrors);
        toast.error(Object.values(fieldErrors)[0]);
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Step 2: Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.VERIFY_OTP, {
        email: formData.email,
        otp,
      });
      toast.success(res.data.message || "Account verified successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP functionality with cooldown
  const [resendCooldown, setResendCooldown] = useState(0);

  React.useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
     e.preventDefault();
     setIsResendLoading(true);
    try {
      await axiosInstance.post(API_PATHS.AUTH.SEND_OTP, { email: formData.email });
      toast.success("OTP resent to your email");
      setResendCooldown(60);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsResendLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        {!otpStep ? (
          <>
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

              <button type="submit" disabled={isLoading}>
                {isLoading ? <Loader /> : "Register"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="register-title">Verify Your Email</h2>
            <form onSubmit={handleOtpSubmit} className="register-form">
              <div className="input-group">
                <FaKey className="input-icon" />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <div className="otp-actions">
                <button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader /> : "Verify OTP"}
                </button>
                <button
                  type="button"
                  className="resend-btn"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : (isResendLoading ? <Loader /> : "Resend OTP")}
                </button>
              </div>
            </form>
          </>
        )}

        {/* Message */}
        {message && <p className="message">{message}</p>}

        {!otpStep && (
          <p className="login-link">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-indigo-700">
              Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default Register;
