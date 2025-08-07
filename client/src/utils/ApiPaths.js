export const BASE_URL = "http://localhost:8000";

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
  }
};