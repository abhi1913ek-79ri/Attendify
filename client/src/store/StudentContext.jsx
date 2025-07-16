import { createContext, useContext } from "react";
import { studentReducer } from "./StudenstReducer";
import STUDENT_ACTIONS from "./Actions";

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
    const dummyData = [
      {
        id: 'stu001',
        name: 'Abhishek Giri',
        rollNo: 'IT23US001',
        attendance: {
          totalDays: 100,
          present: 88,
          percentage: 88,
          lastMarked: '2025-07-16',
        },
        subjects: ['DBMS', 'OS'],
        isCritical: false,
      },
    ];
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