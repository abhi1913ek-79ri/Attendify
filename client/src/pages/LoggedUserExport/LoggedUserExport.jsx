import React, { useState } from 'react';
import { Calendar, FileText, Download, User, BookOpen, Clock, CheckCircle, XCircle, AlertTriangle, CalendarCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import styles from './LoggedUserExport.module.css';
import { useStudent } from '../../store/StudentContext';
import { filterAttendanceByDate } from '../../utils/filterAttendanceUtility';
import { generateAttendancePDF } from '../../utils/generatePDFStatement';
import { useAuth } from '../../store/AuthContext';
import AuthPrompt from '../../components/AuthPrompt/AuthPrompt';

const LoggedUserExport = () => {
  const { user } = useAuth();
  const {students} = useStudent();
  const [fromDate, setFromDate] = useState('2025-07-01');
  const [toDate, setToDate] = useState('2025-08-01');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!user) {
    return (
      <div className="mark-attendance">
        <div className="page-header">
          <div className="header-content">
            <CalendarCheck className="header-icon" />
            <h2 className="header-title">Mark Attendance</h2>
          </div>
        </div>
        <div className="page-content">
          <AuthPrompt message={"Access Denied"} purpose={"mark your attendance"} />
        </div>
      </div>
    );
  }

  const student = students.find((s) => s.id === user.id);

  if (!student) {
    return (
      <div className="mark-attendance">
        <div className="page-header">
          <div className="header-content">
            <CalendarCheck className="header-icon" />
            <h2 className="header-title">Mark Attendance</h2>
          </div>
        </div>
        <div className="page-content">
          <div className="error-card">
            <p>⚠️ You are logged in but not found in the student list.</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if student data is available
  if (!student || !student.subjects || !student.attendance) {
    return (
      <div className={styles.exportContainer}>
        <div className={styles.errorCard}>
          <AlertTriangle className="w-12 h-12" />
          <h3>No Student Data Available</h3>
          <p>Please ensure you are logged in and have valid attendance data.</p>
        </div>
      </div>
    );
  }

  const studentData = student;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateAttendancePercentage = (present, total) => {
    return total === 0 ? '0.0' : ((present / total) * 100).toFixed(1);
  };

  // Safe calculation with error handling
  let filteredAttendance = {};
  let totalPresentDays = 0;
  let totalClasses = 0;
  let overallPercentage = '0.0';

  try {
    filteredAttendance = filterAttendanceByDate(studentData, fromDate, toDate);
    totalPresentDays = Object.values(filteredAttendance).reduce((sum, subject) => sum + (subject.present || 0), 0);
    totalClasses = Object.values(filteredAttendance).reduce((sum, subject) => sum + (subject.totalClasses || 0), 0);
    overallPercentage = calculateAttendancePercentage(totalPresentDays, totalClasses);
  } catch (error) {
    console.error('Error calculating attendance:', error);
  }

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      await generateAttendancePDF(
        studentData, 
        fromDate, 
        toDate,
        (fileName) => {
          // Success callback
          toast.success(`${fileName} downloaded successfully!`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setIsGenerating(false);
        },
        (error) => {
          // Error callback
          toast.error(`Download failed: ${error.message}`, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setIsGenerating(false);
        }
      );
    } catch (error) {
      toast.error(`PDF generation failed: ${error.message}`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsGenerating(false);
    }
  };

  return (
    <div className={styles.exportContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h2 className={styles.title}>Attendance Report Export</h2>
          <p className={styles.subtitle}>Generate and download your attendance statement</p>
        </div>
      </div>

      {/* Student Info Card */}
      <div className={styles.studentCard}>
        <div className={styles.studentInfo}>
          <User className="w-5 h-5" />
          <div>
            <h3>{studentData.name}</h3>
            <p>Roll No: {studentData.rollNo}</p>
          </div>
        </div>
        <div className={styles.overallStats}>
          <div className={styles.stat}>
            <BookOpen className="w-4 h-4" />
            <span>{studentData.subjects.length} Subjects</span>
          </div>
          <div className={styles.stat}>
            <Clock className="w-4 h-4" />
            <span>{totalClasses} Total Classes</span>
          </div>
          <div className={`${styles.stat} ${parseFloat(overallPercentage) >= 75 ? styles.good : styles.critical}`}>
            {parseFloat(overallPercentage) >= 75 ? 
              <CheckCircle className="w-4 h-4" /> : 
              <XCircle className="w-4 h-4" />
            }
            <span>{overallPercentage}% Attendance</span>
          </div>
        </div>
      </div>

      {/* Date Selection */}
      <div className={styles.dateSection}>
        <h3 className={styles.sectionTitle}>
          <Calendar className="w-5 h-5" />
          Select Report Period
        </h3>
        
        <div className={styles.dateInputs}>
          <div className={styles.dateGroup}>
            <label htmlFor="fromDate">From Date</label>
            <input
              type="date"
              id="fromDate"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>
          
          <div className={styles.dateGroup}>
            <label htmlFor="toDate">To Date</label>
            <input
              type="date"
              id="toDate"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>
        </div>

        <div className={styles.periodInfo}>
          <p>📅 Selected Period: <strong>{formatDate(fromDate)} to {formatDate(toDate)}</strong></p>
          <p>📋 Classes in Period: <strong>{totalClasses}</strong> | Present: <strong>{totalPresentDays}</strong></p>
        </div>
      </div>

      {/* Subject Preview */}
      <div className={styles.previewSection}>
        <h3 className={styles.sectionTitle}>Subject-wise Preview</h3>
        <div className={styles.subjectGrid}>
          {studentData.subjects.map((subject) => {
            const subjectData = filteredAttendance[subject];
            
            // Safety check for subject data
            if (!subjectData) {
              return (
                <div key={subject} className={`${styles.subjectCard} ${styles.error}`}>
                  <div className={styles.subjectHeader}>
                    <BookOpen className="w-4 h-4" />
                    <h4>{subject}</h4>
                  </div>
                  <div className={styles.subjectStats}>
                    <div className={styles.subjectStat}>
                      <span className={styles.label}>Status:</span>
                      <span className={styles.value}>No Data</span>
                    </div>
                  </div>
                </div>
              );
            }
            
            const percentage = calculateAttendancePercentage(subjectData.present || 0, subjectData.totalClasses || 0);
            const isCritical = parseFloat(percentage) < 75;
            
            return (
              <div key={subject} className={`${styles.subjectCard} ${isCritical ? styles.critical : styles.good}`}>
                <div className={styles.subjectHeader}>
                  <BookOpen className="w-4 h-4" />
                  <h4>{subject}</h4>
                </div>
                <div className={styles.subjectStats}>
                  <div className={styles.subjectStat}>
                    <span className={styles.label}>Classes:</span>
                    <span className={styles.value}>{subjectData.totalClasses || 0}</span>
                  </div>
                  <div className={styles.subjectStat}>
                    <span className={styles.label}>Present:</span>
                    <span className={styles.value}>{subjectData.present || 0}</span>
                  </div>
                  <div className={styles.subjectStat}>
                    <span className={styles.label}>Percentage:</span>
                    <span className={`${styles.value} ${isCritical ? styles.criticalText : styles.goodText}`}>
                      {percentage}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Critical Warning */}
      {parseFloat(overallPercentage) < 75 && (
        <div className={styles.warningBanner}>
          <AlertTriangle className="w-5 h-5" />
          <div>
            <h4>Critical Attendance Warning</h4>
            <p>Your overall attendance is below 75%. Please attend all upcoming classes regularly.</p>
          </div>
        </div>
      )}

      {/* Export Button */}
      <div className={styles.exportSection}>
        <button 
          onClick={generatePDF} 
          className={styles.exportButton}
          disabled={isGenerating}
        >
          <Download className="w-4 h-4" />
          {isGenerating ? 'Generating PDF...' : 'Export Statement'}
        </button>
        
        <p className={styles.exportInfo}>
          The PDF will include detailed attendance records, verification seal, and daily attendance logs for the selected period.
        </p>
      </div>
    </div>
  );
};

export default LoggedUserExport;