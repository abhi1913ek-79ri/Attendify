import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { useAuth } from "../../store/AuthContext";
import { BadgeCheck, CalendarDays, UserCheck, Camera, Trash2 } from "lucide-react";
import AuthPrompt from "../../components/AuthPrompt/AuthPrompt";
import { useStudent } from "../../store/StudentContext";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { assets } from "../../assets/assets";
import StudentSubjectTable from "../../components/StudentSubjectTable/StudentSubjectTable";
import StudentHeatmapCalendar from "../../components/StudentCalendar/StudentHeatmapCalendar";
import SubjectHistory from "../../components/SubjectHistory/SubjectHistory";
import ProfileImage from "../../components/ProfileImage/ProfileImage";
import { useAttendance } from "../../store/AttendanceContext";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/ApiPaths";
import { toast } from "react-toastify";


const UserProfile = () => {
  const { user, isAuthLoading } = useAuth();
  const { student, fetchStudent, isStudentLoading } = useStudent();
  const { attendanceData, fetchAttendanceData, overallStats, isOverallCritical } = useAttendance();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Image management state - must be declared at component top level
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);

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

    console.log('Present dates:', presentDates);
    return presentDates.length > 0 ? presentDates[0] : '-';
  };

  useEffect(() => {
    if (user && !isAuthLoading) {
      fetchStudent();          // Fetch latest student data
      fetchAttendanceData();   // Fetch latest attendance data
    }
  }, [user, isAuthLoading]);

  useEffect(() => {
    // Only navigate if we're sure about the authentication state and student data
    if (!isAuthLoading && !isStudentLoading && user && !student && location.pathname !== "/add-student") {
      navigate("/add-student");
    }
  }, [student, user, navigate, location.pathname, isAuthLoading, isStudentLoading]);

  // Show loading while authentication is being checked
  if (isAuthLoading) {
    return (
      <div className="user-profile-loading">
        <div className="loader">Checking authentication...</div>
      </div>
    );
  }

  // If not authenticated, show auth prompt
  if (!user) {
    return (
      <div className="user-profile-not-logged">
        <AuthPrompt
          message={"You are not logged in"}
          purpose={"view your profile"}
        />
      </div>
    );
  }

  // Show loading while student data is being fetched
  if (isStudentLoading) {
    return (
      <div className="user-profile-loading">
        <div className="loader">Loading student data...</div>
      </div>
    );
  }

  // If user is authenticated but no student data exists, show loading message
  // The useEffect will handle navigation to add-student page
  if (!student) {
    return (
      <div className="user-profile-loading">
        <div className="loader">Redirecting to add student...</div>
      </div>
    );
  }

  // Image management functions
  const handleImageUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setIsUpdatingImage(true);
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await axiosInstance.put(
        API_PATHS.STUDENT.UPDATE_PROFILE_IMAGE, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success('Profile image updated successfully!');
        fetchStudent(); // Refresh student data
      }
    } catch (error) {
      console.error('Error updating image:', error);
      toast.error(error.response?.data?.message || 'Failed to update image');
    } finally {
      setIsUpdatingImage(false);
      // Clear the file input
      e.target.value = '';
    }
  };

  const handleImageDelete = async () => {
    if (!student?.profileImageUrl) {
      toast.info('No profile image to delete');
      return;
    }

    if (!window.confirm('Are you sure you want to delete your profile image?')) {
      return;
    }

    try {
      setIsUpdatingImage(true);
      const response = await axiosInstance.delete(API_PATHS.STUDENT.DELETE_PROFILE_IMAGE);

      if (response.data.success) {
        toast.success('Profile image deleted successfully!');
        fetchStudent(); // Refresh student data
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error(error.response?.data?.message || 'Failed to delete image');
    } finally {
      setIsUpdatingImage(false);
    }
  };

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

  return (
    <div className="user-profile">
      <h1 className="user-profile-heading">Hi, {student?.name || "Student"}</h1>
      <p className="user-profile-sub-heading">Your Details are here</p>

      <div className="user-details">
        <div className="profile-container">
          <div className="flex flex-col justify-between items-center space-y-2">
            <div className="profile-image-container relative">
              <ProfileImage 
                imageUrl={student?.profileImageUrl}
                name={student?.name}
                size="w-24 h-24"
                textSize="text-2xl"
                className="profile-image"
              />
              
              {/* Image management buttons */}
              <div className="absolute -bottom-2 -right-2 flex space-x-1">
                <input
                  type="file"
                  id="profileImageInput"
                  accept="image/*"
                  onChange={handleImageUpdate}
                  className="hidden"
                  disabled={isUpdatingImage}
                />
                <button
                  onClick={() => document.getElementById('profileImageInput').click()}
                  disabled={isUpdatingImage}
                  className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 disabled:opacity-50"
                  title="Update profile image"
                >
                  <Camera size={14} />
                </button>
                
                {student?.profileImageUrl && (
                  <button
                    onClick={handleImageDelete}
                    disabled={isUpdatingImage}
                    className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 disabled:opacity-50"
                    title="Delete profile image"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              
              {isUpdatingImage && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
            <h2 className="profile-heading">
              {student?.name || "Name"} ({student?.rollNo || "Roll No"})
            </h2>
          </div>

          <div className="profile-content-section">
            <p>
              <span className="label">Name:</span>{" "}
              <span className="value">{student?.name || "-"}</span>
            </p>
            <p>
              <span className="label">Student ID:</span>{" "}
              <span className="value">{student?.studentId || "-"}</span>
            </p>
            <p>
              <span className="label">Roll No:</span>{" "}
              <span className="value">{student?.rollNo || "-"}</span>
            </p>
            <p>
              <span className="label">Total Days:</span>{" "}
              <span className="value">{overallStats?.totalClasses ?? 0}</span>
            </p>
            <p>
              <span className="label">Present:</span>{" "}
              <span className="value">{overallStats?.present ?? 0}</span>
            </p>
            <p>
              <span className="label">Attendance:</span>
              <span className="value">
                {overallStats?.percentage != null
                  ? `${overallStats.percentage.toFixed(1)}%`
                  : "0.0%"}
              </span>
            </p>
          </div>

          <hr className="text-gray-300" />

          <div className="last-marked-plus-isCritical">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
              <span className="text-blue-950">
                <span className="font-medium">Last Marked:</span>{" "}
                {getLastMarkedDate() || "Not Marked"}
              </span>
            </div>
            <div>
              {isOverallCritical ? (
                <span className="text-red-500 font-medium flex items-center">
                  ⚠️ Critical Attendance
                </span>
              ) : (
                <span className="text-green-600 font-semibold flex items-center">
                  <BadgeCheck className="w-5 h-5 mr-2" /> All Good
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="student-subjects">
          <h3 className="student-subjects-heading">
            Subject Wise Attendance of{" "}
            <span className="font-bold">{student?.name || "-"}</span>
          </h3>
          <StudentSubjectTable
            student={student}
            attendanceData={attendanceData}
            overallStats={overallStats}
            isOverallCritical={isOverallCritical}
          />
        </div>
        <div className="student-calendar">
          {
            // Build overall dateStatusMap: any recorded date (present or absent) -> 'marked'
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
                <StudentHeatmapCalendar
                  presentDates={calculateOverallPresentDates(attendanceData)}
                  dateStatusMap={overallDateStatus}
                  title={"Overall Attendance History"}
                />
              );
            })()
          }
        </div>

        <div className="subject-wise-attendance-history">
          <SubjectHistory student={student} attendanceData={attendanceData} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
