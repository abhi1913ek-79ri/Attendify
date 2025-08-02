// utils/filterAttendanceByDate.js - Safe Version with flexible date filtering
export const filterAttendanceByDate = (studentData, fromDate, toDate) => {
  // Safety checks
  if (!studentData) {
    console.warn('StudentData is undefined');
    return {};
  }
     
  if (!studentData.subjects || !Array.isArray(studentData.subjects)) {
    console.warn('StudentData.subjects is not available or not an array');
    return {};
  }
     
  if (!studentData.attendance || typeof studentData.attendance !== 'object') {
    console.warn('StudentData.attendance is not available or not an object');
    return {};
  }

  // Date filtering logic
  let actualFromDate, actualToDate;
  
  if (!fromDate && !toDate) {
    // No dates provided - show all data
    actualFromDate = null;
    actualToDate = null;
  } else if (fromDate && !toDate) {
    // Only fromDate provided - show all dates from fromDate onwards
    actualFromDate = fromDate;
    actualToDate = null;
  } else if (!fromDate && toDate) {
    // Only toDate provided - show all dates up to toDate
    actualFromDate = null;
    actualToDate = toDate;
  } else {
    // Both dates provided - normal range filtering
    actualFromDate = fromDate;
    actualToDate = toDate;
  }

  const filtered = {};
     
  studentData.subjects.forEach(subject => {
    const subjectData = studentData.attendance[subject];
         
    // Check if subject data exists
    if (!subjectData) {
      console.warn(`No attendance data found for subject: ${subject}`);
      filtered[subject] = {
        totalClasses: 0,
        present: 0,
        presentDates: [],
        percentage: 0
      };
      return;
    }
         
    // Check if presentDates exists and is an array
    const presentDates = subjectData.presentDates || [];
    if (!Array.isArray(presentDates)) {
      console.warn(`PresentDates is not an array for subject: ${subject}`);
      filtered[subject] = {
        ...subjectData,
        presentDates: [],
        present: 0
      };
      return;
    }
         
    // Filter dates based on the actual range
    const filteredDates = presentDates.filter(date => {
      if (!date) return false;
      
      // If no date constraints, include all
      if (!actualFromDate && !actualToDate) {
        return true;
      }
      
      // If only fromDate provided, include dates >= fromDate
      if (actualFromDate && !actualToDate) {
        return date >= actualFromDate;
      }
      
      // If only toDate provided, include dates <= toDate
      if (!actualFromDate && actualToDate) {
        return date <= actualToDate;
      }
      
      // Both dates provided, include dates in range
      return date >= actualFromDate && date <= actualToDate;
    });
         
    // Use original total classes from student data, don't calculate from dates
    const totalClassesInRange = subjectData.totalClasses || 0;
         
    filtered[subject] = {
      ...subjectData,
      presentDates: filteredDates,
      present: filteredDates.length,
      totalClasses: totalClassesInRange,
      percentage: totalClassesInRange > 0 ? 
        ((filteredDates.length / totalClassesInRange) * 100).toFixed(1) : 
        '0.0'
    };
  });
     
  return filtered;
};

// Optional: Helper function to get the expanded date range info
export const getDateRangeInfo = (fromDate, toDate) => {
  if (fromDate === toDate) {
    const selectedDate = new Date(fromDate);
    const threeMonthsBefore = new Date(selectedDate);
    threeMonthsBefore.setMonth(threeMonthsBefore.getMonth() - 3);
    const threeMonthsAfter = new Date(selectedDate);
    threeMonthsAfter.setMonth(threeMonthsAfter.getMonth() + 3);
    
    return {
      isExpanded: true,
      originalDate: fromDate,
      expandedRange: {
        from: threeMonthsBefore.toISOString().split('T')[0],
        to: threeMonthsAfter.toISOString().split('T')[0]
      }
    };
  }
  
  return {
    isExpanded: false,
    range: { from: fromDate, to: toDate }
  };
};