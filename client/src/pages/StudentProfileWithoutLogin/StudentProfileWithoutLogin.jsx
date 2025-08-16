import { useParams, useNavigate } from "react-router-dom";
import { useStudent } from "../../store/StudentContext.jsx";
import { BadgeCheck, CalendarDays, ArrowLeft, User2, User, UserRound } from "lucide-react";
import './StudentProfileWithoutLogin.css';
import { assets } from "../../assets/assets.js";
import { v4 as uuidv4 } from 'uuid';
import StudentHeatmapCalendar from "../../components/StudentCalendar/StudentHeatmapCalendar.jsx";
import StudentSubjectTable from "../../components/StudentSubjectTable/StudentSubjectTable.jsx";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/ApiPaths.js";
import { useState, useEffect } from "react";
import SkeletonLoader from '../../components/Loader/SkeletonLoader.jsx'
import ProfileImage from "../../components/ProfileImage/ProfileImage.jsx";

const StudentProfile = () => {
  const { studentId } = useParams();
  const [currentStudent, setCurrentStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAttendanceLoading, setIsAttendanceLoading] = useState(false);
  const navigate = useNavigate();
 
      // Function to get last marked date (most recent date when student was present)
  const getLastMarkedDate = () => {
  if (!attendanceData?.daily) {
    console.log('No daily attendance data found');
    return '-';
  }


  let dailyData = {};

  if (attendanceData.daily instanceof Map) {
    dailyData = Object.fromEntries(attendanceData.daily);
  } else if (typeof attendanceData.daily === 'object') {
    dailyData = attendanceData.daily;
  }

  // Extract date part from "subject_YYYY-MM-DD"
  const presentDates = Object.entries(dailyData)
    .filter(([key, status]) => status === 'present')
    .map(([key]) => key.split('_')[1]) // take only date
    .sort((a, b) => new Date(b) - new Date(a));

  return presentDates.length > 0 ? presentDates[0] : '-';
};

  const getStudentById = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.STUDENT.GET_BY_ID(studentId));
      setCurrentStudent(res.data.currentStudent);
    } catch(err) {
      console.error('Failed to fetch students:', err);
      setCurrentStudent([]);
    } finally {
      setLoading(false);
    }
  };
  const fetchAttendanceData = async () => {
    if (!currentStudent?.studentId) {
      console.error('No student ID available');
      return;
    }

    try {
      setIsAttendanceLoading(true);
      const url = API_PATHS.ATTENDANCE.GET_ATTENDANCE.replace(':studentId', currentStudent.studentId);
      
      const response = await axiosInstance.get(url);
      setAttendanceData(response.data);
    } catch (error) {
      console.error('Error :', {message: error.message
      });
      
      if (error.response?.status === 404) {
        // If no attendance record exists, initialize empty structure
        setAttendanceData({
          student: currentStudent._id, // Use _id instead of studentId
          daily: {},
          subjects: {},
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
const calculateOverallPresentDates = (attendanceData) => {
    if (!attendanceData?.daily) return [];

    const dailyData =
      attendanceData.daily instanceof Map
        ? Object.fromEntries(attendanceData.daily)
        : attendanceData.daily;

    // Extract dates from keys like "Subject_YYYY-MM-DD" where status === 'present'
    const uniqueDates = new Set(
      Object.entries(dailyData)
        .filter(([key, status]) => status === "present")
        .map(([key]) => key.split("_")[1]) // take only the date part
    );

    return Array.from(uniqueDates).sort((a, b) => new Date(b) - new Date(a));
  };
  useEffect(() => {
  getStudentById(); // fetch student once on mount
}, []);

useEffect(() => {
  if (currentStudent?.studentId) {
    fetchAttendanceData(); // fetch attendance only when student is ready
  }
}, [currentStudent]);

  if(loading) return <SkeletonLoader />;

  if (!currentStudent) return <div className="text-center text-red-500">Student not found 😢</div>;

  return (
    <div className="profile-page">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="py-5 flex items-center text-blue-700 hover:text-blue-900 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      {/* Profile Box */}
      <div className="profile-container">
        <div className="flex flex-col justify-between items-center space-y-2">
          <div className="profile-image-container">
            <ProfileImage 
                imageUrl={currentStudent?.profileImageUrl}
                name={currentStudent?.name}
                size="w-24 h-24"
                textSize="text-2xl"
                className="profile-image"
              />
          </div>
          <h2 className="profile-heading">{currentStudent?.name} ( {currentStudent?.rollNo} )</h2>
        </div>
        <div className="profile-content-section">
          <p className="text-gray-600">
            <span className="label">Name : </span><span className="value">{currentStudent?.name}</span>
          </p>
          <p className="text-gray-600">
            <span className="label">Student ID : </span><span className="value">{currentStudent?.studentId}</span>
          </p>
          <p className="text-gray-600">
            <span className="label">Roll No : </span><span className="value">{currentStudent?.rollNo}</span>
          </p>

          <p className="text-gray-600">
            <span className="label">Total Days : </span><span className="value">{overallStats?.totalClasses ?? 0}</span>
          </p>

          <p className="text-gray-600">
            <span className="label">Present: </span><span className="value">{overallStats?.present ?? 0}</span>
          </p>

          <p className="text-gray-600">
            <span className="label">Attendance:</span><span className="value"> {overallStats?.percentage != null
                  ? `${overallStats.percentage.toFixed(1)}%`
                  : "0.0%"}</span>
          </p>

        </div>
        <hr className='text-gray-300' />
        {/* Students Subject */}
        <div className="last-marked-plus-isCritical">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
            <span className="text-blue-950"><span className="font-medium">Last Marked :</span> {getLastMarkedDate() || 'Not Marked'}</span>
          </div>
          <div className="">
            {isOverallCritical? (
              <span className="text-red-500 font-medium flex items-center">⚠️ Critical Attendance</span>
            ) : (
              <span className="text-green-600 font-semibold flex items-center">
                <BadgeCheck className="w-5 h-5 mr-2" /> All Good
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="student-subjects">
        <h3 className="student-subjects-heading">Subject Wise Attendance of <span className="font-bold">{currentStudent?.name}</span></h3>
        <StudentSubjectTable
            student={currentStudent}
            attendanceData={attendanceData}
            overallStats={overallStats}
            isOverallCritical={isOverallCritical}
          />
      </div>

      <div className="student-calendar">
        {
          (() => {
            const dailyData = attendanceData?.daily instanceof Map ? Object.fromEntries(attendanceData.daily) : attendanceData?.daily || {};
            const overallDateStatus = Object.keys(dailyData).reduce((acc, key) => {
              const parts = key.split('_');
              if (parts.length >= 2) {
                const date = parts.slice(-1)[0];
                acc[date] = 'marked';
              }
              return acc;
            }, {});

            return (
              <StudentHeatmapCalendar presentDates={calculateOverallPresentDates(attendanceData)} dateStatusMap={overallDateStatus} title={'Attendance History'} />
            );
          })()
        }
      </div>
    </div>

  );
};

export default StudentProfile;