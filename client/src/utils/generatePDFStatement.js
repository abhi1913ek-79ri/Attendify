import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { filterAttendanceByDate } from "./filterAttendanceUtility.js";

// 🔹 VERIFICATION SEAL UTILITY
const drawVerificationSeal = (doc, x, y, size = 40) => {
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const radius = size / 2;

  // Save current state
  const currentLineWidth = doc.internal.getLineWidth();

  // Set blue color for seal
  doc.setDrawColor(70, 130, 180); // Steel Blue
  doc.setTextColor(70, 130, 180);

  // Outer circle (main border)
  doc.setLineWidth(1.5);
  doc.circle(centerX, centerY, radius - 2, "S");

  // Inner circle
  doc.setLineWidth(1);
  doc.circle(centerX, centerY, radius - 6, "S");

  // Zigzag/serrated inner border
  doc.setLineWidth(0.5);
  const zigzagRadius = radius - 8;
  const points = 60;

  // Create zigzag pattern using individual lines
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

  // Text styling
  doc.setFont("helvetica", "bold");
  doc.setTextColor(70, 130, 180);

  // "VERIFIED" text - TOP POSITION
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  const verifiedText = "VERIFIED";
  const verifiedWidth = doc.getTextWidth(verifiedText);
  doc.text(verifiedText, centerX - verifiedWidth / 2, centerY - 6);

  // "Seal of Verification" text - MIDDLE POSITION
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  const text1 = "Seal of Verification";
  const text1Width = doc.getTextWidth(text1);
  doc.text(text1, centerX - text1Width / 2, centerY - 3);

  // Admin name - BOTTOM POSITION
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");

  const adminText1 = "Admin:";
  const adminWidth1 = doc.getTextWidth(adminText1);
  doc.text(adminText1, centerX - adminWidth1 / 2, centerY + 0);

  const adminText2 = "Abhishek Kumar Giri";
  const adminWidth2 = doc.getTextWidth(adminText2);
  doc.text(adminText2, centerX - adminWidth2 / 2, centerY + 3);

  // Generated Date and Time
  const currentDate = new Date();
  const dateStr = currentDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeStr = currentDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  doc.setFontSize(5);
  doc.setFont("helvetica", "normal");

  const dateText = `Generated: ${dateStr}`;
  const dateWidth = doc.getTextWidth(dateText);
  doc.text(dateText, centerX - dateWidth / 2, centerY + 7);

  const timeText = `Time: ${timeStr}`;
  const timeWidth = doc.getTextWidth(timeText);
  doc.text(timeText, centerX - timeWidth / 2, centerY + 9);

  // Restore original state
  doc.setLineWidth(currentLineWidth);
  doc.setDrawColor(0, 0, 0);
  doc.setTextColor(0, 0, 0);
};

// 🔹 WEBAPP DOWNLOAD UTILITY - SIMPLIFIED FOR REACT
const downloadPDFToDownloads = (doc, fileName, onSuccess, onError) => {
  try {
    const pdfOutput = doc.output("blob");
    const url = URL.createObjectURL(pdfOutput);
    const downloadLink = document.createElement("a");

    downloadLink.href = url;
    downloadLink.download = fileName;
    downloadLink.style.display = "none";
    downloadLink.setAttribute("target", "_blank");

    document.body.appendChild(downloadLink);
    downloadLink.click();

    setTimeout(() => {
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    }, 100);

    console.log(`✅ PDF Downloaded: ${fileName}`);

    // Call success callback for React component to handle toast
    if (onSuccess) onSuccess(fileName);

    // Browser notification if permitted
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("📥 Download Complete!", {
        body: `${fileName} saved to Downloads folder`,
      });
    }
  } catch (error) {
    console.error("❌ Download failed:", error);
    doc.save(fileName); // Fallback

    // Call error callback
    if (onError) onError(error);
  }
};

