import { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/ApiPaths';
import { useAuth } from './AuthContext'; // ✅ Make sure you're importing this
import { all } from 'axios';

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [isStudentLoading, setIsStudentLoading] = useState(true);

  const { user } = useAuth(); // ✅ Grab user from AuthContext

  const fetchStudent = async () => {
    setIsStudentLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.STUDENT.GET_PROFILE);
      setStudent(res.data);
    } catch (err) {
      console.error('Failed to fetch student:', err);
      setStudent(null);
    } finally {
      setIsStudentLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStudent();
    } else {
      setStudent(null);
      setIsStudentLoading(false);
    }
  }, [user]); // ✅ Depend on user


  const fetchAllStudents = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.STUDENT.GET_ALL_STUDENTS);
      setAllStudents(res.data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
      setAllStudents([]);
    }
  };

  useEffect(() => {
      fetchAllStudents();
  }, []); // ✅ Depend on user

 
  const clearStudent = () => setStudent(null);

  return (
    <StudentContext.Provider value={{ 
      student, 
      setStudent, 
      isStudentLoading, 
      clearStudent, 
      allStudents, 
      fetchStudent,
      fetchAllStudents 
    }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => useContext(StudentContext);
