import React from 'react';
import './SubjectHistory.css'
import StudentHeatmapCalendar from '../StudentCalendar/StudentHeatmapCalendar';

const SubjectHistory = ({ student }) => {
    return (
        <div className="subject-wise-history">
            <h3 className="subject-wise-heading">Subject-wise Present Dates</h3>
            <div className="subject-wise-history-container">
                {Object.entries(student.attendance).map(([subjectName, data], idx) => (
                    <div id={`subject-${subjectName.replace(/\s+/g, '-')}`} className="subject-history" key={idx}>
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
                                    {data.presentDates.map((date, i) => (
                                        <tr key={i} className="hover-scale">
                                            <td className="subject-td">{i + 1}</td>
                                            <td className="subject-td">{date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="subject-wise-history-calender">
                            <StudentHeatmapCalendar presentDates={data.presentDates} title={` ${subjectName} Attendance History`}/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SubjectHistory
