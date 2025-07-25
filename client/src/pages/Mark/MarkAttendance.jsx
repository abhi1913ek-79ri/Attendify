import React, { useState } from 'react';
import './MarkAttendance.css';
import { CalendarCheck } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useStudent } from '../../store/StudentContext';
import AuthPrompt from '../../components/AuthPrompt/AuthPrompt';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import useAutoUpdatingTodayDate from '../../utils/useAutoUpdatingTodayDate';

const MarkAttendance = () => {
  const { isLoggedIn, user } = useAuth();
  const { students, dispatch } = useStudent();
  const today = useAutoUpdatingTodayDate(); // ✅ moved here

  const [selectedSubject, setSelectedSubject] = useState('');

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

  const handleMarkAttendance = () => {
    if (!selectedSubject) {
      toast.error('⚠️ Please select a subject.');
      return;
    }

    const attendance = { ...currentStudent.attendance };

    if (attendance[selectedSubject]?.lastMarked === today) {
      toast.error('Attendance already marked for today.');
      return;
    }

    attendance[selectedSubject] = {
      ...attendance[selectedSubject],
      totalClasses: (attendance[selectedSubject]?.totalClasses || 0) + 1,
      present: (attendance[selectedSubject]?.present || 0) + 1,
      lastMarked: today,
    };

    dispatch({
      type: 'UPDATE_ATTENDANCE',
      payload: {
        id: currentStudent.id,
        attendance,
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
