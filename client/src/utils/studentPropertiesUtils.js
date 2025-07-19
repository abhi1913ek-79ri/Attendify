// functions
export const avgAttendance = (students) => {
    let total = 0;
    let count = 0;
    for (const student of students) {
        total += student.attendance.percentage;
        count++;
    }
    const average = count > 0 ? (total / count).toFixed(2) : 0;
    return average;
};

// Critical Students 
export const criticalStudentsFinder = (students) => {
    return students.filter(student => student.isCritical === true);
};
//Todays - Attendance
export const todaysAttendanceFinder = (students, today) => {
  return students.filter((student) => {
    return student.attendance.lastMarked === today;
  });
};


// critical and absent 
export function getCriticalButAbsentStudents(students, todayDateStr) {
    return students.filter(student =>
        student.isCritical && student.attendance.lastMarked !== todayDateStr
    );
}

export const todayDateStr = new Date().toISOString().split('T')[0];

