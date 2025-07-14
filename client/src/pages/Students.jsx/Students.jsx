import React from 'react'
import './Students.css'
import Card from '../../components/Card/Card'
import { CalendarDays, ChartNoAxesCombined, ShieldAlert, User, UserCheck } from 'lucide-react'
import ControlSection from '../../components/ControlSection/ControlSection'
import AttendanceStatsChart from '../../components/AttendanceGraphAllStudents/AttendanceGraphAllStudents'

const Students = () => {
  return (
    <div className='students'>
      <div className="students-heading text-blue-500">
        🎓 Attendance Dashboard – All Students Overview
      </div>
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
      <div className="control-section">
        <ControlSection />
      </div>
    </div>
  )
}

export default Students
