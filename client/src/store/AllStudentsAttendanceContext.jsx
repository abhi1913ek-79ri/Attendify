import { createContext, useContext, useEffect, useState } from 'react';
import { API_PATHS } from '../utils/ApiPaths';
import axiosInstance from '../utils/axiosInstance';
import { useStudent } from './StudentContext';

const AllStudentsAttendanceContext = createContext();

export const AllStudentsAttendanceProvider = ({ children }) => {
  const { allStudents } = useStudent();
  const [allStudentsAttendance, setAllStudentsAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState(null);

  // Fetch attendance data for all students
  const fetchAllStudentsAttendance = async (forceRefresh = false) => {
    if (!allStudents || allStudents.length === 0) return;

    // Avoid unnecessary API calls unless forced refresh or first time
    if (!forceRefresh && allStudentsAttendance.length > 0 && lastFetched && 
        (Date.now() - lastFetched < 5 * 60 * 1000)) { // Cache for 5 minutes
      return;
    }

    try {
      setIsLoading(true);
      
      const attendancePromises = allStudents.map(async (student) => {
        try {
          const url = API_PATHS.ATTENDANCE.GET_ATTENDANCE.replace(
            ':studentId', 
            student.studentId || student._id
          );
          const response = await axiosInstance.get(url);
          
          return {
            ...student,
            attendanceData: response.data,
            overall: response.data.overall || { present: 0, total: 0, percentage: 0 },
            attendance: response.data.daily || {},
            subjects: response.data.subjects || {}
          };
        } catch (error) {
          console.error(`Error fetching attendance for student ${student._id}:`, error);
          
          // Return student with default attendance data if fetch fails
          return {
            ...student,
            attendanceData: {
              student: student._id,
              daily: {},
              subjects: {},
              overall: { present: 0, total: 0, percentage: 0 }
            },
            overall: { present: 0, total: 0, percentage: 0 },
            attendance: {},
            subjects: {}
          };
        }
      });

      const studentsWithAttendance = await Promise.all(attendancePromises);
      setAllStudentsAttendance(studentsWithAttendance);
      setLastFetched(Date.now());
      
    } catch (error) {
      console.error('Error fetching all students attendance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch when allStudents changes
  useEffect(() => {
    if (allStudents && allStudents.length > 0) {
      fetchAllStudentsAttendance();
    }
  }, [allStudents]);

  // Calculate aggregate statistics
  const calculateStats = () => {
    const totalStudents = allStudentsAttendance.length;
    
    if (totalStudents === 0) {
      return {
        totalStudents: 0,
        averageAttendance: 0,
        criticalStudents: 0,
        presentToday: 0,
        absentToday: 0,
        criticalAndAbsent: 0
      };
    }

    const todayDateString = new Date().toDateString();
    
    const averageAttendance = Math.round(
      allStudentsAttendance.reduce(
        (sum, student) => sum + (student?.overall?.percentage || 0),
        0
      ) / totalStudents
    );

    const criticalStudents = allStudentsAttendance.filter(
      (student) => (student?.overall?.percentage || 0) < 75
    ).length;

    const presentToday = allStudentsAttendance.filter(
      (student) => student?.attendance?.[todayDateString] === "present"
    ).length;

    const absentToday = totalStudents - presentToday;

    const criticalAndAbsent = allStudentsAttendance.filter(
      (student) =>
        (student?.overall?.percentage || 0) < 75 &&
        student?.attendance?.[todayDateString] !== "present"
    ).length;

    return {
      totalStudents,
      averageAttendance,
      criticalStudents,
      presentToday,
      absentToday,
      criticalAndAbsent
    };
  };

  const stats = calculateStats();

  // Update attendance for a specific student
  const updateStudentAttendance = (studentId, attendanceData) => {
    setAllStudentsAttendance(prev => 
      prev.map(student => 
        student._id === studentId || student.studentId === studentId
          ? {
              ...student,
              attendanceData,
              overall: attendanceData.overall || { present: 0, total: 0, percentage: 0 },
              attendance: attendanceData.daily || {},
              subjects: attendanceData.subjects || {}
            }
          : student
      )
    );
  };

  const contextValue = {
    allStudentsAttendance,
    isLoading,
    stats,
    fetchAllStudentsAttendance,
    updateStudentAttendance,
    lastFetched
  };

  return (
    <AllStudentsAttendanceContext.Provider value={contextValue}>
      {children}
    </AllStudentsAttendanceContext.Provider>
  );
};

export const useAllStudentsAttendance = () => {
  const context = useContext(AllStudentsAttendanceContext);
  if (!context) {
    throw new Error('useAllStudentsAttendance must be used within AllStudentsAttendanceProvider');
  }
  return context;
};