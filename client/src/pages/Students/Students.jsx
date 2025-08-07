import React, { useState, useEffect } from 'react';
import './Students.css';
import Card from '../../components/Card/Card';
import {
  CalendarDays,
  ChartNoAxesCombined,
  NotebookPenIcon,
  ShieldAlert,
  User,
  UserCheck,
} from 'lucide-react';
import ControlSection from '../../components/ControlSection/ControlSection';
import AttendanceStatsChart from '../../components/AttendanceGraphAllStudents/AttendanceGraphAllStudents';
import StudentTable from '../../components/StudentTable/StudentTable';
import { filterStudents } from '../../utils/filterStudent';
import { useStudent } from '../../store/StudentContext';
// import { SUBJECTS } from '../../config/subjectConfig';

const Students = () => {
  const { allStudents } = useStudent();
  const [loading, setLoading] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState([]);

  // filter logic
  const [filters, setFilters] = useState({
    subject: '',
    fromDate: '',
    toDate: '',
    searchTerm: '',
    isCritical: ''
  });

  // Set filtered students initially
  useEffect(() => {
    setFilteredStudents(allStudents);
  }, [allStudents]);

  const handleSearch = () => {
    setLoading(true); // show loader
    setTimeout(() => {
      const result = filterStudents(allStudents, filters); // filters apply kar
      setFilteredStudents(result); // update table
      setLoading(false); // hide loader
    }, 1000); // simulate backend delay
  };

  // ----------- 📊 Calculations ------------
  const totalStudents = allStudents.length;

  const averageAttendance = totalStudents > 0
    ? Math.round(
        allStudents.reduce((sum, student) => sum + (student?.overall?.percentage || 0), 0) / totalStudents
      )
    : 0;

  const numberOfCriticalStudents = allStudents.filter(
    (student) => student?.overall?.percentage < 75
  ).length;

  const presentToday = allStudents.filter(
    (student) => student?.attendance?.[new Date().toDateString()] === 'present'
  ).length;

  const absentToday = totalStudents - presentToday;

  const criticalButAbsentCount = allStudents.filter(
    (student) =>
      student?.overall?.percentage < 75 &&
      student?.attendance?.[new Date().toDateString()] !== 'present'
  ).length;
  // ----------------------------------------

  return (
    <div className='students'>
      <div className="students-heading">
        🎓 Attendance Dashboard – All Students Overview
      </div>
      <hr className='text-gray-300' />

      <div className="stats-summary">
        <div className="stats-summary-heading">
          <ChartNoAxesCombined /> Stats Summary
        </div>
        <div className="stats-summary-cards-container">
          <Card icon={<User />} title={'Total Students'} desc={totalStudents} style={'text-center bg-white'} />
          <Card icon={<UserCheck />} title={'Avg Attendance %'} desc={averageAttendance} style={'text-center bg-white'} />
          <Card icon={<CalendarDays />} title={'Today’s Attendance'} desc={presentToday} style={'text-center bg-white'} />
          <Card icon={<ShieldAlert />} title={'Critical (<75%)'} desc={numberOfCriticalStudents} style={'text-center text-red-500 bg-white'} />
        </div>
      </div>

      <div className="overall-attendance-graph px-4">
        <AttendanceStatsChart
          totalStudents={totalStudents}
          presentToday={presentToday}
          absentToday={absentToday}
          numberOfCriticalStudents={numberOfCriticalStudents}
          criticalAndAbsent={criticalButAbsentCount}
        />
      </div>

      <hr className='text-gray-300' />

      <div className="font-light text-blue-950 flex flex-col justify-between items-center text-center gap-2.5 text-3xl">
        <NotebookPenIcon /> Records
      </div>

      <div className="control-and-filter-section">
        {/* Uncomment when ControlSection is working */}
        {/* <ControlSection
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
          subjects={SUBJECTS}
        /> */}
      </div>

      <div className="student-table">
        <StudentTable students={filteredStudents} loading={loading} />
      </div>
    </div>
  );
};

export default Students;
