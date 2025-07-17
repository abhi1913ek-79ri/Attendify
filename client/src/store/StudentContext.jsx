import { createContext, useContext, useEffect, useReducer } from "react";
import { studentReducer } from "./StudenstReducer";
import STUDENT_ACTIONS from "./Actions";
import { dummyStudents } from "./dummyData";


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
    },
  ],
  dispatch: () => {},
});


export const StudentProvider = ({ children }) => {
  const [students, dispatch] = useReducer(studentReducer, []);

  useEffect(() => {
    // Load dummy data on first render
    const dummyData = dummyStudents;
    dispatch({ type: STUDENT_ACTIONS.SET_STUDENTS, payload: dummyData });
  }, []);

  return (
    <StudentContext.Provider value={{ students, dispatch }}>
      {children}
    </StudentContext.Provider>
  );
};

// Custom hook
export const useStudent = () => useContext(StudentContext);

export default StudentContext;