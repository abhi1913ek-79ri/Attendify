import { createContext, useContext, useEffect, useState } from 'react';
import { API_PATHS } from '../utils/ApiPaths';
import axiosInstance from '../utils/axiosInstance';
import { useStudent } from './StudentContext';

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const {student} = useStudent();
  const [attendanceData, setAttendanceData] = useState(null);
  const [isAttendanceLoading, setIsAttendanceLoading] = useState(true);

 // Fetch attendance data when component mounts or student changes
  useEffect(() => {
    if (student?.rollNo) {
      fetchAttendanceData();
    }
  }, [student?.rollNo]);

  // Fetch attendance data from backend using axiosInstance
  const fetchAttendanceData = async () => {
    if (!student?.rollNo) {
      console.error('No roll number available');
      return;
    }

    try {
      setIsAttendanceLoading(true);
      const url = API_PATHS.ATTENDANCE.GET_ATTENDANCE.replace(':rollNo', student.rollNo);
      
      const response = await axiosInstance.get(url);
      setAttendanceData(response.data);
    } catch (error) {
      console.error('Error :', {message: error.message
      });
      
      if (error.response?.status === 404) {
        // If no attendance record exists, initialize empty structure
        setAttendanceData({
          student: student._id, // Use _id instead of rollNo
          daily: {},
          subjects: {},
          classes: {}, // Add missing classes field
          overall: { present: 0, total: 0, percentage: 0 }
        });
      } else {
        console.error('Error fetching attendance:', error);
        toast.error(`Failed to fetch attendance: ${error.response?.status || 'Network Error'}`);
      }
    } finally {
      setIsAttendanceLoading(false);
    }
  };

  const calculateOverallAttendance = () => {
    if (!attendanceData || !attendanceData.overall) {
      return { totalClasses: 0, present: 0, percentage: 0 };
    }

    return {
      totalClasses: attendanceData.overall.total || 0,
      present: attendanceData.overall.present || 0,
      percentage: attendanceData.overall.percentage || 0
    };
  };

  // Calculate overall stats
  const overallStats = calculateOverallAttendance();
  const isOverallCritical = overallStats.percentage < 75;

  return (
    <AttendanceContext.Provider value={{ attendanceData,setAttendanceData, fetchAttendanceData, overallStats, isOverallCritical}}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => useContext(AttendanceContext);
