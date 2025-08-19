import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  curr.setHours(0,0,0,0);
  end.setHours(0,0,0,0);
  while (curr <= end) {
    const y = curr.getFullYear();
    const m = String(curr.getMonth() + 1).padStart(2, '0');
    const d = String(curr.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${d}`);
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
};

// 🔹 VERIFICATION SEAL
const drawVerificationSeal = (doc, x, y, size = 40) => {
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const radius = size / 2;

  const currentLineWidth = doc.internal.getLineWidth();
  doc.setDrawColor(70, 130, 180);
  doc.setTextColor(70, 130, 180);

  doc.setLineWidth(1.5);
  doc.circle(centerX, centerY, radius - 2, 'S');
  doc.setLineWidth(1);
  doc.circle(centerX, centerY, radius - 6, 'S');

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

  doc.setLineWidth(currentLineWidth).setDrawColor(0, 0, 0).setTextColor(0, 0, 0);
};

// 🔹 MAIN PDF GENERATOR (final fixed version)
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

    // Prefer subjects defined on the student. If student has subjects, use them; otherwise fall back to attendanceData subjects.
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

    // HEADER
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 210, 25, 'F');
    doc.setFillColor(70, 130, 180);
    doc.circle(20, 12, 8, 'F');
    doc.setTextColor(255, 255, 255).setFontSize(12).setFont('helvetica', 'bold').text('A', 17.5, 15);
    doc.setTextColor(0, 0, 0).setFontSize(18).setFont('helvetica', 'bold');
    const title = 'ATTENDIFY - ATTENDANCE STATEMENT';
    doc.text(title, (doc.internal.pageSize.width - doc.getTextWidth(title)) / 2, 16);
    doc.setDrawColor(70, 130, 180).setLineWidth(1).line(14, 28, 196, 28);
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text(`Document No: ATT/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`, 14, 35);

    // STUDENT INFO
    doc.setFillColor(249, 249, 249).rect(14, 40, 182, 35, 'F').setDrawColor(189, 189, 189).rect(14, 40, 182, 35, 'S');
    doc.setFontSize(12).setFont('helvetica', 'bold').setTextColor(70, 130, 180).text('STUDENT INFORMATION', 16, 48);
    doc.setFontSize(10).setFont('helvetica', 'normal').setTextColor(0, 0, 0);
    doc.text(`Full Name: ${studentData?.name || "N/A"}`, 16, 56);
    doc.text(`Roll Number: ${studentData?.rollNo || "N/A"}`, 16, 62);
    doc.text(`Statement Period: ${formatDate(fromDate)} to ${formatDate(toDate)}`, 16, 68);
    doc.text(`Date of Generation: ${formatDate(new Date().toISOString())}`, 120, 56);
    doc.text(`Academic Session: ${new Date().getFullYear()}-${new Date().getFullYear() + 1}`, 120, 62);

    // OVERALL SUMMARY
    doc.setFontSize(12).setFont('helvetica', 'bold').setTextColor(70, 130, 180).text('ATTENDANCE SUMMARY', 14, 88);
    autoTable(doc, {
      startY: 92,
      headStyles: { fillColor: [70, 130, 180], textColor: 255, fontStyle: 'bold', fontSize: 10, halign: 'center' },
      bodyStyles: { fontSize: 10, halign: 'center', cellPadding: { top: 5, bottom: 5 } },
      head: [['Total Subjects', 'Total Classes', 'Classes Attended', 'Overall Percentage', 'Status']],
      body: [[totalSubjects, totalClasses, totalPresent, `${overallPercentage}%`, parseFloat(overallPercentage) >= 75 ? 'SATISFACTORY' : 'CRITICAL']],
      theme: 'grid',
      styles: { lineWidth: 0.2, lineColor: [220, 220, 220] },
      tableWidth: 182,
      margin: { left: 14 }
    });

    // SUBJECT-WISE DETAILS
    let currentY = doc.lastAutoTable.finalY + 8;
    doc.setFontSize(12).setFont('helvetica', 'bold').setTextColor(70, 130, 180).text('SUBJECT-WISE ATTENDANCE DETAILS', 14, currentY);

    // Build subject-wise table using authoritative subjectList
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
      startY: doc.lastAutoTable.finalY + 5,
      headStyles: { fillColor: [100, 149, 237], textColor: 255, fontStyle: 'bold', fontSize: 9, halign: 'center' },
      bodyStyles: { fontSize: 9, halign: 'center', cellPadding: { top: 4, bottom: 4 } },
      head: [['S.No.', 'Subject Name', 'Total Classes', 'Present', 'Absent', 'Percentage', 'Status']],
      body: subjectTableBody,
      theme: 'grid',
      styles: { lineWidth: 0.2, lineColor: [220, 220, 220] },
      tableWidth: 182,
      margin: { left: 14 }
    });

    // DAILY RECORDS - iterate over authoritative subjectList and normalize daily lookup
    const dateRange = getDatesInRange(fromDate, toDate);
    const rawDaily = attendanceData?.daily;
    const dailyObj = rawDaily instanceof Map ? Object.fromEntries(rawDaily) : (rawDaily || {});

    subjectList.forEach((subject) => {
      if (doc.lastAutoTable.finalY > 260) doc.addPage();
      let dailyStartY = doc.lastAutoTable.finalY + 8;
      doc.setFontSize(11).setFont('helvetica', 'bold').setTextColor(70, 130, 180).text(`DAILY ATTENDANCE RECORD - ${subject.toUpperCase()}`, 14, dailyStartY);

      const detailRows = dateRange.map((date, idx) => {
        const d = new Date(date);
        const day = d.toLocaleDateString('en-IN', { weekday: 'long' });
        const key = `${subject}_${date}`;
        const statusRaw = dailyObj[key] || null;
        const statusText = statusRaw === 'present' ? 'Present' : statusRaw === 'absent' ? 'Absent' : '-';
        const mark = statusRaw === 'present' ? 'P' : statusRaw === 'absent' ? 'A' : '-';
        return [idx + 1, formatDate(date), day, statusText, mark, statusRaw ? 'Recorded' : 'No data'];
      }).filter(row => row[3] !== '-' );

      autoTable(doc, {
        startY: dailyStartY + 5,
        headStyles: { fillColor: [105, 105, 105], textColor: 255, fontStyle: 'bold', fontSize: 9, halign: 'center' },
        bodyStyles: { fontSize: 8, halign: 'center', cellPadding: { top: 3, bottom: 3 } },
        head: [['S.No.', 'Date', 'Day', 'Status', 'Mark', 'Remarks']],
        body: detailRows.length ? detailRows : [['-', '-', '-', 'No Records', '-', 'No data']],
        theme: 'grid',
        styles: { lineWidth: 0.2, lineColor: [220, 220, 220] },
        tableWidth: 182,
        margin: { left: 14 }
      });
    });

    // CRITICAL NOTICE with page break check
    let lastY = doc.lastAutoTable.finalY + 10;
    if (isOverallCritical) {
      const warningText = '**CRITICAL NOTICE: Attendance is below 75%. Please attend all upcoming classes regularly.';
      const boxWidth = 182;
      const textLines = doc.splitTextToSize(warningText, boxWidth - 5);
      const boxHeight = textLines.length * 6 + 6;

      if (lastY + boxHeight > doc.internal.pageSize.height - 60) {
        doc.addPage();
        lastY = 40;
      }

      doc.setLineWidth(0.2).setFillColor(255, 245, 245).setDrawColor(220, 20, 60).rect(14, lastY, boxWidth, boxHeight, 'FD');
      doc.setTextColor(220, 20, 60).setFont('times', 'bold').setFontSize(12);
      textLines.forEach((line, idx) => {
        doc.text(line, 16, lastY + 10 + idx * 6);
      });
      doc.setTextColor(0, 0, 0).setFont('helvetica', 'normal').setLineWidth(0.1);

      lastY += boxHeight + 15;
    }

    // SEAL with page break check
    if (lastY + 60 > doc.internal.pageSize.height - 40) {
      doc.addPage();
      lastY = 40;
    }
    drawVerificationSeal(doc, 140, lastY, 45);

    // FOOTER
    const footerY = doc.internal.pageSize.height - 40;
    doc.setFillColor(248, 249, 250).rect(0, footerY - 5, 210, 45, 'F');
    doc.setDrawColor(70, 130, 180).setLineWidth(0.8).line(14, footerY, 196, footerY);
    doc.setFillColor(70, 130, 180).circle(24, footerY + 15, 10, 'F');
    doc.setTextColor(255, 255, 255).setFontSize(14).setFont('helvetica', 'bold').text('A', 21, footerY + 18);
    doc.setTextColor(0, 0, 0).setFontSize(9).setFont('helvetica', 'normal').setTextColor(100, 100, 100);
    const currentDate = formatDate(new Date().toISOString());
    const currentTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    doc.text(`Generated on: ${currentDate} at ${currentTime}`, 45, footerY + 8);
    doc.text(`Student Roll No: ${studentData?.rollNo || "N/A"}`, 45, footerY + 14);
    doc.text('This is a computer-generated document', 45, footerY + 20);
    doc.text('No signature required', 45, footerY + 26);
    doc.setFontSize(10).setFont('helvetica', 'bold').setTextColor(70, 130, 180).text('ATTENDIFY', 45, footerY + 32);

    // SAVE
    const timestamp = new Date().toISOString().slice(0, 10);
    const fileName = `${(studentData?.name || "Student").replace(/\s+/g, '_')}_Attendance_Statement_${timestamp}.pdf`;
    doc.save(fileName);
    if (onSuccess) onSuccess(fileName);
  } catch (err) {
    console.error('PDF Generation Error:', err);
    if (onError) onError(err);
  }
};
