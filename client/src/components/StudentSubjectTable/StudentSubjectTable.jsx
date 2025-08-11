import React, { useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import './StudentSubjectTable.css'
import { useAttendance } from '../../store/AttendanceContext';

const StudentSubjectTable = ({ student , attendanceData, overallStats, isOverallCritical}) => {
    
    // Debug logs to see what data we're receiving
    console.log('StudentSubjectTable - student:', student);

    // Get subjects from student.subjects Map (keys are subject names)
    const getSubjectsList = () => {
        if (!student?.subjects) {
            console.log('No student subjects found');
            return [];
        }
        
        
        // Convert Map to array of subject names
        if (student.subjects instanceof Map) {
            const subjectArray = Array.from(student.subjects.keys());
            console.log('Subjects from Map:', subjectArray);
            return subjectArray;
        } else if (typeof student.subjects === 'object') {
            const subjectArray = Object.keys(student.subjects);
            console.log('Subjects from Object:', subjectArray);
            return subjectArray;
        }
        return [];
    };

    const subjects = getSubjectsList();

    // Get subject attendance record from attendanceData.subjects
    const getSubjectRecord = (subject) => {
        // Check if attendance data exists and has this subject
        if (attendanceData?.subjects) {
            // Handle both Map and Object structures
            if (attendanceData.subjects instanceof Map) {
                const record = attendanceData.subjects.get(subject);
                console.log(`Record for ${subject}:`, record);
                return record || { present: 0, total: 0 };
            } else if (typeof attendanceData.subjects === 'object') {
                const record = attendanceData.subjects[subject];
                return record || { present: 0, total: 0 };
            }
        }
        
        // Return default values if no attendance data found
        return {
            present: 0,
            total: 0
        };
    };

    // Function to get last marked date (most recent date when student was present)
  const getLastMarkedDate = () => {
  if (!attendanceData?.daily) {
    console.log('No daily attendance data found');
    return '-';
  }

  console.log('Daily attendance data:', attendanceData.daily);

  let dailyData = {};

  if (attendanceData.daily instanceof Map) {
    dailyData = Object.fromEntries(attendanceData.daily);
  } else if (typeof attendanceData.daily === 'object') {
    dailyData = attendanceData.daily;
  }

  // Extract date part from "subject_YYYY-MM-DD"
  const presentDates = Object.entries(dailyData)
    .filter(([key, status]) => status === 'present')
    .map(([key]) => key.split('_')[1]) // take only date
    .sort((a, b) => new Date(b) - new Date(a));

  console.log('Present dates:', presentDates);
  return presentDates.length > 0 ? presentDates[0] : '-';
};


    // Get the last marked date once for all subjects (since daily attendance is student-wide, not subject-specific)
    const lastMarkedDate = getLastMarkedDate();

    return (
        <div className="student-subject-list scrollbar-hide">
            <table id="student-subject-table" className="min-w-full text-left max-md:min-w-[600px] border-collapse">
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
                    {subjects.length > 0 && subjects.map((subject, index) => {
                        // Get attendance record for this subject
                        const record = getSubjectRecord(subject);
                        console.log(`Record for ${subject}:`, record);
                        
                        const percentage = record.total > 0 
                            ? ((record.present / record.total) * 100) 
                            : 0;
                        
                        console.log(`${subject} - Total: ${record.total}, Present: ${record.present}, Percentage: ${percentage}%`);
                        
                        return (
                            <tr key={subject}
                                className="cursor-pointer"
                                onClick={() => {
                                    const target = document.getElementById(`subject-${subject.replace(/\s+/g, '-')}`);
                                    if (target) {
                                        target.scrollIntoView({ behavior: 'instant' });
                                    }
                                }}>
                                <td className="table-data">{index + 1}</td>
                                <td className="table-data">{subject}</td>
                                <td className="table-data">{record.total ?? 0}</td>
                                <td className="table-data">{record.present ?? 0}</td>
                                <td className={`table-data ${percentage < 75 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}`}>
                                    {typeof percentage === 'number' ? `${percentage.toFixed(1)}%` : '0.0%'}
                                </td>
                                <td className="table-data">{lastMarkedDate}</td>
                            </tr>
                        );
                    })}
                    
                    <tr id="student-subject-total" key={uuidv4()}>
                        <td colSpan={2} className="table-data total"><span className="font-medium">Total</span></td>
                        <td className="table-data"><span className="font-medium">{overallStats?.totalClasses ?? 0}</span></td>
                        <td className="table-data"><span className="font-medium">{overallStats?.present ?? 0}</span></td>
                        <td className="table-data">
                            <span className={`font-medium ${isOverallCritical ? 'text-red-600' : 'text-blue-600'}`}>
                                {overallStats?.percentage !== undefined ? `${overallStats.percentage.toFixed(1)}%` : '0.0%'}
                            </span>
                        </td>
                        <td className="table-data">{lastMarkedDate}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default StudentSubjectTable;