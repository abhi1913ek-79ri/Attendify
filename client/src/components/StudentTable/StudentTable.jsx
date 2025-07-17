import React from 'react';
import './StudentTable.css';
import { AlertTriangle, SmileIcon } from 'lucide-react';
import Loader from '../Loader/Loader';

const StudentTable = ({ students, loading }) => {
    return (
        <div id='table' className="overflow-x-auto  w-full shadow-md mt-4 border border-gray-200">
            <table className="min-w-full divide-y divide-gray-300  text-left max-md:min-w-[600px] table-auto border-collapse">
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
                    <tbody className='no-scroll-loader'>
                        <tr>
                            <td colSpan="8" className="py-10">
                                <Loader />
                            </td>
                        </tr>
                    </tbody>
                ) : students.length === 0 ? (
                    <tbody>
                        <tr>
                            <td id='no-record' colSpan="8" className="py-6 text-center text-gray-500">
                                No matching records found.
                            </td>
                        </tr>
                    </tbody>
                ) : (<tbody className="divide-y divide-gray-200 bg-white">
                    {students.map((student, index) => (
                        <tr key={student.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#EAF2FF]'}`}>
                            <td className="table-rows">{index + 1}</td>
                            <td className="px-3 text-start">{student.name}</td>
                            <td className="table-rows">{student.rollNo}</td>
                            <td className="table-rows">{student.attendance.totalDays}</td>
                            <td className="table-rows">{student.attendance.present}</td>
                            <td className="table-rows">{student.attendance.percentage}%</td>
                            <td className="table-rows">{student.attendance.lastMarked}</td>
                            <td className="text-center align-middle">
                                {student.isCritical ? (
                                    <AlertTriangle className="text-red-500 inline-block w-5 h-5" />
                                ) : (
                                    <SmileIcon className="text-green-600 inline-block w-5 h-5" />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
                )}
            </table>
        </div>
    );
};

export default StudentTable;
