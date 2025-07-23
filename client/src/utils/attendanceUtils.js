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
