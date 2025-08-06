import { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/ApiPaths';
import { useAuth } from './AuthContext'; // ✅ Make sure you're importing this

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth(); // ✅ Grab user from AuthContext

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.STUDENT.GET_PROFILE);
      setStudent(res.data);
    } catch (err) {
      console.error('Failed to fetch student:', err);
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStudent();
    } else {
      setStudent(null);
      setLoading(false);
    }
  }, [user]); // ✅ Depend on user

  const clearStudent = () => setStudent(null);

  return (
    <StudentContext.Provider value={{ student, loading, clearStudent, fetchStudent }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => useContext(StudentContext);
