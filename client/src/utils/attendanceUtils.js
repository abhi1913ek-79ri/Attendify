// utils/attendanceUtils.js
export function markStudentAttendance({ student, subject, isPresent,today }) {
  const current = student.attendance[subject] || { totalClasses: 0, present: 0 };

  return {
    ...student.attendance,
    [subject]: {
      ...current,
      totalClasses: current.totalClasses + 1,
      present: current.present + (isPresent ? 1 : 0),
      lastMarked: today,
    },
  };
}

// attendanceUtils.js
import { SUBJECTS } from "../config/subjectConfig.js";


// Creates a blank attendance object for all subjects
export const createEmptyAttendance = () => {
  const attendance = {};
  SUBJECTS.forEach((subject) => {
    attendance[subject] = {
      totalDays: 0,
      present: 0,
      percentage: 0,
      lastMarked: "",
    };
  });
  return attendance;
};