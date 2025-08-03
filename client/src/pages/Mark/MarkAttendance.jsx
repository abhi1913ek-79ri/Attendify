import React, { useState } from 'react';
import './MarkAttendance.css';
import { CalendarCheck, User, BookOpen, Calendar, Check, X, Clock } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useStudent } from '../../store/StudentContext';
import AuthPrompt from '../../components/AuthPrompt/AuthPrompt';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import useAutoUpdatingTodayDate from '../../utils/useAutoUpdatingTodayDate';
import { updateAttendanceRecord } from '../../utils/attendanceUtils';

const MarkAttendance = ({todaysActions, setTodaysActions}) => {
  const { isLoggedIn, user } = useAuth();
  const { students, dispatch } = useStudent();
  const today = useAutoUpdatingTodayDate();

  const [selectedDate, setSelectedDate] = useState(today);
  const [subjectDates, setSubjectDates] = useState({});

  // Agar user logged in nahi hai
  if (!isLoggedIn) {
    return (
      <div className="mark-attendance">
        <div className="page-header">
          <div className="header-content">
            <CalendarCheck className="header-icon" />
            <h2 className="header-title">Mark Attendance</h2>
          </div>
        </div>
        <div className="page-content">
          <AuthPrompt message={"Access Denied"} purpose={"mark your attendance"} />
        </div>
      </div>
    );
  }

  // Current student ka data
  const currentStudent = students.find((s) => s.id === user.id);

  if (!currentStudent) {
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

  // Add action to today's actions list
  const addTodaysAction = (subject, action, date) => {
    const timestamp = new Date().toLocaleTimeString();
    const newAction = {
      id: Date.now(),
      subject,
      action, // 'marked' or 'unmarked'
      date,
      timestamp
    };
    setTodaysActions(prev => [newAction, ...prev]);
  };

  // Individual subject date change handler
  const handleSubjectDateChange = (subject, date) => {
    setSubjectDates(prev => ({
      ...prev,
      [subject]: date
    }));
  };

  // Overall date change handler
  const handleOverallDateChange = (date) => {
    setSelectedDate(date);
    // Update all subject dates to the selected overall date
    const newSubjectDates = {};
    if (currentStudent.subjects && Array.isArray(currentStudent.subjects)) {
      currentStudent.subjects.forEach(subject => {
        newSubjectDates[subject] = date;
      });
    }
    setSubjectDates(newSubjectDates);
  };

  // Mark attendance function - FIXED VERSION
  const handleMarkAttendance = (subject) => {
    const dateToUse = subjectDates[subject] || selectedDate;

    // Get current subject attendance data
    const currentSubjectAttendance = currentStudent.attendance[subject] || {
      totalClasses: 0,
      present: 0,
      lastMarked: null,
      presentDates: []
    };

    // Check if already marked for this date
    if (currentSubjectAttendance.presentDates && currentSubjectAttendance.presentDates.includes(dateToUse)) {
      toast.error(`Attendance already marked for ${subject} on ${dateToUse}!`);
      return;
    }

    // Create updated attendance - FIXED: totalClasses bhi increment karo
    const updatedSubjectAttendance = {
      ...currentSubjectAttendance,
      totalClasses: (currentSubjectAttendance.totalClasses || 0) + 1, // YEH MISSING THA!
      present: (currentSubjectAttendance.present || 0) + 1,
      lastMarked: dateToUse,
      presentDates: [...(currentSubjectAttendance.presentDates || []), dateToUse].sort()
    };

    const updatedAttendance = {
      ...currentStudent.attendance,
      [subject]: updatedSubjectAttendance
    };

    // Dispatch to reducer
    dispatch({
      type: 'UPDATE_ATTENDANCE',
      payload: {
        id: currentStudent.id,
        attendance: updatedAttendance,
      },
    });

    // Add to today's actions list
    addTodaysAction(subject, 'marked', dateToUse);

    toast.success(`Attendance marked for ${subject}!`);
  };

  // Unmark attendance function - FIXED VERSION
  const handleUnmarkAttendance = (subject) => {
    const dateToUse = subjectDates[subject] || selectedDate;

    // Get current subject attendance data
    const currentSubjectAttendance = currentStudent.attendance[subject];

    if (!currentSubjectAttendance || !currentSubjectAttendance.presentDates) {
      toast.error('No attendance record found for this subject!');
      return;
    }

    // Check if attendance exists for this date
    if (!currentSubjectAttendance.presentDates.includes(dateToUse)) {
      toast.error(`No attendance found for ${subject} on ${dateToUse}!`);
      return;
    }

    // Remove the date from presentDates
    const updatedPresentDates = currentSubjectAttendance.presentDates.filter(date => date !== dateToUse);

    // Create updated attendance - FIXED: totalClasses bhi decrement karo
    const updatedSubjectAttendance = {
      ...currentSubjectAttendance,
      totalClasses: Math.max(0, (currentSubjectAttendance.totalClasses || 0) - 1), // YEH BHI MISSING THA!
      present: Math.max(0, (currentSubjectAttendance.present || 0) - 1),
      presentDates: updatedPresentDates,
      lastMarked: updatedPresentDates.length > 0 ? updatedPresentDates[updatedPresentDates.length - 1] : null
    };

    const updatedAttendance = {
      ...currentStudent.attendance,
      [subject]: updatedSubjectAttendance
    };

    // Dispatch to reducer
    dispatch({
      type: 'UPDATE_ATTENDANCE',
      payload: {
        id: currentStudent.id,
        attendance: updatedAttendance,
      },
    });

    // Add to today's actions list
    addTodaysAction(subject, 'unmarked', dateToUse);

    toast.success(`Attendance unmarked for ${subject}!`);
  };

  // Check if attendance is marked for a subject on a specific date
  const isAttendanceMarked = (subject, date) => {
    const subjectAttendance = currentStudent.attendance[subject];
    // Check if subject attendance exists and has presentDates array
    if (!subjectAttendance || !Array.isArray(subjectAttendance.presentDates)) {
      return false;
    }
    return subjectAttendance.presentDates.includes(date);
  };

  // Calculate overall attendance - HELPER FUNCTION
  const calculateOverallAttendance = () => {
    if (!currentStudent.subjects || !Array.isArray(currentStudent.subjects)) {
      return { totalClasses: 0, present: 0, percentage: 0 };
    }

    let totalClasses = 0;
    let totalPresent = 0;

    currentStudent.subjects.forEach(subject => {
      const subjectAttendance = currentStudent.attendance[subject];
      if (subjectAttendance) {
        totalClasses += subjectAttendance.totalClasses || 0;
        totalPresent += subjectAttendance.present || 0;
      }
    });

    const percentage = totalClasses > 0 ? (totalPresent / totalClasses) * 100 : 0;

    return {
      totalClasses,
      present: totalPresent,
      percentage
    };
  };

  // Calculate overall stats
  const overallStats = calculateOverallAttendance();
  const isOverallCritical = overallStats.percentage < 75;

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
              <span className="info-value">{user.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Student ID</span>
              <span className="info-value">{user.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Total Subjects</span>
              <span className="info-value">{currentStudent.subjects?.length || 0}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Overall Attendance</span>
              <span className="info-value">
                {overallStats.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Status</span>
              <span className={`info-value ${isOverallCritical ? 'text-red-600' : 'text-green-600'}`}>
                {isOverallCritical ? '⚠️ Critical' : '✅ Good'}
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
                {currentStudent.subjects && Array.isArray(currentStudent.subjects) ?
                  currentStudent.subjects.map((subject) => {
                    const currentDate = subjectDates[subject] || selectedDate;
                    const isMarked = isAttendanceMarked(subject, currentDate);

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
                            onChange={(e) => handleSubjectDateChange(subject, e.target.value)}
                            className="table-date-input"
                            max={today}
                          />
                        </td>
                        <td className="status-cell">
                          <span className={`status-badge ${isMarked ? 'status-present' : 'status-absent'}`}>
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
                  }) : (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-gray-500">
                        No subjects found for this student.
                      </td>
                    </tr>
                  )
                }
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
                {todaysActions.length > 0 ?
                  todaysActions.map((action) => (
                    <tr key={action.id}>
                      <td className="font-mono text-sm">
                        {action.timestamp}
                      </td>
                      <td className="subject-cell">
                        <BookOpen className="subject-icon" />
                        <span>{action.subject}</span>
                      </td>
                      <td className="text-start">
                        <span className={`status-badge ${action.action === 'marked' ? 'status-present' : 'status-absent'}`}>
                          {action.action === 'marked' ? (
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
                      <td className="text-start font-medium">
                        {action.date}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-gray-500">
                        No actions performed today yet.
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* Attendance Summary Table - Overall Stats */}
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
                  <th>Last Marked</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentStudent.subjects && Array.isArray(currentStudent.subjects) ?
                  currentStudent.subjects.map((subject) => {
                    const subjectAttendance = currentStudent.attendance[subject] || {
                      totalClasses: 0,
                      present: 0,
                      lastMarked: null,
                      presentDates: []
                    };

                    const percentage = subjectAttendance.totalClasses > 0
                      ? ((subjectAttendance.present / subjectAttendance.totalClasses) * 100).toFixed(1)
                      : '0.0';

                    const isLowAttendance = parseFloat(percentage) < 75;

                    return (
                      <tr key={subject}>
                        <td className="subject-cell">
                          <BookOpen className="subject-icon" />
                          <span>{subject}</span>
                        </td>
                        <td className="text-center font-medium">
                          {subjectAttendance.totalClasses}
                        </td>
                        <td className="text-center font-medium text-green-600">
                          {subjectAttendance.present}
                        </td>
                        <td className="text-center">
                          <span className={`font-semibold px-2 py-1 rounded text-xs ${isLowAttendance ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                            {percentage}%
                          </span>
                        </td>
                        <td className="text-center text-sm text-gray-600">
                          {subjectAttendance.lastMarked || 'Never'}
                        </td>
                        <td className="text-center">
                          <span className={`status-badge ${isLowAttendance ? 'status-absent' : 'status-present'}`}>
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
                  }) : (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-500">
                        No subjects found for this student.
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>

          {/* Overall Summary Stats - FIXED VERSION */}
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
                <div className={`summary-value ${isOverallCritical ? 'text-red-600' : 'text-green-600'}`}>
                  {isOverallCritical ? 'Critical' : 'Good'}
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