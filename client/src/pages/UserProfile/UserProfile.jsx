import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { useAuth } from "../../store/AuthContext";
import { BadgeCheck, CalendarDays, UserCheck } from "lucide-react";
import AuthPrompt from "../../components/AuthPrompt/AuthPrompt";
import { useStudent } from "../../store/StudentContext";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { assets } from "../../assets/assets";
import StudentSubjectTable from "../../components/StudentSubjectTable/StudentSubjectTable";
import StudentHeatmapCalendar from "../../components/StudentCalendar/StudentHeatmapCalendar";
import SubjectHistory from "../../components/SubjectHistory/SubjectHistory";
import { useAttendance } from "../../store/AttendanceContext";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { user } = useAuth();
  const { student } = useStudent();
  const { attendanceData, overallStats, isOverallCritical } = useAttendance();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !student) {
      navigate("/add-student");
    }
  }, [student, user, navigate]);

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
      // Function to get last marked date (most recent date when student was present)
  const getLastMarkedDate = () => {
  if (!attendanceData?.daily) {
    console.log('No daily attendance data found');
    return '-';
  }

  console.log('Daily attendance data:', attendanceData.daily);

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
            <div className="profile-image-container">
              <img
                src={assets.placeHolder.profile_placeholder_image}
                alt="profile"
                className="profile-image"
              />
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
          <StudentHeatmapCalendar
            presentDates={calculateOverallPresentDates(attendanceData)}
            title={"Overall Attendance History"}
          />
        </div>

        <div className="subject-wise-attendance-history">
          <SubjectHistory student={student} attendanceData={attendanceData} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
