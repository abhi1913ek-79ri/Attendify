import React from 'react';
import './StudentTable.css';
import { AlertTriangle, SmileIcon } from 'lucide-react';
import Loader from '../Loader/Loader';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

const StudentTable = ({ students, loading }) => {
    const navigate = useNavigate();
    
    return (
  <div className="w-full overflow-x-auto">
    <div id="table" className="min-w-full shadow-md border border-gray-200">
      <table className="min-w-[800px] w-full divide-y divide-gray-300 text-left table-auto border-collapse">
        <thead className="text-[#F9F9FB] bg-blue-950">
          <tr>
            <th className="table-rows">#</th>
            <th className="table-rows">Name</th>
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
            {students.map((student, index) => (
              <tr
                onClick={() => navigate(`/student/${student?.studentId}`)}
                key={uuidv4()}
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-[#aecaf5]'
                } cursor-pointer hover-scale-y-only`}
              >
                <td className="table-rows">{index + 1}</td>
                <td className="px-3 text-start">{student?.name}</td>
                <td className="table-rows">{student?.rollNo}</td>
                <td className="table-rows">{student?.overall?.totalClasses}</td>
                <td className="table-rows">{student?.overall?.present}</td>
                <td className="table-rows">{student?.overall?.percentage}%</td>
                <td className="table-rows">{student?.overall?.lastMarked}</td>
                <td className="text-center align-middle">
                  {student?.isCritical ? (
                    <AlertTriangle className="text-red-500 inline-block w-5 h-5" />
                  ) : (
                    <SmileIcon className="text-green-600 inline-block w-5 h-5" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
       ) )}
      </table>
    </div>
  </div>
)};


export default StudentTable;
