import React, { useState } from 'react';
import './MarkAttendance.css';
import { CalendarCheck } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useStudent } from '../../store/StudentContext';
import AuthPrompt from '../../components/AuthPrompt/AuthPrompt';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import useAutoUpdatingTodayDate from '../../utils/useAutoUpdatingTodayDate';
import { updateAttendanceRecord } from '../../utils/attendanceUtils';

const MarkAttendance = () => {
  const { isLoggedIn, user } = useAuth();
  const { students, dispatch } = useStudent();
  const today = useAutoUpdatingTodayDate();

  const [selectedSubject, setSelectedSubject] = useState('');

  // Agar user logged in nahi hai
  if (!isLoggedIn) {
    return (
      <div className="mark-attendance">
        <div className="mark-attendance-heading flex items-center gap-2">
          <span className="text-3xl"><CalendarCheck /></span>
          <h2 className="text-xl font-semibold">Mark Attendance</h2>
        </div>
        <hr className="text-gray-300" />
        <AuthPrompt />
      </div>
    );
  }

  // Current student ka data
  const currentStudent = students.find((s) => s.name === user.name);

  if (!currentStudent) {
    return (
      <div className="mark-attendance">
        <div className="mark-attendance-heading flex items-center gap-2">
          <span className="text-3xl"><CalendarCheck /></span>
          <h2 className="text-xl font-semibold">Mark Attendance</h2>
        </div>
        <hr className="text-gray-300" />
        <div className="p-4 bg-red-100 rounded">
          <p>⚠️ You are logged in but not found in the student list.</p>
        </div>
      </div>
    );
  }

  // Attendance mark karne ka function
  const handleMarkAttendance = () => {
    // Utils ka function call
    const updatedAttendance = updateAttendanceRecord(
      { ...currentStudent.attendance },
      selectedSubject,
      today
    );

    // Agar error mila toh toast dikhao
    if (updatedAttendance.error) {
      toast.error(updatedAttendance.error);
      return;
    }

    // Dispatch to reducer
    dispatch({
      type: 'UPDATE_ATTENDANCE',
      payload: {
        id: currentStudent.id,
        attendance: updatedAttendance,
      },
    });

    toast.success('Attendance marked successfully!');
    setSelectedSubject('');
  };

  return (
    <div className="mark-attendance space-y-4">
      <div className="mark-attendance-heading flex items-center gap-2">
        <span className="text-3xl"><CalendarCheck /></span>
        <h2 className="text-xl font-semibold">Mark Attendance</h2>
      </div>
      <hr className="text-gray-300" />

      <div className="p-4 bg-green-100 rounded space-y-2">
        <p>✅ Logged in as <strong>{user.name}</strong>.</p>
        <p>Select a subject to mark attendance:</p>

        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="p-2 rounded border"
        >
          <option value="">-- Select Subject --</option>
          {currentStudent.subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>

        <button
          onClick={handleMarkAttendance}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Mark Attendance
        </button>
      </div>
    </div>
  );
};

export default MarkAttendance;
