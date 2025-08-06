import React, { useEffect, useState } from 'react';
import './StudentProfileWithoutLogin.css';
import { useAuth } from '../../store/AuthContext';
import { BadgeCheck, CalendarDays, UserCheck } from 'lucide-react';
import AuthPrompt from '../../components/AuthPrompt/AuthPrompt';
import axios from 'axios';
import StudentSubjectTable from '../../components/StudentSubjectTable/StudentSubjectTable';
import StudentHeatmapCalendar from '../../components/StudentCalendar/StudentHeatmapCalendar';
import SubjectHistory from '../../components/SubjectHistory/SubjectHistory';
import { assets } from '../../assets/assets';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/ApiPaths';

const UserProfile = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch from backend
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.STUDENT.GET_PROFILE);
        setStudent(res.data);
      } catch (error) {
        console.error('Error fetching student:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStudent();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="user-profile-not-logged">
        <AuthPrompt message="You are not logged in" purpose="view your profile" />
      </div>
    );
  }

  if (loading) return <p className="text-center p-5">Loading...</p>;

  if (!user) {
    return (
      <div className="user-profile-student-not-found">
        <div className="user-profile-student-not-found-haeding flex flex-col items-center gap-2">
          <UserCheck />
          <h2 className="text-3xl font-semibold text-blue-950 my-5">Hi, {user.name} </h2>
        </div>
        <hr className="text-gray-300" />
        <div className="p-4 text-lg bg-red-100 rounded">
          <p>⚠️ You are logged in but not found in the student list.</p>
        </div>
        <div className="no-data-illustration">
          <img src={assets.ilustrations.no_data_illustration} alt="no-data" />
        </div>
        <p className="text-red-500">Please contact the admin.</p>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <h1 className="user-profile-heading">Hi, {student.name}</h1>
      <p className="user-profile-sub-heading">Your Details are here</p>
      <div className="user-details">
        <div className="profile-container">
          <div className="flex flex-col justify-between items-center space-y-2">
            <div className="profile-image-container">
              <img src={assets.placeHolder.profile_placeholder_image} alt="profile" className="profile-image" />
            </div>
            <h2 className="profile-heading">
              {student.name} ( {student.rollNo} )
            </h2>
          </div>
          <div className="profile-content-section">
            <p><span className="label">Name:</span> {student.name}</p>
            <p><span className="label">Student ID:</span> {student._id}</p>
            <p><span className="label">Roll No:</span> {student.rollNo}</p>
            <p><span className="label">Total Days:</span> {student.overall.totalClasses}</p>
            <p><span className="label">Present:</span> {student.overall.present}</p>
            <p><span className="label">Attendance:</span> {student.overall.percentage}%</p>
          </div>
          <hr className="text-gray-300" />
          <div className="last-marked-plus-isCritical">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
              <span className="text-blue-950">
                <span className="font-medium">Last Marked :</span> {student.overall.lastMarked || 'Not Marked'}
              </span>
            </div>
            <div>
              {student.isCritical ? (
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
          <h3 className="student-subjects-heading">Subject Wise Attendance of <span className="font-bold">{student.name}</span></h3>
          <StudentSubjectTable student={student} />
        </div>

        <div className="student-calendar">
          <StudentHeatmapCalendar presentDates={student.overall.presentDates} title="Overall Attendance History" />
        </div>

        <div className="subject-wise-attendance-history">
          <SubjectHistory student={student} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
