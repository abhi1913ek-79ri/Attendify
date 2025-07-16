import React from 'react'
import './Students.css'
import Card from '../../components/Card/Card'
import { CalendarDays, ChartNoAxesCombined, ShieldAlert, User, UserCheck } from 'lucide-react'
import ControlSection from '../../components/ControlSection/ControlSection'
import AttendanceStatsChart from '../../components/AttendanceGraphAllStudents/AttendanceGraphAllStudents'
import StudentTable from '../../components/StudentTable/StudentTable'

const students = [
  {
    id: 'stu001',
    name: 'Aarav Sharma',
    rollNo: '1001',
    attendance: {
      totalDays: 90,
      present: 82,
      percentage: 91.1,
      lastMarked: '2025-07-15',
    },
    subjects: ['Math', 'Science'],
    isCritical: false,
  },
  {
    id: 'stu002',
    name: 'Isha Mehra',
    rollNo: '1002',
    attendance: {
      totalDays: 90,
      present: 60,
      percentage: 66.7,
      lastMarked: '2025-07-15',
    },
    subjects: ['English', 'Science'],
    isCritical: true,
  },
  {
    id: 'stu003',
    name: 'Rahul Verma',
    rollNo: '1003',
    attendance: {
      totalDays: 90,
      present: 75,
      percentage: 83.3,
      lastMarked: '2025-07-15',
    },
    subjects: ['Math', 'English'],
    isCritical: false,
  },
  {
    id: 'stu004',
    name: 'Simran Kaur',
    rollNo: '1004',
    attendance: {
      totalDays: 90,
      present: 55,
      percentage: 61.1,
      lastMarked: '2025-07-15',
    },
    subjects: ['Science', 'Math'],
    isCritical: true,
  },
  {
    id: 'stu005',
    name: 'Kabir Joshi',
    rollNo: '1005',
    attendance: {
      totalDays: 90,
      present: 88,
      percentage: 97.8,
      lastMarked: '2025-07-15',
    },
    subjects: ['English', 'Science'],
    isCritical: false,
  },
];



const Students = () => {
  return (
    <div className='students'>
      <div className="students-heading">
        🎓 Attendance Dashboard – All Students Overview
      </div>
      <hr className='text-gray-300' />
      <div className="stats-summary">
        <div className="stats-summary-heading">
          <ChartNoAxesCombined />Stats Summary
        </div>
        <div className="stats-summary-cards-container">
          <Card icon={<User />} title={'Total Students'} desc={'100'} style={'text-center'} />
          <Card icon={<UserCheck />} title={'Avg Attendance %'} desc={'50 %'} style={'text-center'} />
          <Card icon={<CalendarDays />} title={'Today’s Attendance'} desc={'72 %'} style={'text-center'} />
          <Card icon={<ShieldAlert />} title={'Critical (<75%)'} desc={'32'} style={'text-center text-red-500'} />
        </div>
      </div>
      <div className="overall-attendance-graph mt-8 px-4">
        <AttendanceStatsChart />
      </div>
      <hr className='text-gray-300' />
      <div className="control-and-filter-section">
        <ControlSection />
      </div>
      <div className="student-table">
        <StudentTable students={students} />
      </div>
    </div>
  )
}

export default Students
