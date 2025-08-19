export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", // Signup
    LOGIN: "/api/auth/login", // Authenticate user & return JWT token
    GET_PROFILE: "/api/auth/profile", // Get logged-in user details
  },
  STUDENT: {
    GET_PROFILE: "/api/student/profile", // Get student profile for logged-in user
    ADD: "/api/student/add",
    GET_ALL_STUDENTS: "/api/student/getAllStudents",
    GET_BY_ID: (id) => `/api/student/${id}`, // Get student by ID
    UPDATE_PROFILE_IMAGE: "/api/student/profile-image", // Update profile image
    DELETE_PROFILE_IMAGE: "/api/student/profile-image", // Delete profile image
  UPDATE_PROFILE: "/api/student/profile",
  },
  ATTENDANCE: {
    GET_ATTENDANCE: '/api/attendance/:rollNo',
    UPDATE_ATTENDANCE: '/api/attendance/:rollNo'
  }
};