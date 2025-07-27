// utils/attendanceUtils.js
export const updateAttendanceRecord = (attendance, subject, today) => {
  if (!subject) {
    return { error: "⚠️ Please select a subject." };
  }

  if (attendance[subject]?.lastMarked === today) {
    return { error: "Attendance already marked for today." };
  }

  const oldPresentDates = attendance[subject]?.presentDates || [];

  return {
    ...attendance,
    [subject]: {
      ...attendance[subject],
      totalClasses: (attendance[subject]?.totalClasses || 0) + 1,
      present: (attendance[subject]?.present || 0) + 1,
      lastMarked: today,
      presentDates: [...oldPresentDates, today] 
    },
  };
};


// attendanceUtils.js
import { SUBJECTS } from "../config/subjectConfig.js";


// Creates a blank attendance object for all subjects
export const createEmptyAttendance = () => {
  const attendance = {};
  SUBJECTS.forEach((subject) => {
    attendance[subject] = {
      totalClasses: 0,
      present: 0,
      percentage: 0,
      lastMarked: "",
      presentDates: []  // new field
    };
  });
  return attendance;
};
