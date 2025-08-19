// src/utils/filterStudents.js

export function filterStudents(students, filters) {
  const { subject, fromDate, toDate, searchTerm ,isCritical} = filters;
  return students.filter((student) => {
    const nameMatch = student?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const rollMatch = student?.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    const subjectMatch = subject === '' || student?.subjects.includes(subject);
    const isCriticalMatch = isCritical === '' || student?.isCritical.toString() === isCritical;
    const date = new Date(student.overall.lastMarked);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    const dateMatch = (!from || date >= from) && (!to || date <= to);

    return (nameMatch || rollMatch) && subjectMatch && dateMatch&&isCriticalMatch;
  });
}
