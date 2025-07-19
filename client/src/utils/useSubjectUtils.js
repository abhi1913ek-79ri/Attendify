const useSubjects = (students) => {
  const subjects = useMemo(() => {
    if (!students || students.length === 0) return [];
    const subjectSet = new Set();
    students.forEach((student) => {
      Object.keys(student.attendance || {}).forEach((sub) => {
        subjectSet.add(sub);
      });
    });
    return Array.from(subjectSet);
  }, [students]);

  return subjects;
};
