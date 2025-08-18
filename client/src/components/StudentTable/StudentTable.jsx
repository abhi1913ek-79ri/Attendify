import React from 'react';
import './StudentTable.css';
import { AlertTriangle, SmileIcon } from 'lucide-react';
import Loader from '../Loader/Loader';
import ProfileImage from '../ProfileImage/ProfileImage';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

const StudentTable = ({ students, loading }) => {
  const navigate = useNavigate();

const getLastMarkedDate = (attendance) => {
  console.log('Attendance data:', attendance);
  if (!attendance || Object.keys(attendance).length === 0) {
    return 'Never';
  }

  // Extract date part after last underscore from each key
  const dates = Object.keys(attendance)
    .map(key => {
      const parts = key.split('_');
      return parts[parts.length - 1]; // get date string like "2025-08-12"
    })
    .filter(dateStr => !isNaN(new Date(dateStr))) // filter out invalid dates
    .sort((a, b) => new Date(b) - new Date(a)); // descending order

  if (dates.length === 0) {
    return 'Never';
  }

  const lastDate = new Date(dates[0]);
  return lastDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

  // Helper function to determine if student is critical
  const getIsCritical = (student) => {
    const percentage = student?.overall?.percentage || 0;
    return percentage < 75;
  };

  // Prepare students sorted by attendance percentage (descending) without mutating the prop
  const sortedStudents = Array.isArray(students)
    ? [...students].sort((a, b) => {
        const pa = Number(a?.overall?.percentage ?? 0);
        const pb = Number(b?.overall?.percentage ?? 0);
        return pb - pa;
      })
    : [];

  return (
    <div className="w-full overflow-x-auto">
      <div id="table" className="min-w-full shadow-md border border-gray-200">
        <table className="min-w-[800px] w-full divide-y divide-gray-300 text-left table-auto border-collapse">
          <thead className="text-[#F9F9FB] bg-blue-950">
            <tr>
              <th className="table-rows">#</th>
              <th className="table-rows">Student</th>
              <th className="table-rows">Roll No</th>
              <th className="table-rows">Total Days</th>
              <th className="table-rows">Present</th>
              <th className="table-rows">%</th>
              <th className="table-rows">Last Marked</th>
              <th className="table-rows">Critical?</th>
            </tr>
          </thead>
          {loading ? (
            <tbody className="no-scroll-loader w-full ">
              <tr>
                <td colSpan="8" className="py-10">
                  <Loader />
                </td>
              </tr>
            </tbody>
          ) : (students.length === 0 ? (
            <tbody>
              <tr>
                <td id="no-record" colSpan="8" className="py-6 text-center text-gray-500">
                  No matching records found.
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="divide-y divide-gray-200 bg-white">
              {sortedStudents.map((student, index) => {
                const isCritical = getIsCritical(student);
                const lastMarked = getLastMarkedDate(student?.attendance);

                return (
                  <tr
                    onClick={() => navigate(`/student/${student?.studentId || student?._id}`)}
                    key={student?._id || student?.studentId || uuidv4()}
                    className={`${
                      index % 2 === 0 ? 'bg-white' : 'bg-[#aecaf5]'
                    } cursor-pointer hover-scale-y-only`}
                  >
                    <td className="table-rows">{index + 1}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center space-x-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{student?.name || 'N/A'}</span>
                          <span className="text-sm text-gray-500">{student?.studentId || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="table-rows">{student?.rollNo || 'N/A'}</td>
                    <td className="table-rows">{student?.overall?.total || 0}</td>
                    <td className="table-rows">{student?.overall?.present || 0}</td>
                    <td className="table-rows">
                      {student?.overall?.percentage 
                        ? `${Math.round(student.overall.percentage)}%` 
                        : '0%'
                      }
                    </td>
                    <td className="table-rows">{lastMarked}</td>
                    <td className="text-center align-middle">
                      {isCritical ? (
                        <AlertTriangle className="text-red-500 inline-block w-5 h-5" />
                      ) : (
                        <SmileIcon className="text-green-600 inline-block w-5 h-5" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
};

export default StudentTable;