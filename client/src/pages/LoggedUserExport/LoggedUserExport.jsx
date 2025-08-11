import React, { useState } from 'react';
import { Calendar, FileText, Download, User, BookOpen, Clock, CheckCircle, XCircle, AlertTriangle, CalendarCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import styles from './LoggedUserExport.module.css';
import { useStudent } from '../../store/StudentContext';
import { generateAttendancePDF } from '../../utils/generatePDFStatement';
import { useAuth } from '../../store/AuthContext';
import AuthPrompt from '../../components/AuthPrompt/AuthPrompt';
import { useAttendance } from '../../store/AttendanceContext';

const LoggedUserExport = () => {
  const { user } = useAuth();
  const { student } = useStudent();
  const { attendanceData, overallStats, isOverallCritical } = useAttendance();
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

  if (!student || !student?.subjects) {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const generatePDF = async () => {
    setIsGenerating(true);

    try {
      await generateAttendancePDF(
        student,
        attendanceData,
        overallStats,
        isOverallCritical,
        fromDate,
        toDate,
        (fileName) => {
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
            <h3>{student?.name}</h3>
            <p>Roll No: {student?.rollNo}</p>
          </div>
        </div>
        <div className={styles.overallStats}>
          <div className={styles.stat}>
            <BookOpen className="w-4 h-4" />
           <span>{student?.subjects ? Object.keys(student.subjects).length : 0} Subjects</span>

          </div>
          <div className={styles.stat}>
            <Clock className="w-4 h-4" />
            <span>{overallStats?.totalClasses ?? 0} Total Classes</span>
          </div>
          <div className={`${styles.stat} ${parseFloat(overallStats?.percentage) >= 75 ? styles.good : styles.critical}`}>
            {parseFloat(student.attendancePercentage) >= 75 ? 
              <CheckCircle className="w-4 h-4" /> : 
              <XCircle className="w-4 h-4" />
            }
            <span> {overallStats?.percentage != null
                  ? `${overallStats.percentage.toFixed(1)}%`
                  : "0.0%"}% Attendance</span>
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
      </div>

      {/* Warning */}
      {parseFloat(overallStats?.percentage) < 75 && (
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
