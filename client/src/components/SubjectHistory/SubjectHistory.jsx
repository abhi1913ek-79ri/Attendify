import React from 'react';
import './SubjectHistory.css';
import StudentHeatmapCalendar from '../StudentCalendar/StudentHeatmapCalendar';

const SubjectHistory = ({ student, attendanceData}) => {

  const getPresentDatesForSubject = (subjectName) => {
    if (!attendanceData?.daily) return [];

    const dailyData = attendanceData.daily instanceof Map
      ? Object.fromEntries(attendanceData.daily)
      : attendanceData.daily;

    return Object.entries(dailyData || {})
      .filter(([key, status]) => key.startsWith(`${subjectName}_`) && status === 'present')
      .map(([key]) => key.split('_')[1])
      .sort((a, b) => new Date(b) - new Date(a));
  };

  // Build the list of subjects to show.
  // Prefer subjects defined on the student. If attendance contains extra subject keys (stale), ignore them.
  const studentSubjects = student?.subjects
    ? (student.subjects instanceof Map ? Array.from(student.subjects.keys()) : Object.keys(student.subjects))
    : [];

  const attendanceSubjects = attendanceData?.subjects && typeof attendanceData.subjects === 'object'
    ? Object.keys(attendanceData.subjects).filter(s => studentSubjects.includes(s))
    : [];

  const subjectList = studentSubjects.length > 0 ? studentSubjects : Array.from(new Set([...attendanceSubjects]));

  if (subjectList.length === 0) {
    return <p>No subjects or attendance records found.</p>;
  }

  return (
    <div className="subject-wise-history">
      <h3 className="subject-wise-heading">Subject-wise Present Dates</h3>
      <div className="subject-wise-history-container">
        {subjectList.map((subjectName, idx) => {
          const presentDates = getPresentDatesForSubject(subjectName);
          // build a date -> status map for this subject (present/absent)
          const rawDaily = attendanceData?.daily;
          const dailyData = rawDaily instanceof Map
            ? Object.fromEntries(rawDaily)
            : rawDaily || {};
          const dateStatusMap = Object.entries(dailyData)
            .filter(([key]) => key.startsWith(`${subjectName}_`))
            .reduce((acc, [key, status]) => {
              const date = key.split('_')[1];
              acc[date] = status;
              return acc;
            }, {});

          return (
            <div
              id={`subject-${subjectName.replace(/\s+/g, '-')}`}
              className="subject-history"
              key={idx}
            >
              <h4 className="subject-title">{subjectName}</h4>
              <div className="overflow-x-auto rounded-lg">
                <table className="subject-table">
                  <thead className="subject-thead">
                    <tr>
                      <th className="subject-th w-[70px]">#</th>
                      <th className="subject-th">Present Dates</th>
                    </tr>
                  </thead>
                  <tbody>
                    {presentDates.map((date, i) => (
                      <tr key={i} className="hover-scale">
                        <td className="subject-td">{i + 1}</td>
                        <td className="subject-td">{date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="subject-wise-history-calender">
                <StudentHeatmapCalendar
                  presentDates={presentDates}
                  dateStatusMap={dateStatusMap}
                  title={`${subjectName} Attendance History`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectHistory;
