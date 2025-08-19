import { createContext, useContext, useEffect, useState } from 'react';
import { API_PATHS } from '../utils/ApiPaths';
import axiosInstance from '../utils/axiosInstance';

const AllStudentsAttendanceContext = createContext();

export const AllStudentsAttendanceProvider = ({ children }) => {
  // Aggregated list used by Students page and ControlSection
  const [allStudentsAttendance, setAllStudentsAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState(null);

  // Helper: normalize date keys from attendance.daily to an ISO (YYYY-MM-DD) string array of present dates
  const extractPresentDates = (dailyObj) => {
    if (!dailyObj || typeof dailyObj !== 'object') return [];
    const dates = [];
    for (const [rawKey, status] of Object.entries(dailyObj)) {
      if (status !== 'present') continue;
      // rawKey could be 'YYYY-MM-DD', 'Wed Aug 14 2025', or 'Subject_YYYY-MM-DD'
      let key = rawKey;
      if (rawKey.includes('_')) {
        const parts = rawKey.split('_');
        key = parts[parts.length - 1];
      }
      let d = new Date(key);
      if (isNaN(d.getTime())) {
        // try parsing as toDateString by re-parsing
        try {
          d = new Date(Date.parse(key));
        } catch (_) {}
      }
      if (!isNaN(d.getTime())) {
        // Format to YYYY-MM-DD
        const iso = d.toISOString().slice(0, 10);
        dates.push(iso);
      }
    }
    // Unique + sorted desc
    return Array.from(new Set(dates)).sort((a, b) => new Date(b) - new Date(a));
  };

  // Fetch attendance data for all students
  const fetchAllStudentsAttendance = async (forceRefresh = false) => {
    // Avoid unnecessary API calls unless forced or first time (cache 5 min)
    if (!forceRefresh && allStudentsAttendance.length > 0 && lastFetched && (Date.now() - lastFetched < 5 * 60 * 1000)) {
      return;
    }

    try {
      setIsLoading(true);

      // 1) Fetch all students from backend
      const studentsRes = await axiosInstance.get(API_PATHS.STUDENT.GET_ALL_STUDENTS);
      const students = Array.isArray(studentsRes.data) ? studentsRes.data : [];

      // 2) For each student, fetch attendance and adapt to the shape expected by existing filters/UI
      const aggregated = await Promise.all(
        students.map(async (stu) => {
          try {
            const sid = stu.rollNo || stu._id;
            const url = API_PATHS.ATTENDANCE.GET_ATTENDANCE.replace(':rollNo', sid);
            const { data: att } = await axiosInstance.get(url);

            const dailyObj = att?.daily || {};
            const presentDates = extractPresentDates(dailyObj);
            const lastMarked = presentDates.length > 0 ? presentDates[0] : '';

            // subjects: existing filter expects an array of subject names
            const subjectsArray = Object.keys(stu?.subjects || {});

            // overall stats
            const overall = att?.overall || { present: 0, total: 0, percentage: 0 };
            // If percentage missing, compute from subjects map totals
            let percentage = Number(overall.percentage) || 0;
            let present = Number(overall.present) || 0;
            let total = Number(overall.total) || 0;
            if (!overall || (overall && (isNaN(percentage) || total === 0))) {
              // try compute from att.subjects
              const subjMap = att?.subjects || {};
              let p = 0, t = 0;
              for (const sname of Object.keys(subjMap)) {
                const sdata = subjMap[sname] || {};
                p += Number(sdata.present) || 0;
                t += Number(sdata.total) || 0;
              }
              present = p;
              total = t;
              percentage = t > 0 ? (p / t) * 100 : 0;
            }

            return {
              _id: stu._id,
              name: stu.name,
              course: stu.course,
              rollNo: sid,
              subjects: subjectsArray,
              // daily attendance object kept for today checks/stats
              attendance: dailyObj,
              // Keep raw attendance payload if needed elsewhere
              attendanceData: att,
              overall: {
                present,
                total,
                percentage: Number(percentage.toFixed ? percentage.toFixed(2) : percentage),
                lastMarked,
              },
              isCritical: Number(percentage) < 75,
            };
          } catch (err) {
            console.error(`Error fetching attendance for student ${stu?._id}:`, err?.message);
            // fallback to default shape so filters/UI don't break
            const subjectsArray = Object.keys(stu?.subjects || {});
            return {
              _id: stu._id,
              name: stu.name,
              course: stu.course,
              rollNo: stu.rollNo || stu._id,
              subjects: subjectsArray,
              attendance: {},
              attendanceData: {
                student: stu._id,
                daily: {},
                subjects: {},
                overall: { present: 0, total: 0, percentage: 0 },
              },
              overall: { present: 0, total: 0, percentage: 0, lastMarked: '' },
              isCritical: false,
            };
          }
        })
      );

      setAllStudentsAttendance(aggregated);
      setLastFetched(Date.now());
    } catch (error) {
      console.error('Error fetching all students attendance:', error);
      setAllStudentsAttendance([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchAllStudentsAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate aggregate statistics
  const calculateStats = () => {
    const totalStudents = allStudentsAttendance.length;
    
    if (totalStudents === 0) {
      return {
        totalStudents: 0,
        averageAttendance: 0,
        criticalStudents: 0,
        presentToday: 0,
        absentToday: 0,
        criticalAndAbsent: 0
      };
    }

    // We'll consider both ISO and toDateString for robustness
    const today = new Date();
    const todayIso = today.toISOString().slice(0, 10);
    const todayToStr = today.toDateString();
    
    const averageAttendance = Math.round(
      allStudentsAttendance.reduce((sum, student) => sum + (Number(student?.overall?.percentage) || 0), 0) / totalStudents
    );

    const criticalStudents = allStudentsAttendance.filter((student) => Number(student?.overall?.percentage || 0) < 75).length;

    const presentToday = allStudentsAttendance.filter((student) => {
      const att = student?.attendance || {};
      // match either exact key or any key that normalizes to today's ISO
      if (att[todayToStr] === 'present') return true;
      for (const [k, v] of Object.entries(att)) {
        if (v !== 'present') continue;
        let key = k.includes('_') ? k.split('_').pop() : k;
        const iso = new Date(key);
        if (!isNaN(iso.getTime()) && iso.toISOString().slice(0, 10) === todayIso) return true;
      }
      return false;
    }).length;

    const absentToday = totalStudents - presentToday;

    const criticalAndAbsent = allStudentsAttendance.filter((student) => {
      const isCrit = Number(student?.overall?.percentage || 0) < 75;
      if (!isCrit) return false;
      const att = student?.attendance || {};
      if (att[todayToStr] === 'present') return false;
      // Check normalized keys
      for (const [k, v] of Object.entries(att)) {
        if (v !== 'present') continue;
        let key = k.includes('_') ? k.split('_').pop() : k;
        const iso = new Date(key);
        if (!isNaN(iso.getTime()) && iso.toISOString().slice(0, 10) === todayIso) return false;
      }
      return true;
    }).length;

    return {
      totalStudents,
      averageAttendance,
      criticalStudents,
      presentToday,
      absentToday,
      criticalAndAbsent
    };
  };

  const stats = calculateStats();

  // Update attendance for a specific student
  const updateStudentAttendance = (rollNo, attendanceData) => {
    setAllStudentsAttendance((prev) =>
      prev.map((student) => {
        const matches = student._id === rollNo || student.rollNo === rollNo;
        if (!matches) return student;

        const dailyObj = attendanceData?.daily || {};
        const presentDates = extractPresentDates(dailyObj);
        const lastMarked = presentDates.length > 0 ? presentDates[0] : '';
        const overall = attendanceData?.overall || { present: 0, total: 0, percentage: 0 };
        const percentage = Number(overall?.percentage) || 0;

        return {
          ...student,
          attendanceData,
          attendance: dailyObj,
          overall: {
            present: Number(overall.present) || 0,
            total: Number(overall.total) || 0,
            percentage,
            lastMarked,
          },
          isCritical: percentage < 75,
        };
      })
    );
  };

  const contextValue = {
    allStudentsAttendance,
    isLoading,
    stats,
    fetchAllStudentsAttendance,
    updateStudentAttendance,
    lastFetched
  };

  return (
    <AllStudentsAttendanceContext.Provider value={contextValue}>
      {children}
    </AllStudentsAttendanceContext.Provider>
  );
};

export const useAllStudentsAttendance = () => {
  const context = useContext(AllStudentsAttendanceContext);
  if (!context) {
    throw new Error('useAllStudentsAttendance must be used within AllStudentsAttendanceProvider');
  }
  return context;
};