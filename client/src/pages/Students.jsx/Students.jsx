import React, { useState } from 'react'
import './Students.css'
import Card from '../../components/Card/Card'
import { CalendarDays, ChartNoAxesCombined, ShieldAlert, User, UserCheck } from 'lucide-react'
import ControlSection from '../../components/ControlSection/ControlSection'
import AttendanceStatsChart from '../../components/AttendanceGraphAllStudents/AttendanceGraphAllStudents'
import StudentTable from '../../components/StudentTable/StudentTable'
import { filterStudents } from '../../utils/filterStudent'
import { dummyStudents } from '../../store/dummyData'
import { useStudent } from '../../store/StudentContext'
import studentsProperties from '../../utils/AllStundetsProperties'


const Students = () => {
  const {students} = useStudent();
  const [filteredStudents, setFilteredStudents] = useState(students);
  const [loading, setLoading] = useState(false);

  //filter logic
  const [filters, setFilters] = useState({
    subject: '',
    fromDate: '',
    toDate: '',
    searchTerm: '',
    isCritical:''
  });

  const handleSearch = () => {
  setLoading(true); // show loader

  setTimeout(() => {
    const result = filterStudents(students, filters); // filters apply kar
    setFilteredStudents(result); // update table
    setLoading(false); // hide loader
  },1000); // simulate backend delay
};

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
          <Card icon={<User />} title={'Total Students'} desc={studentsProperties.len} style={'text-center'} />
          <Card icon={<UserCheck />} title={'Avg Attendance %'} desc={studentsProperties.averageAttendance} style={'text-center'} />
          <Card icon={<CalendarDays />} title={'Today’s Attendance'} desc={studentsProperties.numberOfTodaysAttendance} style={'text-center'} />
          <Card icon={<ShieldAlert />} title={'Critical (<75%)'} desc={studentsProperties.numberOfCriticalStudents} style={'text-center text-red-500'} />
        </div>
      </div>
      <div className="overall-attendance-graph mt-8 px-4">
        <AttendanceStatsChart totalStudents={studentsProperties.len} presentToday={studentsProperties.presentToday} absentToday={studentsProperties.absentToday} numberOfCriticalStudents={studentsProperties.numberOfCriticalStudents} criticalAndAbsent={studentsProperties.criticalButAbsentCount}/>
      </div>
      <hr className='text-gray-300' />
      <div className="control-and-filter-section">
        <ControlSection
          filters={filters} setFilters={setFilters} onSearch={handleSearch}
        />

      </div>
      <div className="student-table">
        <StudentTable students={filteredStudents} loading={loading} />
      </div>
    </div>
  )
}

export default Students
