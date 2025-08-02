import React, { useState } from 'react';
import { Calendar, FileText, Download, User, BookOpen, Clock, CheckCircle, XCircle } from 'lucide-react';
import styles from './LoggedUserExport.module.css';

const LoggedUserExport = () => {
  const [fromDate, setFromDate] = useState('2025-07-01');
  const [toDate, setToDate] = useState('2025-08-01');

  // Sample data structure as provided
  const studentData = {
    "id": "100001",
    "name": "Abhisek Kumar Giri",
    "rollNo": "1001",
    "subjects": ["AI", "OS"],
    "attendance": {
      "AI": {
        "totalClasses": 45,
        "present": 30,
        "lastMarked": "2025-07-25",
        "presentDates": [
          "2025-07-13", "2025-07-14", "2025-07-15", "2025-07-16", "2025-07-17",
          "2025-07-18", "2025-07-19", "2025-07-20", "2025-07-21", "2025-07-22",
          "2025-07-23", "2025-07-24", "2025-07-25"
        ]
      },
      "OS": {
        "totalClasses": 45,
        "present": 9,
        "lastMarked": "2025-07-26",
        "presentDates": [
          "2025-07-12", "2025-07-13", "2025-07-19", "2025-07-20",
          "2025-07-22", "2025-07-23", "2025-07-24", "2025-07-25", "2025-07-26"
        ]
      }
    }
  };

  const filterDatesByRange = (dates, from, to) => {
    return dates.filter(date => date >= from && date <= to);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateAttendancePercentage = (present, total) => {
    return ((present / total) * 100).toFixed(1);
  };

  const getFilteredAttendance = () => {
    const filtered = {};
    studentData.subjects.forEach(subject => {
      const subjectData = studentData.attendance[subject];
      const filteredDates = filterDatesByRange(subjectData.presentDates, fromDate, toDate);
      filtered[subject] = {
        ...subjectData,
        presentDates: filteredDates,
        present: filteredDates.length
      };
    });
    return filtered;
  };

  const filteredAttendance = getFilteredAttendance();
  const totalPresentDays = Object.values(filteredAttendance).reduce((sum, subject) => sum + subject.present, 0);
  const totalClasses = Object.values(filteredAttendance).reduce((sum, subject) => sum + subject.totalClasses, 0);

  const generatePDF = () => {
    const element = document.getElementById('attendance-statement');
    const opt = {
      margin: 0.5,
      filename: `${studentData.name}_Attendance_Statement_${fromDate}_to_${toDate}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    // Create print-friendly version
    const printButton = document.querySelector(`.${styles.noPrint}`);
    if (printButton) printButton.style.display = 'none';
    
    // Using html2pdf library - need to add script
    if (window.html2pdf) {
      window.html2pdf().set(opt).from(element).save().then(() => {
        if (printButton) printButton.style.display = 'flex';
      });
    } else {
      // Fallback to window.print()
      window.print();
    }
  };

  return (
    <>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
      <div className={styles.attendanceContainer}>
        <div className={styles.attendanceWrapper} id="attendance-statement">
          {/* Header Section */}
          <div className={styles.headerSection}>
            <div className={styles.headerTop}>
              <div className={styles.headerLogo}>
                <div className={styles.logoIcon}>
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className={styles.logoText}>Attendify</h1>
                  <p className={styles.logoSubtitle}>Smart Attendance Management</p>
                </div>
              </div>
              <button
                onClick={generatePDF}
                className={`${styles.exportButton} ${styles.noPrint}`}
              >
                <Download className="w-4 h-4" />
                <span>Export Statement</span>
              </button>
            </div>

            {/* Date Range Picker */}
            <div className={styles.datePickerSection}>
              <div className={styles.datePickerRow}>
                <Calendar className="w-5 h-5 text-slate-600" />
                <span className={styles.datePickerLabel}>Statement Period:</span>
                <div className={styles.datePickerControls}>
                  <label className={styles.dateInputLabel}>From:</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className={styles.dateInput}
                  />
                  <label className={styles.dateInputLabel}>To:</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className={styles.dateInput}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Student Information Card */}
          <div className={styles.studentInfoCard}>
            <div className={styles.studentInfoGrid}>
              <div className={styles.studentInfoItem}>
                <div className={`${styles.studentInfoIcon} ${styles.user}`}>
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className={styles.studentInfoLabel}>Student Name</p>
                  <p className={styles.studentInfoValue}>{studentData.name}</p>
                </div>
              </div>
              <div className={styles.studentInfoItem}>
                <div className={`${styles.studentInfoIcon} ${styles.book}`}>
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className={styles.studentInfoLabel}>Roll Number</p>
                  <p className={styles.studentInfoValue}>{studentData.rollNo}</p>
                </div>
              </div>
              <div className={styles.studentInfoItem}>
                <div className={`${styles.studentInfoIcon} ${styles.clock}`}>
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className={styles.studentInfoLabel}>Statement Date</p>
                  <p className={styles.studentInfoValue}>{formatDate(new Date().toISOString().split('T')[0])}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className={styles.statsGrid}>
            <div className={styles.statsCard}>
              <div className={styles.statsCardContent}>
                <div className={`${styles.statsIcon} ${styles.subjects}`}>
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className={styles.statsLabel}>Total Subjects</p>
                  <p className={`${styles.statsValue} ${styles.default}`}>{studentData.subjects.length}</p>
                </div>
              </div>
            </div>
            <div className={styles.statsCard}>
              <div className={styles.statsCardContent}>
                <div className={`${styles.statsIcon} ${styles.present}`}>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className={styles.statsLabel}>Present Days</p>
                  <p className={`${styles.statsValue} ${styles.present}`}>{totalPresentDays}</p>
                </div>
              </div>
            </div>
            <div className={styles.statsCard}>
              <div className={styles.statsCardContent}>
                <div className={`${styles.statsIcon} ${styles.total}`}>
                  <XCircle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className={styles.statsLabel}>Total Classes</p>
                  <p className={`${styles.statsValue} ${styles.default}`}>{totalClasses}</p>
                </div>
              </div>
            </div>
            <div className={styles.statsCard}>
              <div className={styles.statsCardContent}>
                <div className={`${styles.statsIcon} ${styles.percentage}`}>
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className={styles.statsLabel}>Overall %</p>
                  <p className={`${styles.statsValue} ${styles.percentage}`}>
                    {calculateAttendancePercentage(totalPresentDays, totalClasses)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Subject-wise Attendance Table */}
          <div className={styles.tableSection}>
            <div className={styles.tableHeader}>
              <h2 className={styles.tableTitle}>
                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                Subject-wise Attendance Summary
              </h2>
            </div>
            <div className={styles.tableContainer}>
              <table className={styles.attendanceTable}>
                <thead className={styles.tableHead}>
                  <tr>
                    <th className={`${styles.tableHeaderCell} ${styles.left}`}>Subject</th>
                    <th className={`${styles.tableHeaderCell} ${styles.center}`}>Total Classes</th>
                    <th className={`${styles.tableHeaderCell} ${styles.center}`}>Present</th>
                    <th className={`${styles.tableHeaderCell} ${styles.center}`}>Absent</th>
                    <th className={`${styles.tableHeaderCell} ${styles.center}`}>Percentage</th>
                    <th className={`${styles.tableHeaderCell} ${styles.center}`}>Last Marked</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData.subjects.map((subject, index) => {
                    const subjectData = filteredAttendance[subject];
                    const absent = subjectData.totalClasses - subjectData.present;
                    const percentage = calculateAttendancePercentage(subjectData.present, subjectData.totalClasses);
                    
                    return (
                      <tr key={index} className={styles.tableRow}>
                        <td className={styles.tableCell}>
                          <div className={styles.subjectCell}>
                            <div className={styles.subjectIcon}>
                              <span className={styles.subjectIconText}>{subject}</span>
                            </div>
                            <span className={styles.subjectName}>{subject}</span>
                          </div>
                        </td>
                        <td className={`${styles.tableCell} ${styles.center}`}>{subjectData.totalClasses}</td>
                        <td className={`${styles.tableCell} ${styles.center}`}>
                          <span className={`${styles.statusBadge} ${styles.present}`}>
                            {subjectData.present}
                          </span>
                        </td>
                        <td className={`${styles.tableCell} ${styles.center}`}>
                          <span className={`${styles.statusBadge} ${styles.absent}`}>
                            {absent}
                          </span>
                        </td>
                        <td className={`${styles.tableCell} ${styles.center}`}>
                          <span className={`${styles.statusBadge} ${
                            percentage >= 75 ? styles.percentageHigh : 
                            percentage >= 60 ? styles.percentageMedium : 
                            styles.percentageLow
                          }`}>
                            {percentage}%
                          </span>
                        </td>
                        <td className={`${styles.tableCell} ${styles.center} ${styles.lastMarkedDate}`}>
                          {formatDate(subjectData.lastMarked)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Attendance Records */}
          <div className={styles.detailedSection}>
            <div className={styles.tableHeader}>
              <h2 className={styles.tableTitle}>
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Detailed Present Dates Record
              </h2>
            </div>
            <div className={styles.tableContainer}>
              {studentData.subjects.map((subject) => {
                const subjectData = filteredAttendance[subject];
                return (
                  <div key={subject} className={styles.subjectSection}>
                    <div className={styles.subjectHeader}>
                      <div className={styles.subjectHeaderContent}>
                        <div className={styles.subjectHeaderIcon}>
                          <span className="text-sm font-bold text-blue-600">{subject}</span>
                        </div>
                        <h3 className={styles.subjectHeaderTitle}>{subject}</h3>
                        <span className={styles.subjectBadge}>
                          {subjectData.present} Present Days
                        </span>
                      </div>
                    </div>
                    <div className={styles.subjectTableContainer}>
                      <table className={styles.attendanceTable}>
                        <thead className={styles.detailedTableHead}>
                          <tr>
                            <th className={`${styles.detailedTableCell} ${styles.left}`}>S.No.</th>
                            <th className={`${styles.detailedTableCell} ${styles.left}`}>Date</th>
                            <th className={`${styles.detailedTableCell} ${styles.left}`}>Day</th>
                            <th className={`${styles.detailedTableCell} ${styles.center}`}>Status</th>
                            <th className={`${styles.detailedTableCell} ${styles.left}`}>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subjectData.presentDates.map((date, index) => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-IN', { weekday: 'long' });
                            return (
                              <tr key={index} className={styles.tableRow}>
                                <td className={`${styles.detailedTableCell} ${styles.text}`}>{index + 1}</td>
                                <td className={`${styles.detailedTableCell} ${styles.date}`}>{formatDate(date)}</td>
                                <td className={`${styles.detailedTableCell} ${styles.day}`}>{dayName}</td>
                                <td className={`${styles.detailedTableCell} ${styles.statusCell}`}>
                                  <div className={styles.statusIconGroup}>
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className={styles.presentStatus}>
                                      Present
                                    </span>
                                  </div>
                                </td>
                                <td className={`${styles.detailedTableCell} ${styles.remarksCell}`}>Attended class</td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className={styles.tableFooter}>
                          <tr>
                            <td colSpan="3" className={`${styles.detailedTableCell} ${styles.footerTotalText}`}>
                              Total Present Days in {subject}:
                            </td>
                            <td className={`${styles.detailedTableCell} ${styles.center}`}>
                              <span className={styles.footerCountBadge}>
                                {subjectData.present}
                              </span>
                            </td>
                            <td className={`${styles.detailedTableCell} ${styles.footerPercentage}`}>
                              {calculateAttendancePercentage(subjectData.present, subjectData.totalClasses)}% Attendance
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className={styles.mainFooter}>
            <div className={styles.footerContent}>
              <p className={styles.footerThankYou}>Thank you for using Attendify Smart Attendance Management System</p>
              <p className={styles.footerStatementInfo}>
                This statement was generated on {formatDate(new Date().toISOString().split('T')[0])} for the period from {formatDate(fromDate)} to {formatDate(toDate)}
              </p>
              <p className={styles.footerCopyright}>© 2025 Attendify. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoggedUserExport;