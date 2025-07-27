// utils/studentPropertiesUtils.js
import { SUBJECTS } from "../config/subjectConfig";

// Helper: Calculate subject-wise attendance percentage using totalClasses and present
const getStudentOverallAttendancePercentage = (attendance) => {
  let totalClasses = 0;
  let totalPresent = 0;

  for (const subject of Object.keys(attendance)) {
    const record = attendance[subject];
    if (record) {
      totalClasses += record.totalClasses;
      totalPresent += record.present;
    }
  }

  const percentage = totalClasses > 0 ? (totalPresent / totalClasses) * 100 : 0;
  return parseFloat(percentage.toFixed(2));
};

// ✅ Compute overall attendance stats for a student
const getStudentOverallStats = (attendance) => {
  let totalClasses = 0;
  let totalPresent = 0;
  let latestMarked = null;

  for (const subject of Object.keys(attendance)) {
    const record = attendance[subject];
    if (
      record &&
      typeof record.totalClasses === "number" &&
      typeof record.present === "number"
    ) {
      totalClasses += record.totalClasses;
      totalPresent += record.present;

      if (record.lastMarked) {
        const date = new Date(record.lastMarked);
        if (!latestMarked || date > new Date(latestMarked)) {
          latestMarked = date.toISOString().split('T')[0]; // keep only yyyy-mm-dd
        }
      }
    }
  }

  const percentage =
    totalClasses > 0
      ? parseFloat(((totalPresent / totalClasses) * 100).toFixed(2))
      : 0;

  return {
    totalClasses,
    present: totalPresent,
    percentage,
    lastMarked: latestMarked || null,
  };
};




// ✅ Average attendance of all students (subject-wise average per student)
export const avgAttendance = (students) => {
  let total = 0;
  let count = 0;

  for (const student of students) {
    total += getStudentOverallAttendancePercentage(student.attendance);
    count++;
  }

  const average = count > 0 ? (total / count).toFixed(2) : 0;
  return parseFloat(average);
};

// ✅ Critical Students
export const criticalStudentsFinder = (students) => {
  return students.filter((student) => student.isCritical === true);
};

export const todaysAttendanceFinder = (students, today) => {
  return students.filter((student) => {
    return Object.keys(student.attendance || {}).some(
      (subject) =>
        student.attendance?.[subject]?.lastMarked === today
    );
  });
};


// ✅ Critical but Absent (no subject marked today)
export function getCriticalButAbsentStudents(students, todayDateStr) {
  return students.filter((student) => {
    if (!student.isCritical) return false;

    const subjects = Object.keys(student.attendance || {});
    return subjects.every(
      (subject) =>
        !student.attendance?.[subject]?.lastMarked ||
        student.attendance[subject].lastMarked !== todayDateStr
    );
  });
}

// Merge all subject-wise presentDates into one overall list (deduplicated)
const getOverallPresentDates = (attendance) => {
  const dateSet = new Set();

  for (const subject of Object.keys(attendance)) {
    const dates = attendance[subject]?.presentDates || [];
    dates.forEach(date => dateSet.add(date));
  }

  return Array.from(dateSet).sort(); // return sorted array of dates
};



// ✅ Add overall attendance to each student
export const enhanceStudentsWithOverall = (students) => {
  return students.map((student) => {
    const enhancedAttendance = {};

    for (const subject of Object.keys(student.attendance || {})) {
      const record = student.attendance[subject];
      const percentage =
        record.totalClasses > 0
          ? parseFloat(((record.present / record.totalClasses) * 100).toFixed(2))
          : 0;

      enhancedAttendance[subject] = {
        ...record,
        percentage, // ✅ computed here
      };
    }

    const overall = getStudentOverallStats(enhancedAttendance);
    const presentDates = getOverallPresentDates(enhancedAttendance);
    const isCritical = overall.percentage < 75; // ✅ computed here

    return {
      ...student,
      attendance: enhancedAttendance,
      overall: {
        ...overall,
        presentDates, // ✅ placed under "overall"
      },
      isCritical,
    };
  });
};
