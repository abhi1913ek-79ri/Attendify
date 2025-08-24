import React, { useState, useEffect, useMemo } from "react";
import { SUBJECT_NAMES } from "../../config/subjectConfig";
import "./Students.css";
import Card from "../../components/Card/Card";
import {
  CalendarDays,
  ChartNoAxesCombined,
  NotebookPenIcon,
  ShieldAlert,
  User,
  UserCheck,
} from "lucide-react";
import ControlSection from "../../components/ControlSection/ControlSection";
import AttendanceStatsChart from "../../components/AttendanceGraphAllStudents/AttendanceGraphAllStudents";
import StudentTable from "../../components/StudentTable/StudentTable";
import StudentsLoader from "../../components/StudentsLoader/StudentsLoader";
import { filterStudents } from "../../utils/filterStudent";
import { useAllStudentsAttendance } from "../../store/AllStudentsAttendanceContext";

const Students = () => {
  const { 
    allStudentsAttendance, 
    isLoading: isLoadingAttendance, 
    stats,
    fetchAllStudentsAttendance 
  } = useAllStudentsAttendance();
  
  const [loading, setLoading] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState([]);
  
  // Build subjects list: prefer static catalog names; fallback to dynamic unique subjects from backend
  const subjectsOptions = useMemo(() => {
    if (Array.isArray(SUBJECT_NAMES) && SUBJECT_NAMES.length > 0) {
      return SUBJECT_NAMES;
    }
    const set = new Set();
    (allStudentsAttendance || []).forEach((stu) => {
      (stu.subjects || []).forEach((s) => set.add(s));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allStudentsAttendance]);

  // filter logic
  const [filters, setFilters] = useState({
    subject: "",
    fromDate: "",
    toDate: "",
    searchTerm: "",
    isCritical: "",
  });

  useEffect(() => {
    fetchAllStudentsAttendance(true);
  }, []);

  useEffect(() => {
    if (allStudentsAttendance && allStudentsAttendance.length > 0) {
      setFilteredStudents(allStudentsAttendance);
    }
  }, [allStudentsAttendance]);

  const handleSearch = () => {
    setLoading(true);
    const result = filterStudents(allStudentsAttendance, filters);
    setFilteredStudents(result);
    setLoading(false);
  };

  const handleReset = () => {
    setFilters({
      subject: "",
      fromDate: "",
      toDate: "",
      searchTerm: "",
      isCritical: "",
    });
    setFilteredStudents(allStudentsAttendance || []);
  };

  // Refresh button handler
  const handleRefresh = () => {
    fetchAllStudentsAttendance(true); // Force refresh
  };

  return (
    <div className="students">
      <div className="students-heading">
        🎓 Attendance Dashboard – All Students Overview
      </div>
      <hr className="text-gray-300" />
    {isLoadingAttendance ? (
      <StudentsLoader />
    ) : (
      <>
        <div className="stats-summary">
          <div className="stats-summary-heading">
            <ChartNoAxesCombined /> Stats Summary
          </div>
          <div className="stats-summary-cards-container">
            <Card
              icon={<User />}
              title={"Total Students"}
              desc={stats.totalStudents}
              style={"text-center bg-white"}
            />
            <Card
              icon={<UserCheck />}
              title={"Avg Attendance %"}
              desc={`${stats.averageAttendance}%`}
              style={"text-center bg-white"}
            />
            <Card
              icon={<CalendarDays />}
              title={"Today's Attendance"}
              desc={`${stats.presentToday}/${stats.totalStudents}`}
              style={"text-center bg-white"}
            />
            <Card
              icon={<ShieldAlert />}
              title={"Critical (<75%)"}
              desc={stats.criticalStudents}
              style={"text-center text-red-500 bg-white"}
            />
          </div>
        </div>

        <div className="overall-attendance-graph px-4">
          <AttendanceStatsChart
            totalStudents={stats.totalStudents}
            presentToday={stats.presentToday}
            absentToday={stats.absentToday}
            numberOfCriticalStudents={stats.criticalStudents}
            criticalAndAbsent={stats.criticalAndAbsent}
          />
        </div>

        <hr className="text-gray-300" />

        <div className="font-light text-blue-950 flex flex-col justify-between items-center text-center gap-2.5 text-3xl">
          <NotebookPenIcon /> Records
        </div>

        <div className="control-and-filter-section">
          <ControlSection
            filters={filters}
            setFilters={setFilters}
            onSearch={handleSearch}
            onReset={handleReset}
            onRefresh={handleRefresh}
            isSearching={loading}
            isRefreshing={isLoadingAttendance}
            subjects={subjectsOptions}
          />
        </div>

        <div className="student-table">
          <StudentTable
            students={filteredStudents}
            loading={loading || isLoadingAttendance}
          />
        </div>
      </>
    )}
    </div>
  );
};

export default Students;