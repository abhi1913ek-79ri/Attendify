import React from 'react'
import './MarkAttendance.css'
import { CalendarCheck} from 'lucide-react'
import MarkAttendanceFilterSection from '../../components/MarkAttendanceFilterSection/MarkAttendanceFilterSection'
const MarkAttendance = () => {
  return (
    <div className='mark-attendance'>
      <div className="mark-attendance-heading">
        <span className='text-3xl'><CalendarCheck /></span>
        <h2>Mark Attendance</h2>
      </div>
      <hr className='text-gray-300' />
      <div className="mark-attendance-filter-section">
        <MarkAttendanceFilterSection />
      </div>
    </div>
  )
}

export default MarkAttendance
