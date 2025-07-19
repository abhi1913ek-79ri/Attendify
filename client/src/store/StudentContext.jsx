import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { studentReducer } from "./StudenstReducer";
import STUDENT_ACTIONS from "./Actions";
import { dummyStudents } from "./dummyData";
import {
  avgAttendance,
  criticalStudentsFinder,
  todaysAttendanceFinder,
  getCriticalButAbsentStudents,
} from "../utils/studentPropertiesUtils.js";
import useAutoUpdatingTodayDate from "../utils/useAutoUpdatingTodayDate.js";


const StudentContext = createContext({
  students: [
    {
      id: '',
      name: '',
      rollNo: '',
      attendance: {
        totalDays: 0,
        present: 0,
        percentage: 0,
        lastMarked: '',
      },
      subjects: [],
      isCritical: false,
    },],
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
  dispatch: () => { },
});


export const StudentProvider = ({ children }) => {
  const [students, dispatch] = useReducer(studentReducer, []);
  const today = useAutoUpdatingTodayDate();
  console.log('today --> student - provider -p->',today);
  useEffect(() => {
    // Load dummy data on first render
    const dummyData = dummyStudents;
    dispatch({ type: STUDENT_ACTIONS.SET_STUDENTS, payload: dummyData });
  }, []);

  // Compute properties whenever `students` change
  const studentsProperties = useMemo(() => {
    console.log(today)
    const critical = criticalStudentsFinder(students);
    const todays = todaysAttendanceFinder(students,today);
    const criticalAbsent = getCriticalButAbsentStudents(students,today);
    const average = avgAttendance(students)

    return {
      average: average,
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
  }, [students,today]); // Recalculate when students change

  return (
    <StudentContext.Provider value={{ students, studentsProperties, dispatch }}>
      {children}
    </StudentContext.Provider>
  );
};

// Custom hook
export const useStudent = () => useContext(StudentContext);

export default StudentContext;