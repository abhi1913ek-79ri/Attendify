import React from 'react'
import { v4 as uuidv4 } from 'uuid';
import './StudentSubjectTable.css'

const StudentSubjectTable = ({ student }) => {
    return (
        <div className="student-subject-list scrollbar-hide">
            <table id="student-subject-table" className="min-w-full  text-left max-md:min-w-[600px] border-collapse">
                <thead className="text-[#F9F9FB] bg-blue-950">
                    <tr>
                        <th className="table-data">#</th>
                        <th className="table-data">Subject</th>
                        <th className="table-data">Total Classes</th>
                        <th className="table-data">Present</th>
                        <th className="table-data">%</th>
                        <th className="table-data">Last Marked</th>

                    </tr>
                </thead>
                <tbody className=" bg-white ">
                    {student?.subjects?.length > 0 && student.subjects.map((subject, index) => {
                        const record = student.attendance[subject] || {};
                        return (
                            <tr key={subject}>
                                <td className="table-data">{index + 1}</td>
                                <td className="table-data">{subject}</td>
                                <td className="table-data">{record.totalClasses ?? '-'}</td>
                                <td className="table-data">{record.present ?? '-'}</td>
                                <td className={`table-data ${record.percentage < 75 ? 'text-red-600 font-semibold' : ''}`}>
                                    {typeof record.percentage === 'number' ? `${record.percentage.toFixed(1)}%` : '-'}
                                </td>
                                <td className="table-data">{record.lastMarked ?? '-'}</td>
                            </tr>
                        );
                    })}

                    <tr id="student-subject-total" key={uuidv4()}>
                        <td colSpan={2} className="table-data total"><span className="font-medium">Total</span></td>
                        <td className="table-data"><span className="font-medium">{student.overall.totalClasses}</span></td>
                        <td className="table-data"><span className="font-medium">{student.overall.present}</span></td>
                        <td className="table-data"><span className="font-medium">{student.overall.percentage}</span></td>
                        <td className="table-data"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default StudentSubjectTable
