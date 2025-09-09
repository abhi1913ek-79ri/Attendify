import React from 'react';
import styles from './HowToUse.module.css';
import { assets } from '../../assets/assets';
import { CheckCircle, CalendarCheck, BarChart3, FileDown } from 'lucide-react';

export default function HowToUse() {
    return (
        <div className={styles.howToUsePage}>
            <h1 className={styles.title}>How to Use Attendify</h1>
            <ol className={styles.stepsList}>
                <li>
                    <CheckCircle size={20} className={styles.icon} /> <b>Sign Up / Login:</b> Create your account or log in as a student or educator.
                    <div className={styles.stepImage} style={{ padding: 0, margin: 0 }}>
                        <img src={assets.ilustrations.signup_illustration} alt="Sign up or login illustration" style={{ width: '100%', display: 'block', padding: 0, margin: 0 }} />
                    </div>
                </li>
                <li>
                    <CheckCircle size={20} className={styles.icon} /> <b>Add Students:</b> Enter student details or import from Excel.
                    <div className={styles.stepImage} style={{ padding: 0, margin: 0 }}>
                        <img src={assets.ilustrations.add_students_illustration} alt="Add students illustration" style={{ width: '100%', display: 'block', padding: 0, margin: 0 }} />
                    </div>
                </li>
                <li>
                    <CalendarCheck size={20} className={styles.icon} /> <b>Add Your Class:</b> Set up your class details (branch, semester, subjects, etc.).
                    <div className={styles.stepImage} style={{ padding: 0, margin: 0 }}>
                        <img src={assets.ilustrations.add_class_illustration} alt="Add class illustration" style={{ width: '100%', display: 'block', padding: 0, margin: 0 }} />
                    </div>
                </li>
                <li>
                    <CalendarCheck size={20} className={styles.icon} /> <b>Mark Attendance:</b> Use the one-click button to mark daily attendance for each student.
                    <div className={styles.stepImage} style={{ padding: 0, margin: 0 }}>
                        <img src={assets.ilustrations.mark_attendance_illustration} alt="Mark attendance illustration" style={{ width: '100%', display: 'block', padding: 0, margin: 0 }} />
                    </div>
                </li>
                <li>
                    <BarChart3 size={20} className={styles.icon} /> <b>View Dashboard:</b> Analyze attendance stats, trends, and summaries in real-time.
                    <div className={styles.stepImage} style={{ padding: 0, margin: 0 }}>
                        <img src={assets.ilustrations.dashboard_illustration} alt="Dashboard illustration" style={{ width: '100%', display: 'block', padding: 0, margin: 0 }} />
                    </div>
                </li>
                <li>
                    <FileDown size={20} className={styles.icon} /> <b>Export Reports:</b> Download attendance data in Excel or PDF format for record-keeping.
                    <div className={styles.stepImage} style={{ padding: 0, margin: 0 }}>
                        <img src={assets.ilustrations.export_illustration} alt="Export reports illustration" style={{ width: '100%', display: 'block', padding: 0, margin: 0 }} />
                    </div>
                </li>
            </ol>
            <div className={styles.tipsSection}>
                <h2>Tips & Best Practices</h2>
                <ul>
                    <li>Use the sidebar for quick navigation between pages.</li>
                    <li>Check the dashboard for live updates and summaries.</li>
                    <li>Export your attendance regularly for backup.</li>
                    <li>Contact support via the Contact page for any issues.</li>
                </ul>
            </div>
        </div>
    );
}
