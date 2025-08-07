import React, { useState } from "react";
import "./UserProfile.css";
import { useAuth } from "../../store/AuthContext";
import { BadgeCheck, CalendarDays, UserCheck } from "lucide-react";
import AuthPrompt from "../../components/AuthPrompt/AuthPrompt";
import { useStudent } from "../../store/StudentContext";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { assets } from "../../assets/assets";
// import StudentSubjectTable from "../../components/StudentSubjectTable/StudentSubjectTable";
// import StudentHeatmapCalendar from "../../components/StudentCalendar/StudentHeatmapCalendar";
// import SubjectHistory from '../../components/SubjectHistory/SubjectHistory';
import AddStudent from "../../components/AddStudent/AddStudent";

const UserProfile = () => {
  const { user } = useAuth();
  const { student } = useStudent();

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

  if (!student) {
    return <AddStudent />;
  }

  return (
    <>
      <div className="user-profile">
        <h1 className="user-profile-heading">Hi, {student?.name}</h1>
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
                {student?.name} ( {student?.rollNo} )
              </h2>
            </div>
            <div className="profile-content-section">
              <p className="text-gray-600">
                <span className="label">Name : </span>
                <span className="value">{student?.name}</span>
              </p>
              <p className="text-gray-600">
                <span className="label">Student ID : </span>
                <span className="value">{student?.studentId}</span>
              </p>
              <p className="text-gray-600">
                <span className="label">Roll No : </span>
                <span className="value">{student?.rollNo}</span>
              </p>

              <p className="text-gray-600">
                <span className="label">Total Days : </span>
                <span className="value">
                  {student?.overall?.totalClasses || 0}
                </span>
              </p>

              <p className="text-gray-600">
                <span className="label">Present: </span>
                <span className="value">{student?.overall?.present || 0}</span>
              </p>

              <p className="text-gray-600">
                <span className="label">Attendance:</span>
                <span className="value">
                  {student?.overall?.percentage || 0}%
                </span>
              </p>
            </div>
            <hr className="text-gray-300" />
            {/* Students Subject */}
            <div className="last-marked-plus-isCritical">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
                <span className="text-blue-950">
                  <span className="font-medium">Last Marked :</span>{" "}
                  {student?.overall?.lastMarked || "Not Marked"}
                </span>
              </div>
              <div className="">
                {student?.isCritical ? (
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
              <span className="font-bold">{student?.name}</span>
            </h3>
            {/* <StudentSubjectTable student={student} /> */}
          </div>

          <div className="student-calendar">
            {/* <StudentHeatmapCalendar
              presentDates={student?.overall?.presentDates || 0}
              title={"Overall Attendance History"}
            /> */}
          </div>
          {/* <div className="subject-wise-attendance-history">
                    <SubjectHistory student={student} />
                </div> */}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
