import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { studentReducer } from "./StudenstReducer";
import STUDENT_ACTIONS from "./Actions";
import dummyStudents from "./dummyData";
import {
  avgAttendance,
  criticalStudentsFinder,
  todaysAttendanceFinder,
  getCriticalButAbsentStudents,
  enhanceStudentsWithOverall
} from "../utils/studentPropertiesUtils.js";
import useAutoUpdatingTodayDate from "../utils/useAutoUpdatingTodayDate.js";
import { createEmptyAttendance } from "../utils/attendanceUtils.js";

const StudentContext = createContext({
  students: [
    {
      id: '',
      name: '',
      rollNo: '',
      subjects: [], // Optional default: SUBJECTS
      attendance: createEmptyAttendance(),
      isCritical: false,
      overall: {
        totalClasses: 0,
        present: 0,
        percentage: 0,
      },
    },
  ],
  studentsProperties: {
    averageAttendance: 0,
    len: 0,
    criticalStudents: [],
    todaysAttendance: [],
    numberOfCriticalStudents: 0,
    numberOfTodaysAttendance: 0,
    presentToday: 0,
    absentToday: 0,
    criticalButAbsentStudents: [],
    criticalButAbsentCount: 0,
  },
  dispatch: () => {},
});

export const StudentProvider = ({ children }) => {
  const [rawStudents, dispatch] = useReducer(studentReducer, []);
  const today = useAutoUpdatingTodayDate();

  useEffect(() => {
    const dummyData = dummyStudents;
    dispatch({ type: STUDENT_ACTIONS.SET_STUDENTS, payload: dummyData });
  }, []);

  console.log('Raw - ',rawStudents)

  const students = useMemo(() => {
    const enhanced = enhanceStudentsWithOverall(rawStudents.map((s) => ({
      ...s,
      attendance: s.attendance || {},
    })));
    return enhanced;
  }, [rawStudents]);

  console.log('Enhanced : ',students);

  const studentsProperties = useMemo(() => {
    const critical = criticalStudentsFinder(students);
    const todays = todaysAttendanceFinder(students, today);
    const criticalAbsent = getCriticalButAbsentStudents(students, today);
    const average = avgAttendance(students);

    return {
      averageAttendance: average,
      len: students.length,
      criticalStudents: critical,
      todaysAttendance: todays,
      numberOfCriticalStudents: critical.length,
      numberOfTodaysAttendance: todays.length,
      presentToday: todays.length,
      absentToday: students.length - todays.length,
      criticalButAbsentStudents: criticalAbsent,
      criticalButAbsentCount: criticalAbsent.length,
    };
  }, [students, today]);

  return (
    <StudentContext.Provider value={{ students, studentsProperties, dispatch }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => useContext(StudentContext);

export default StudentContext;
