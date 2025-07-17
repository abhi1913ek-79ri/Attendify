import dummyStudents from "../store/dummyData";


// functions
const avgAttendance = (students) => {
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
const criticalStudentsFinder = (students) => {
    return students.filter(student => student.isCritical === true);
};
//Todays - Attendance
const todaysAttendanceFinder = (students) => {
    const today = new Date().toISOString().split('T')[0]; // Format: 'YYYY-MM-DD'

    return students.filter((student) => {
        return student.attendance.lastMarked === today;
    });
};

// critical and absent 
function getCriticalButAbsentStudents(students, todayDateStr) {
    return students.filter(student =>
        student.isCritical && student.attendance.lastMarked !== todayDateStr
    );
}

const students = dummyStudents;

const todayDateStr = new Date().toISOString().split('T')[0];

export const studentsProperties = {
    averageAttendance: avgAttendance(students),
    len: students.length,
    criticalStudents: criticalStudentsFinder(students),
    todaysAttendance: todaysAttendanceFinder(students),
    numberOfCriticalStudents: criticalStudentsFinder(students).length,
    numberOfTodaysAttendance: todaysAttendanceFinder(students).length,
    presentToday: todaysAttendanceFinder(students).length,
    absentToday: students.length - todaysAttendanceFinder(students).length,
    criticalButAbsentStudents: getCriticalButAbsentStudents(students, todayDateStr),
    criticalButAbsentCount: getCriticalButAbsentStudents(students, todayDateStr).length,
};

export default studentsProperties;