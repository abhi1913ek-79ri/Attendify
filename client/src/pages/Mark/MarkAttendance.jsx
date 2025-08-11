import React, { useState, useEffect } from "react";
import "./MarkAttendance.css";
import {
  CalendarCheck,
  User,
  BookOpen,
  Calendar,
  Check,
  X,
  Clock,
} from "lucide-react";
import { useAuth } from "../../store/AuthContext";
import { useStudent } from "../../store/StudentContext";
import AuthPrompt from "../../components/AuthPrompt/AuthPrompt";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/ApiPaths";
import useAutoUpdatingTodayDate from "../../utils/useAutoUpdatingTodayDate";
import { useAttendance } from "../../store/AttendanceContext";

const MarkAttendance = ({ todaysActions, setTodaysActions }) => {
  const { user } = useAuth();
  const { student } = useStudent();
  const today = useAutoUpdatingTodayDate();

  const [selectedDate, setSelectedDate] = useState(today);
  const [subjectDates, setSubjectDates] = useState({});
  const { attendanceData, setAttendanceData, overallStats, isOverallCritical } =
    useAttendance();
  const [loading, setLoading] = useState(false);

  // Update attendance data in backend using axiosInstance
  const updateAttendanceInBackend = async (updatedData) => {
    try {
      console.log("Updating attendance with data:", updatedData);
      const url = API_PATHS.ATTENDANCE.UPDATE_ATTENDANCE.replace(
        ":studentId",
        student.studentId
      );
      console.log("PUT request to:", `${axiosInstance.defaults.baseURL}${url}`);

      const response = await axiosInstance.put(url, updatedData);
      console.log("Update response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Update error details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response?.data,
      });
      toast.error(
        `Failed to update attendance: ${
          error.response?.status || "Network Error"
        }`
      );
      throw error;
    }
  };

  // Agar user logged in nahi hai
  if (!user) {
    return (
      <div className="mark-attendance">
        <div className="page-header">
          <div className="header-content">
            <CalendarCheck className="header-icon" />
            <h2 className="header-title">Mark Attendance</h2>
          </div>
        </div>
        <div className="page-content">
          <AuthPrompt
            message={"Access Denied"}
            purpose={"mark your attendance"}
          />
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="mark-attendance">
        <div className="page-header">
          <div className="header-content">
            <CalendarCheck className="header-icon" />
            <h2 className="header-title">Mark Attendance</h2>
          </div>
        </div>
        <div className="page-content">
          <div className="error-card">
            <p>⚠️ You are logged in but not found in the student list.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mark-attendance">
        <div className="page-header">
          <div className="header-content">
            <CalendarCheck className="header-icon" />
            <h2 className="header-title">Mark Attendance</h2>
          </div>
        </div>
        <div className="page-content">
          <div className="loading-card">
            <p>Loading attendance data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Get subjects from student.subjects Map (keys are subject names, values are percentages)
  const getSubjectsList = () => {
    if (!student?.subjects) return [];

    // Convert Map to array of subject names
    if (student.subjects instanceof Map) {
      return Array.from(student.subjects.keys());
    } else if (typeof student.subjects === "object") {
      return Object.keys(student.subjects);
    }
    return [];
  };

  const subjects = getSubjectsList();

  // Add action to today's actions list
  const addTodaysAction = (subject, action, date) => {
    const timestamp = new Date().toLocaleTimeString();
    const newAction = {
      id: Date.now(),
      subject,
      action, // 'marked' or 'unmarked'
      date,
      timestamp,
    };
    setTodaysActions((prev) => [newAction, ...prev]);
  };

  // Individual subject date change handler
  const handleSubjectDateChange = (subject, date) => {
    setSubjectDates((prev) => ({
      ...prev,
      [subject]: date,
    }));
  };

  // Overall date change handler
  const handleOverallDateChange = (date) => {
    setSelectedDate(date);
    // Update all subject dates to the selected overall date
    const newSubjectDates = {};
    subjects.forEach((subject) => {
      newSubjectDates[subject] = date;
    });
    setSubjectDates(newSubjectDates);
  };

  // Mark attendance function - Fixed to track per subject per date
  const handleMarkAttendance = async (subject) => {
  const dateToUse = subjectDates[subject] || selectedDate;

  if (!attendanceData) {
    toast.error('Attendance data not loaded');
    return;
  }

  // Unique key for subject + date
  const subjectAttendanceKey = `${subject}_${dateToUse}`;

  // Prevent double-marking for same subject & date
  if (attendanceData.daily[subjectAttendanceKey] === 'present') {
    toast.error(`Attendance already marked for ${subject} on ${dateToUse}!`);
    return;
  }

  // Step 1: Update daily + subject counts
  const updatedData = {
    daily: {
      ...attendanceData.daily,
      [subjectAttendanceKey]: 'present'
    },
    subjects: {
      ...attendanceData.subjects,
      [subject]: {
        present: (attendanceData.subjects[subject]?.present || 0) + 1,
        total: (attendanceData.subjects[subject]?.total || 0) + 1
      }
    }
  };

  // Step 2: Recalculate overall from subjects
  const totalPresent = Object.values(updatedData.subjects)
    .reduce((sum, subj) => sum + subj.present, 0);
  const totalClasses = Object.values(updatedData.subjects)
    .reduce((sum, subj) => sum + subj.total, 0);

  updatedData.overall = {
    present: totalPresent,
    total: totalClasses,
    percentage: 0 // Let backend calculate
  };

  // Step 3: Send to backend
  try {
    const response = await updateAttendanceInBackend(updatedData);
    setAttendanceData(response.data || response);
    addTodaysAction(subject, 'marked', dateToUse);
    toast.success(`Attendance marked for ${subject} on ${dateToUse}!`);
  } catch (error) {
    // Error handled in updateAttendanceInBackend
  }
};

  // Unmark attendance function - Fixed to track per subject per date
  const handleUnmarkAttendance = async (subject) => {
  const dateToUse = subjectDates[subject] || selectedDate;

  if (!attendanceData) {
    toast.error("Attendance data not loaded");
    return;
  }

  const subjectAttendanceKey = `${subject}_${dateToUse}`;

  if (attendanceData.daily[subjectAttendanceKey] !== "present") {
    toast.error(`No attendance found for ${subject} on ${dateToUse}!`);
    return;
  }

  const currentSubjectData = attendanceData.subjects[subject];
  if (!currentSubjectData || currentSubjectData.present <= 0) {
    toast.error("Cannot unmark - no attendance record for this subject");
    return;
  }

  // Step 1: Remove from daily
  const updatedDaily = { ...attendanceData.daily };
  delete updatedDaily[subjectAttendanceKey];

  // Step 2: Update subject counts
  const updatedSubjects = {
    ...attendanceData.subjects,
    [subject]: {
      present: Math.max(0, currentSubjectData.present - 1),
      total: Math.max(0, currentSubjectData.total - 1) // allow total to be 0
    }
  };

  // Step 3: Recalculate overall from subjects
  const totalPresent = Object.values(updatedSubjects)
    .reduce((sum, subj) => sum + subj.present, 0);
  const totalClasses = Object.values(updatedSubjects)
    .reduce((sum, subj) => sum + subj.total, 0);

  const updatedData = {
    daily: updatedDaily,
    subjects: updatedSubjects,
    overall: {
      present: totalPresent,
      total: totalClasses,
      percentage: 0 // Let backend calculate
    }
  };

  // Step 4: Save
  try {
    const response = await updateAttendanceInBackend(updatedData);
    setAttendanceData(response.data || response);
    addTodaysAction(subject, "unmarked", dateToUse);
    toast.success(`Attendance unmarked for ${subject} on ${dateToUse}!`);
  } catch (error) {
    // Error already handled in updateAttendanceInBackend
  }
};


  // Check if attendance is marked for a specific subject on a specific date
  const isAttendanceMarked = (subject, date) => {
    // Check if this specific subject has attendance marked for this date
    // We need to track per subject, not just per day
    const subjectAttendanceKey = `${subject}_${date}`;
    return attendanceData?.daily[subjectAttendanceKey] === "present";
  };

  return (
    <div className="mark-attendance">
      <div className="page-header">
        <div className="header-content">
          <CalendarCheck className="header-icon" />
          <h2 className="header-title">Mark Attendance</h2>
        </div>
      </div>

      <div className="page-content">
        {/* Student Details Card */}
        <div className="student-details-card">
          <div className="mark-attendance-card-header">
            <User className="card-icon" />
            <h3 className="card-title">Student Details</h3>
          </div>
          <div className="student-info">
            <div className="info-item">
              <span className="info-label">Name</span>
              <span className="info-value">{student?.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Student ID</span>
              <span className="info-value">{student?.studentId}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Roll No</span>
              <span className="info-value">{student?.rollNo}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Total Subjects</span>
              <span className="info-value">{subjects.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Overall Attendance</span>
              <span className="info-value">
                {overallStats?.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Status</span>
              <span
                className={`info-value ${
                  isOverallCritical ? "text-red-600" : "text-green-600"
                }`}
              >
                {isOverallCritical ? "⚠️ Critical" : "✅ Good"}
              </span>
            </div>
          </div>
        </div>

        {/* Overall Date Picker */}
        <div className="date-picker-card">
          <div className="mark-attendance-card-header">
            <Calendar className="card-icon" />
            <h3 className="card-title">Select Date (All Subjects)</h3>
          </div>
          <div className="date-input-container">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleOverallDateChange(e.target.value)}
              className="date-input"
              max={today}
            />
          </div>
        </div>

        {/* Attendance Table */}
        <div className="attendance-table-card">
          <div className="mark-attendance-card-header">
            <BookOpen className="card-icon" />
            <h3 className="card-title">Subject-wise Attendance</h3>
          </div>

          <div className="table-container">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.length > 0 ? (
                  subjects.map((subject) => {
                    const currentDate = subjectDates[subject] || selectedDate;
                    const isMarked = isAttendanceMarked(subject, currentDate); // Pass subject and date

                    return (
                      <tr key={subject}>
                        <td className="subject-cell">
                          <BookOpen className="subject-icon" />
                          <span>{subject}</span>
                        </td>
                        <td className="date-cell">
                          <input
                            type="date"
                            value={currentDate}
                            onChange={(e) =>
                              handleSubjectDateChange(subject, e.target.value)
                            }
                            className="table-date-input"
                            max={today}
                          />
                        </td>
                        <td className="status-cell">
                          <span
                            className={`status-badge ${
                              isMarked ? "status-present" : "status-absent"
                            }`}
                          >
                            {isMarked ? (
                              <>
                                <Check className="status-icon" />
                                Present
                              </>
                            ) : (
                              <>
                                <X className="status-icon" />
                                Absent
                              </>
                            )}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <div className="action-buttons">
                            <button
                              onClick={() => handleMarkAttendance(subject)}
                              className="btn btn-mark"
                              disabled={isMarked}
                            >
                              <Check className="btn-icon" />
                              Mark
                            </button>
                            <button
                              onClick={() => handleUnmarkAttendance(subject)}
                              className="btn btn-unmark"
                              disabled={!isMarked}
                            >
                              <X className="btn-icon" />
                              Unmark
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">
                      No subjects found for this student.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Today's Actions Table */}
        <div className="attendance-table-card">
          <div className="mark-attendance-card-header">
            <Clock className="card-icon" />
            <h3 className="card-title">Today's Actions</h3>
          </div>

          <div className="table-container">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Subject</th>
                  <th>Action</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {todaysActions.length > 0 ? (
                  todaysActions.map((action) => (
                    <tr key={action.id}>
                      <td className="font-mono text-sm">{action.timestamp}</td>
                      <td className="subject-cell">
                        <BookOpen className="subject-icon" />
                        <span>{action.subject}</span>
                      </td>
                      <td className="text-start">
                        <span
                          className={`status-badge ${
                            action.action === "marked"
                              ? "status-present"
                              : "status-absent"
                          }`}
                        >
                          {action.action === "marked" ? (
                            <>
                              <Check className="status-icon" />
                              Marked
                            </>
                          ) : (
                            <>
                              <X className="status-icon" />
                              Unmarked
                            </>
                          )}
                        </span>
                      </td>
                      <td className="text-start font-medium">{action.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">
                      No actions performed today yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attendance Summary Table */}
        <div className="attendance-table-card">
          <div className="mark-attendance-card-header">
            <CalendarCheck className="card-icon" />
            <h3 className="card-title">Attendance Summary</h3>
          </div>

          <div className="table-container">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Total Classes</th>
                  <th>Present</th>
                  <th>Attendance %</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {subjects.length > 0 ? (
                  subjects.map((subject) => {
                    const subjectData = attendanceData?.subjects[subject] || {
                      total: 0,
                      present: 0,
                    };

                    const percentage =
                      subjectData.total > 0
                        ? (
                            (subjectData.present / subjectData.total) *
                            100
                          ).toFixed(1)
                        : "0.0";

                    const isLowAttendance = parseFloat(percentage) < 75;

                    return (
                      <tr key={subject}>
                        <td className="subject-cell">
                          <BookOpen className="subject-icon" />
                          <span>{subject}</span>
                        </td>
                        <td className="text-center font-medium">
                          {subjectData.total}
                        </td>
                        <td className="text-center font-medium text-green-600">
                          {subjectData.present}
                        </td>
                        <td className="text-center">
                          <span
                            className={`font-semibold px-2 py-1 rounded text-xs ${
                              isLowAttendance
                                ? "bg-red-50 text-red-700"
                                : "bg-green-50 text-green-700"
                            }`}
                          >
                            {percentage}%
                          </span>
                        </td>
                        <td className="text-center">
                          <span
                            className={`status-badge ${
                              isLowAttendance
                                ? "status-absent"
                                : "status-present"
                            }`}
                          >
                            {isLowAttendance ? (
                              <>
                                <X className="status-icon" />
                                Critical
                              </>
                            ) : (
                              <>
                                <Check className="status-icon" />
                                Good
                              </>
                            )}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      No subjects found for this student.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Overall Summary Stats */}
          <div className="summary-stats">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="summary-stat-card">
                <div className="summary-value text-blue-600">
                  {overallStats.percentage.toFixed(1)}%
                </div>
                <div className="summary-label">Overall Attendance</div>
              </div>
              <div className="summary-stat-card">
                <div className="summary-value text-green-600">
                  {overallStats.present}
                </div>
                <div className="summary-label">Total Present</div>
              </div>
              <div className="summary-stat-card">
                <div className="summary-value text-orange-600">
                  {overallStats.totalClasses}
                </div>
                <div className="summary-label">Total Classes</div>
              </div>
              <div className="summary-stat-card">
                <div
                  className={`summary-value ${
                    isOverallCritical ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {isOverallCritical ? "Critical" : "Good"}
                </div>
                <div className="summary-label">Status</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;
