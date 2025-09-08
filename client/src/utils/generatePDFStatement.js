import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { assets } from '../assets/assets';

// 🔹 DATE FORMAT UTILITY
const formatDate = (dateStr) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-IN', options);
};

// 🔹 GET ALL DATES BETWEEN range (inclusive) in YYYY-MM-DD
const getDatesInRange = (from, to) => {
  const dates = [];
  let curr = new Date(from);
  const end = new Date(to);
  curr.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  while (curr <= end) {
    const y = curr.getFullYear();
    const m = String(curr.getMonth() + 1).padStart(2, '0');
    const d = String(curr.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${d}`);
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
};

// 🔹 PAGE MANAGEMENT UTILITIES
const PAGE_HEIGHT = 297; // A4 height in mm
const PAGE_WIDTH = 210; // A4 width in mm
const MARGIN_TOP = 20;
const MARGIN_BOTTOM = 50; // Space for footer
const CONTENT_HEIGHT = PAGE_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM;

const checkPageBreak = (doc, currentY, requiredHeight) => {
  if (currentY + requiredHeight > PAGE_HEIGHT - MARGIN_BOTTOM) {
    doc.addPage();
    return MARGIN_TOP;
  }
  return currentY;
};

const addHeader = (doc) => {
  // Header background
  doc.setFillColor(240, 240, 240);
  doc.rect(0, 0, PAGE_WIDTH, 25, 'F');

  // White circle for logo
  doc.setFillColor(255, 255, 255);
  doc.circle(19, 13, 10, 'F');

  // Add logo if available
  if (assets.pdf_logo) {
    try {
      doc.addImage(assets.pdf_logo, 'PNG', 14, 8, 10, 10);
    } catch (e) {
      console.warn('Logo could not be loaded');
    }
  }

  // Title
  doc.setTextColor(0, 0, 0).setFontSize(18).setFont('helvetica', 'bold');
  const title = 'ATTENDIFY - ATTENDANCE STATEMENT';
  doc.text(title, (PAGE_WIDTH - doc.getTextWidth(title)) / 2, 16);

  // Underline
  doc.setDrawColor(70, 130, 180).setLineWidth(1).line(14, 28, 196, 28);
};

const addFooter = (doc) => {
  const footerY = PAGE_HEIGHT - 40;

  // Footer background
  doc.setFillColor(248, 249, 250).rect(0, footerY - 5, PAGE_WIDTH, 45, 'F');
  doc.setDrawColor(70, 130, 180).setLineWidth(0.8).line(14, footerY, 196, footerY);

  // White circle for logo in footer
  doc.setFillColor(255, 255, 255);
  doc.circle(24, footerY + 15, 10, 'F');

  // Add logo in footer if available
  if (assets.pdf_logo) {
    try {
      doc.addImage(assets.pdf_logo, 'PNG', 19, footerY + 10, 10, 10);
    } catch (e) {
      console.warn('Footer logo could not be loaded');
    }
  }

  // Footer text
  doc.setTextColor(100, 100, 100).setFontSize(9).setFont('helvetica', 'normal');
  const currentDate = formatDate(new Date().toISOString());
  const currentTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  doc.text(`Generated on: ${currentDate} at ${currentTime}`, 45, footerY + 8);
  doc.text(`This is a computer-generated document`, 45, footerY + 20);
  doc.text('No signature required', 45, footerY + 26);
  doc.setFontSize(10).setFont('helvetica', 'bold').setTextColor(70, 130, 180).text('ATTENDIFY', 45, footerY + 32);

  return footerY;
};

// 🔹 VERIFICATION SEAL
const drawVerificationSeal = (doc, x, y, size = 40) => {
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const radius = size / 2;

  const currentLineWidth = doc.internal.getLineWidth();
  doc.setDrawColor(70, 130, 180);
  doc.setTextColor(70, 130, 180);

  // Outer circle
  doc.setLineWidth(1.5);
  doc.circle(centerX, centerY, radius - 2, 'S');

  // Inner circle
  doc.setLineWidth(1);
  doc.circle(centerX, centerY, radius - 6, 'S');

  // Zigzag pattern
  doc.setLineWidth(0.5);
  const zigzagRadius = radius - 8;
  const points = 60;
  for (let i = 0; i < points; i++) {
    const angle1 = (i * 2 * Math.PI) / points;
    const angle2 = ((i + 1) * 2 * Math.PI) / points;
    const r1 = i % 2 === 0 ? zigzagRadius : zigzagRadius - 2;
    const r2 = (i + 1) % 2 === 0 ? zigzagRadius : zigzagRadius - 2;
    const px1 = centerX + r1 * Math.cos(angle1);
    const py1 = centerY + r1 * Math.sin(angle1);
    const px2 = centerX + r2 * Math.cos(angle2);
    const py2 = centerY + r2 * Math.sin(angle2);
    doc.line(px1, py1, px2, py2);
  }

  // Seal text
  doc.setFont('helvetica', 'bold').setFontSize(10);
  const verifiedText = 'VERIFIED';
  doc.text(verifiedText, centerX - doc.getTextWidth(verifiedText) / 2, centerY - 6);

  doc.setFontSize(7).setFont('helvetica', 'normal');
  const text1 = 'Seal of Verification';
  doc.text(text1, centerX - doc.getTextWidth(text1) / 2, centerY - 3);

  doc.setFontSize(6);
  const adminText1 = 'Admin:';
  doc.text(adminText1, centerX - doc.getTextWidth(adminText1) / 2, centerY + 0);
  const adminText2 = 'Abhishek Kumar Giri';
  doc.text(adminText2, centerX - doc.getTextWidth(adminText2) / 2, centerY + 3);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  doc.setFontSize(5);
  const dateText = `Generated: ${dateStr}`;
  doc.text(dateText, centerX - doc.getTextWidth(dateText) / 2, centerY + 7);
  const timeText = `Time: ${timeStr}`;
  doc.text(timeText, centerX - doc.getTextWidth(timeText) / 2, centerY + 9);

  // Reset styles
  doc.setLineWidth(currentLineWidth).setDrawColor(0, 0, 0).setTextColor(0, 0, 0);
};

// 🔹 MAIN PDF GENERATOR (FIXED VERSION)
export const generateAttendancePDF = async (
  studentData,
  attendanceData,
  overallStats,
  isOverallCritical,
  fromDate,
  toDate,
  onSuccess,
  onError
) => {
  try {
    const doc = new jsPDF();
    let currentY = MARGIN_TOP;

    // Get subject list
    const studentSubjects = studentData?.subjects
      ? (studentData.subjects instanceof Map ? Array.from(studentData.subjects.keys()) : Object.keys(studentData.subjects))
      : [];
    const attendanceSubjects = attendanceData?.subjects && typeof attendanceData.subjects === 'object'
      ? Object.keys(attendanceData.subjects)
      : [];
    const subjectList = studentSubjects.length > 0 ? studentSubjects : attendanceSubjects;

    const totalSubjects = subjectList.length;
    const totalPresent = Number(overallStats?.present) || 0;
    const totalClasses = Number(overallStats?.totalClasses) || 0;
    const overallPercentage = overallStats?.percentage ? Number(overallStats.percentage).toFixed(1) : "0.0";

    // Add header to first page
    addHeader(doc);
    currentY = 35;

    // Document number
    doc.setFontSize(10).setFont('helvetica', 'normal').setTextColor(0, 0, 0);
    doc.text(`Document No: ATT/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`, 14, currentY);
    currentY += 10;

    // STUDENT INFORMATION SECTION
    currentY = checkPageBreak(doc, currentY, 40);
    if (currentY === MARGIN_TOP) {
      currentY += 10; // Just top margin, no header
    }

    // Student info box
    doc.setFillColor(249, 249, 249);
    doc.rect(14, currentY, 182, 35, 'F');
    doc.setDrawColor(189, 189, 189);
    doc.rect(14, currentY, 182, 35, 'S');

    doc.setFontSize(12).setFont('helvetica', 'bold').setTextColor(70, 130, 180);
    doc.text('STUDENT INFORMATION', 16, currentY + 8);

    doc.setFontSize(10).setFont('helvetica', 'normal').setTextColor(0, 0, 0);
    doc.text(`Full Name: ${studentData?.name || "N/A"}`, 16, currentY + 16);
    doc.text(`Roll Number: ${studentData?.rollNo || "N/A"}`, 16, currentY + 22);
    doc.text(`Statement Period: ${formatDate(fromDate)} to ${formatDate(toDate)}`, 16, currentY + 28);
    doc.text(`Date of Generation: ${formatDate(new Date().toISOString())}`, 120, currentY + 16);
    doc.text(`Academic Session: ${new Date().getFullYear()}-${new Date().getFullYear() + 1}`, 120, currentY + 22);

    currentY += 45;

    // ATTENDANCE SUMMARY SECTION
    currentY = checkPageBreak(doc, currentY, 35);
    if (currentY === MARGIN_TOP) {
      currentY += 10; // Just top margin, no header
    }

    doc.setFontSize(12).setFont('helvetica', 'bold').setTextColor(70, 130, 180);
    doc.text('ATTENDANCE SUMMARY', 14, currentY);
    currentY += 5;

    autoTable(doc, {
      startY: currentY,
      headStyles: {
        fillColor: [70, 130, 180],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 10,
        halign: 'center',
        cellPadding: { top: 5, bottom: 5 }
      },
      head: [['Total Subjects', 'Total Classes', 'Classes Attended', 'Overall Percentage', 'Status']],
      body: [[
        totalSubjects,
        totalClasses,
        totalPresent,
        `${overallPercentage}%`,
        parseFloat(overallPercentage) >= 75 ? 'SATISFACTORY' : 'CRITICAL'
      ]],
      theme: 'grid',
      styles: { lineWidth: 0.2, lineColor: [220, 220, 220] },
      tableWidth: 182,
      margin: { left: 14 }
    });

    currentY = doc.lastAutoTable.finalY + 15;

    // SUBJECT-WISE DETAILS SECTION
    currentY = checkPageBreak(doc, currentY, 60);
    if (currentY === MARGIN_TOP) {
      currentY += 10; // Just top margin, no header
    }

    doc.setFontSize(12).setFont('helvetica', 'bold').setTextColor(70, 130, 180);
    doc.text('SUBJECT-WISE ATTENDANCE DETAILS', 14, currentY);
    currentY += 5;

    // Build subject-wise table
    const subjectTableBody = subjectList.map((subject, index) => {
      const statsRaw = attendanceData?.subjects instanceof Map
        ? attendanceData.subjects.get(subject)
        : (attendanceData?.subjects || {})[subject];
      const total = Number(statsRaw?.total) || 0;
      const present = Number(statsRaw?.present) || 0;
      const absent = Math.max(0, total - present);
      const percent = total ? ((present / total) * 100).toFixed(1) : "0.0";
      const status = parseFloat(percent) >= 75 ? 'Good' : 'Critical';
      return [index + 1, subject, total, present, absent, `${percent}%`, status];
    });

    autoTable(doc, {
      startY: currentY,
      headStyles: {
        fillColor: [100, 149, 237],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 9,
        halign: 'center',
        cellPadding: { top: 4, bottom: 4 }
      },
      head: [['S.No.', 'Subject Name', 'Total Classes', 'Present', 'Absent', 'Percentage', 'Status']],
      body: subjectTableBody,
      theme: 'grid',
      styles: { lineWidth: 0.2, lineColor: [220, 220, 220] },
      tableWidth: 182,
      margin: { left: 14 },
      pageBreak: 'auto',
      showHead: 'everyPage'
    });

    currentY = doc.lastAutoTable.finalY + 15;

    // DAILY ATTENDANCE RECORDS
    const dateRange = getDatesInRange(fromDate, toDate);
  const rawDaily = attendanceData?.daily;
  const dailyObj = rawDaily instanceof Map ? Object.fromEntries(rawDaily) : (rawDaily || {});

  // classes may be stored as Map or plain object; convert to object for lookups
  const rawClasses = attendanceData?.classes;
  const classesObj = rawClasses instanceof Map ? Object.fromEntries(rawClasses) : (rawClasses || {});

    subjectList.forEach((subject, subjectIndex) => {
      // Estimate space needed for this subject's daily record
      const detailRowsCount = dateRange.filter(date => {
        const key = `${subject}_${date}`;
        return dailyObj[key];
      }).length;

      const estimatedHeight = 35 + Math.max(1, detailRowsCount) * 8; // Header + rows

      // Check if we need a new page (no header on new pages)
      currentY = checkPageBreak(doc, currentY, estimatedHeight);
      if (currentY === MARGIN_TOP) {
        currentY += 10; // Just add some top margin, no header
      }

      // Subject title
      doc.setFontSize(11).setFont('helvetica', 'bold').setTextColor(70, 130, 180);
      doc.text(`DAILY ATTENDANCE RECORD - ${subject.toUpperCase()}`, 14, currentY);
      currentY += 5;

      // Build daily records (include class duration if available)
      const detailRows = dateRange.map((date, idx) => {
        const d = new Date(date);
        const day = d.toLocaleDateString('en-IN', { weekday: 'long' });
        const key = `${subject}_${date}`;
        const statusRaw = dailyObj[key] || null;
        const statusText = statusRaw === 'present' ? 'Present' : statusRaw === 'absent' ? 'Absent' : '-';
        const mark = statusRaw === 'present' ? 'P' : statusRaw === 'absent' ? 'A' : '-';
        const classData = classesObj[key];
        const durationText = classData && classData.duration ? `${classData.duration} hr` : '-';
        // Columns: S.No., Date, Day, Duration, Status, Mark, Remarks
        return [idx + 1, formatDate(date), day, durationText, statusText, mark, statusRaw ? 'Recorded' : 'No data'];
      }).filter(row => row[4] !== '-');

      if (detailRows.length === 0) {
        detailRows.push(['-', '-', '-', '-', 'No Records', '-', 'No data']);
      }

      autoTable(doc, {
        startY: currentY,
        headStyles: {
          fillColor: [105, 105, 105],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 9,
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 8,
          halign: 'center',
          cellPadding: { top: 3, bottom: 3 }
        },
        head: [['S.No.', 'Date', 'Day', 'Duration', 'Status', 'Mark', 'Remarks']],
        body: detailRows,
        theme: 'grid',
        styles: { lineWidth: 0.2, lineColor: [220, 220, 220] },
        tableWidth: 182,
        margin: { left: 14 },
        pageBreak: 'auto',
        showHead: 'everyPage'
      });

      currentY = doc.lastAutoTable.finalY + (subjectIndex < subjectList.length - 1 ? 15 : 20);
    });

    // CRITICAL NOTICE
    if (isOverallCritical) {
      const warningText = '**CRITICAL NOTICE: Attendance is below 75%. Please attend all upcoming classes regularly.';
      const boxWidth = 182;
      const textLines = doc.splitTextToSize(warningText, boxWidth - 10);
      const boxHeight = textLines.length * 6 + 10;

      currentY = checkPageBreak(doc, currentY, boxHeight + 10);
      if (currentY === MARGIN_TOP) {
        currentY += 10; // Just top margin, no header
      }

      doc.setLineWidth(0.2);
      doc.setFillColor(255, 245, 245);
      doc.setDrawColor(220, 20, 60);
      doc.rect(14, currentY, boxWidth, boxHeight, 'FD');

      doc.setTextColor(220, 20, 60);
      doc.setFont('times', 'bold');
      doc.setFontSize(12);

      textLines.forEach((line, idx) => {
        doc.text(line, 19, currentY + 10 + idx * 6);
      });

      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setLineWidth(0.1);

      currentY += boxHeight + 15;
    }

    // VERIFICATION SEAL
    currentY = checkPageBreak(doc, currentY, 50);
    if (currentY === MARGIN_TOP) {
      currentY += 10; // Just top margin, no header
    }

    drawVerificationSeal(doc, 140, currentY, 45);

    // Add footer only to the last page
    const pageCount = doc.internal.getNumberOfPages();
    doc.setPage(pageCount); // Go to last page
    const footerY = addFooter(doc);

    // Add roll number to footer
    doc.setTextColor(100, 100, 100).setFontSize(9);
    doc.text(`Student Roll No: ${studentData?.rollNo || "N/A"}`, 45, footerY + 14);

    // SAVE PDF
    const timestamp = new Date().toISOString().slice(0, 10);
    const fileName = `${(studentData?.name || "Student").replace(/\s+/g, '_')}_Attendance_Statement_${timestamp}.pdf`;
    doc.save(fileName);

    if (onSuccess) onSuccess(fileName);
  } catch (err) {
    console.error('PDF Generation Error:', err);
    if (onError) onError(err);
  }
};