// 🔹 REQUEST PERMISSIONS UTILITY
const requestDownloadPermission = async () => {
  if ("Notification" in window && Notification.permission === "default") {
    try {
      await Notification.requestPermission();
    } catch (error) {
      console.log("Notification permission not available");
    }
  }
};

// 🔹 DATE FORMAT UTILITY
const formatDate = (dateStr) => {
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return new Date(dateStr).toLocaleDateString("en-IN", options);
};

// 🔹 UTILITY TO GET PRESENT DATES FOR A SUBJECT
const getPresentDatesForSubject = (subjectName, attendanceData) => {
  if (!attendanceData?.daily) return [];
  
  const dailyData = attendanceData.daily instanceof Map
    ? Object.fromEntries(attendanceData.daily)
    : attendanceData.daily;
    
  return Object.entries(dailyData || {})
    .filter(([key, status]) => 
      key.startsWith(`${subjectName}_`) && status === 'present'
    )
    .map(([key]) => key.split('_')[1])
    .sort((a, b) => new Date(b) - new Date(a));
};

// 🔹 MAIN PDF GENERATOR UTILITY FUNCTION
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
    await requestDownloadPermission();

    console.log('PDF Generation Data:', {
      studentData,
      attendanceData,
      overallStats,
      isOverallCritical
    });

    // ✅ REMOVED: filterAttendanceByDate call that was causing issues
    // const filteredAttendance = filterAttendanceByDate(studentData, fromDate, toDate);
    
    const doc = new jsPDF();

    // ✅ FIX 1: Get subjects from attendanceData, not studentData
    const subjects = attendanceData?.subjects || {};
    const totalSubjects = Object.keys(subjects).length;

    // ✅ FIX 2: Use proper fallback values and ensure numbers
    const totalPresent = Number(overallStats?.present) || 0;
    const totalClasses = Number(overallStats?.totalClasses) || 0;
    const overallPercentage = overallStats?.percentage ? Number(overallStats.percentage).toFixed(1) : "0.0";

    console.log('Calculated values:', {
      totalSubjects,
      totalPresent,
      totalClasses,
      overallPercentage
    });

    // 📋 Government Document Header
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 210, 25, "F");

    // Logo placeholder
    doc.setFillColor(70, 130, 180);
    doc.circle(20, 12, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("A", 17.5, 15);

    // Main Title - Centered
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    const title = "ATTENDIFY - ATTENDANCE STATEMENT";
    const titleWidth = doc.getTextWidth(title);
    const pageWidth = doc.internal.pageSize.width;
    doc.text(title, (pageWidth - titleWidth) / 2, 16);

    // Horizontal ruler
    doc.setDrawColor(70, 130, 180);
    doc.setLineWidth(1);
    doc.line(14, 28, 196, 28);

    // Document number
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Document No: ATT/${new Date().getFullYear()}/${String(
        Math.floor(Math.random() * 10000)
      ).padStart(4, "0")}`,
      14,
      35
    );

    // 📝 Student Information Section
    doc.setFillColor(249, 249, 249);
    doc.rect(14, 40, 182, 35, "F");
    doc.setDrawColor(189, 189, 189);
    doc.rect(14, 40, 182, 35, "S");

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(70, 130, 180);
    doc.text("STUDENT INFORMATION", 16, 48);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(`Full Name: ${studentData?.name || "N/A"}`, 16, 56);
    doc.text(`Roll Number: ${studentData?.rollNo || "N/A"}`, 16, 62);
    doc.text(`Student ID: ${studentData?.studentId || "N/A"}`, 16, 68);
    doc.text(
      `Date of Generation: ${formatDate(new Date().toISOString())}`,
      120,
      56
    );
    doc.text(
      `Academic Session: ${new Date().getFullYear()}-${
        new Date().getFullYear() + 1
      }`,
      120,
      62
    );

    // 📊 Overall Summary
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(70, 130, 180);
    doc.text("ATTENDANCE SUMMARY", 14, 88);

    autoTable(doc, {
      startY: 92,
      headStyles: {
        fillColor: [70, 130, 180],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 10,
        halign: "center",
      },
      bodyStyles: {
        fontSize: 10,
        halign: "center",
        cellPadding: { top: 5, bottom: 5 },
      },
      head: [
        [
          "Total Subjects",
          "Total Classes",
          "Classes Attended",
          "Overall Percentage",
          "Status",
        ],
      ],
      body: [
        [
          totalSubjects,
          totalClasses,
          totalPresent,
          `${overallPercentage}%`,
          parseFloat(overallPercentage) >= 75 ? "SATISFACTORY" : "CRITICAL",
        ],
      ],
      theme: "grid",
      styles: { lineWidth: 0.2, lineColor: [220, 220, 220] },
      tableWidth: 182,
      margin: { left: 14 },
    });

    // 📚 Subject-wise Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(70, 130, 180);
    doc.text(
      "SUBJECT-WISE ATTENDANCE DETAILS",
      14,
      doc.lastAutoTable.finalY + 15
    );

    // ✅ FIX 3: Better subject data handling
    const subjectTableBody = Object.entries(subjects).map(([subject, subjectStats], index) => {
      // Ensure we have valid numbers
      const totalClasses = Number(subjectStats?.total) || 0;
      const present = Number(subjectStats?.present) || 0;
      const absent = Math.max(0, totalClasses - present); // Ensure non-negative
      const percent = totalClasses === 0 ? "0.0" : ((present / totalClasses) * 100).toFixed(1);
      const status = parseFloat(percent) >= 75 ? "Good" : "Critical";

      console.log(`Subject ${subject}:`, {
        totalClasses,
        present,
        absent,
        percent,
        subjectStats
      });

      return [
        index + 1,
        subject,
        totalClasses,
        present,
        absent,
        `${percent}%`,
        status,
      ];
    });

    if (subjectTableBody.length === 0) {
      subjectTableBody.push([1, "No Subjects", 0, 0, 0, "0.0%", "N/A"]);
    }

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      headStyles: {
        fillColor: [100, 149, 237],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 9,
        halign: "center",
      },
      bodyStyles: {
        fontSize: 9,
        halign: "center",
        cellPadding: { top: 4, bottom: 4 },
      },
      head: [
        [
          "S.No.",
          "Subject Name",
          "Total Classes",
          "Present",
          "Absent",
          "Percentage",
          "Status",
        ],
      ],
      body: subjectTableBody,
      theme: "grid",
      styles: { lineWidth: 0.2, lineColor: [220, 220, 220] },
      tableWidth: 182,
      margin: { left: 14 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 50, halign: "center" },
        2: { cellWidth: 28 },
        3: { cellWidth: 22 },
        4: { cellWidth: 22 },
        5: { cellWidth: 25 },
        6: { cellWidth: 15 },
      },
    });

    // ✅ FIX 4: Daily attendance records for each subject
    Object.keys(subjects).forEach((subject, subjectIndex) => {
      if (doc.lastAutoTable.finalY > 250) {
        doc.addPage();
      }

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text(
        `DAILY ATTENDANCE RECORD - ${subject.toUpperCase()}`,
        14,
        doc.lastAutoTable.finalY + 15
      );

      // Get present dates for this specific subject
      const presentDates = getPresentDatesForSubject(subject, attendanceData);
      
      const detailRows = presentDates.map((date, idx) => {
        const d = new Date(date);
        const day = d.toLocaleDateString("en-IN", { weekday: "long" });
        return [idx + 1, formatDate(date), day, "Present", "P", "Regular Class"];
      });

      // Handle case where no present dates exist
      if (detailRows.length === 0) {
        detailRows.push([1, "-", "-", "No Records", "-", "No attendance data available"]);
      }

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        headStyles: {
          fillColor: [105, 105, 105],
          textColor: 255,
          fontStyle: "bold",
          fontSize: 9,
          halign: "center",
        },
        bodyStyles: {
          fontSize: 8,
          halign: "center",
          cellPadding: { top: 3, bottom: 3 },
        },
        head: [["S.No.", "Date", "Day", "Status", "Mark", "Remarks"]],
        body: detailRows,
        theme: "grid",
        styles: { lineWidth: 0.2, lineColor: [220, 220, 220] },
        tableWidth: 182,
        margin: { left: 14 },
        columnStyles: {
          0: { cellWidth: 22 },
          1: { cellWidth: 35 },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 },
          4: { cellWidth: 20 },
          5: { cellWidth: 45 },
        },
      });
    });

     // 🚨 Critical Status Warning - position after seal
    if (isOverallCritical) {
      // Check if we need more space for the warning box
      if (currentY > 180) {
        doc.addPage();
        currentY = 30;
      }
      
      const warningText =
        "**CRITICAL NOTICE: Attendance is below 75%. Please attend all upcoming classes regularly.";
      const boxWidth = 182;
      const textLines = doc.splitTextToSize(warningText, boxWidth - 5);
      const boxHeight = textLines.length * 6 + 6;

      doc.setLineWidth(0.2);
      doc.setFillColor(255, 245, 245);
      doc.setDrawColor(220, 20, 60);
      doc.rect(14, currentY, boxWidth, boxHeight, "FD");

      doc.setTextColor(220, 20, 60);
      doc.setFont("times", "bold");
      doc.setFontSize(12);

      textLines.forEach((line, idx) => {
        doc.text(line, 16, currentY + 10 + idx * 6);
      });

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.setLineWidth(0.1);
      
      currentY += boxHeight + 20; // Update position after warning box
    }

    // ✅ FIX: Position verification seal right after subject tables
let sealY = doc.lastAutoTable.finalY + 25;
const pageHeight = doc.internal.pageSize.height;

// If the seal would overflow the current page, start a new page
if (sealY + 45 + 20 > pageHeight) { // 45 = seal height, 20 = margin
  doc.addPage();
  sealY = 30; // Top margin for new page
}

// Center horizontally (or use fixed X if you want)
const sealX = pageHeight > 200 ? 140 : (doc.internal.pageSize.width / 2) - 22.5; // 45/2 = half seal width

console.log("Drawing verification seal at:", { x: sealX, y: sealY });
drawVerificationSeal(doc, sealX, sealY, 45);

// Move Y down for any content after the seal
let currentY = sealY + 60; // seal height + margin

// 📋 Footer always at bottom
const footerY = pageHeight - 40;


    doc.setFillColor(248, 249, 250);
    doc.rect(0, footerY - 5, 210, 45, "F");

    doc.setDrawColor(70, 130, 180);
    doc.setLineWidth(0.8);
    doc.line(14, footerY, 196, footerY);

    // Footer logo placeholder
    doc.setFillColor(70, 130, 180);
    doc.circle(24, footerY + 15, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("A", 21, footerY + 18);
    doc.setTextColor(0, 0, 0);

    // Footer content
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);

    const currentDate = formatDate(new Date().toISOString());
    const currentTime = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    doc.text(`Generated on: ${currentDate} at ${currentTime}`, 45, footerY + 8);
    doc.text(`Student Roll No: ${studentData?.rollNo || "N/A"}`, 45, footerY + 14);
    doc.text("This is a computer-generated document", 45, footerY + 20);
    doc.text("No signature required", 45, footerY + 26);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(70, 130, 180);
    doc.text("ATTENDIFY", 45, footerY + 32);

    // 💾 Download with React callbacks
    const timestamp = new Date().toISOString().slice(0, 10);
    const fileName = `${(studentData?.name || "Student").replace(
      /\s+/g,
      "_"
    )}_Attendance_Statement_${timestamp}.pdf`;

    console.log('Attempting to download PDF:', fileName);
    downloadPDFToDownloads(doc, fileName, onSuccess, onError);
    return fileName;
    
  } catch (error) {
    console.error('PDF Generation Error:', error);
    if (onError) {
      onError(error);
    }
    throw error;
  }
};