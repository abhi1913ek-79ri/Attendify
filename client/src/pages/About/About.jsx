import React from 'react';
import styles from './About.module.css';
import { CalendarDays, Users, ShieldCheck, Rocket, BarChart3, FileDown, AlarmClock, Smartphone, CheckCircle, Cloud, Bell, User, Briefcase, Github, Mail } from 'lucide-react';

const features = [
    {
        icon: <CalendarDays size={32} />,
        title: 'Effortless Attendance',
        desc: 'Mark and manage attendance with a single click. No paperwork, no hassle—just clarity and speed.',
    },
    {
        icon: <Users size={32} />,
        title: 'For Every Classroom',
        desc: 'Built for students and educators. Attendify adapts to any branch, semester, or course.',
    },
    {
        icon: <ShieldCheck size={32} />,
        title: 'Secure & Private',
        desc: 'Your data is encrypted and protected. Only you control your academic records.',
    },
    {
        icon: <Rocket size={32} />,
        title: 'Fast & Modern',
        desc: 'Lightning-fast, mobile-friendly, and always up-to-date with the latest tech.',
    },
];

export default function About() {
    return (
        <div className={styles.aboutPage}>
            {/* Overview Card */}
            <div className={styles.projectCard}>
                <div className={styles.projectInfo}>
                    <h1>✨ About Attendify</h1>
                    <p className={styles.subtitle}>
                        Attendify is a modern attendance tracking solution built for students and educators.<br />
                        <span style={{ color: '#6366f1', fontWeight: '500' }}>
                            "Built for Students & Educators — Smart Attendance Made Simple."
                        </span>
                    </p>
                </div>
            </div>

            {/* Why Attendify Section */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}><Rocket size={20} style={{ marginRight: 4 }} /> Why Attendify?</h2>
                <ul className={styles.whyList}>
                    <li>Traditional attendance tracking is slow, error-prone, and hard to maintain. Attendify solves this with:</li>
                    <li><CheckCircle size={18} style={{ marginRight: 4, color: '#6366f1' }} /> One-click marking for speed</li>
                    <li><BarChart3 size={18} style={{ marginRight: 4, color: '#6366f1' }} /> Smart dashboards to analyze trends</li>
                    <li><FileDown size={18} style={{ marginRight: 4, color: '#6366f1' }} /> Exports to PDF/Excel for records</li>
                    <li><Bell size={18} style={{ marginRight: 4, color: '#6366f1' }} /> Reminders & notifications so no class is missed</li>
                    <li><Cloud size={18} style={{ marginRight: 4, color: '#6366f1' }} /> Cloud sync & mobile-friendly design for easy access anywhere</li>
                </ul>
            </section>

            {/* Key Features Section - Interactive Cards */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}><BarChart3 size={20} style={{ marginRight: 4 }} /> Key Features</h2>
                <div className={styles.featuresGrid}>
                    {features.map((f, i) => (
                        <div key={i} className={styles.featureCard}>
                            <div className={styles.icon}>{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
                <ul className={styles.featureList}>
                    <li><CheckCircle size={18} style={{ marginRight: 4, color: '#6366f1' }} /><b>One-Click Attendance</b> — Mark attendance instantly</li>
                    <li><BarChart3 size={18} style={{ marginRight: 4, color: '#6366f1' }} /><b>Live Dashboard</b> — Visualize attendance trends</li>
                    <li><Users size={18} style={{ marginRight: 4, color: '#6366f1' }} /><b>Student Profiles</b> — View stats & last attendance dates</li>
                    <li><CalendarDays size={18} style={{ marginRight: 4, color: '#6366f1' }} /><b>Date-wise Filtering</b> — Organize records by days or weeks</li>
                    <li><FileDown size={18} style={{ marginRight: 4, color: '#6366f1' }} /><b>Export Options</b> — Download reports in Excel/PDF</li>
                    <li><Bell size={18} style={{ marginRight: 4, color: '#6366f1' }} /><b>Smart Reminders</b> — Notifications for missed attendance</li>
                    <li><ShieldCheck size={18} style={{ marginRight: 4, color: '#6366f1' }} /><b>Secure & Private</b> — Your data stays encrypted</li>
                    <li><Cloud size={18} style={{ marginRight: 4, color: '#6366f1' }} /><b>Cloud Sync</b> — Access from any device</li>
                    <li><Smartphone size={18} style={{ marginRight: 4, color: '#6366f1' }} /><b>Mobile Friendly</b> — Works on desktop, tablet & phone</li>
                </ul>
            </section>

            {/* How It Works Section */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}><CalendarDays size={20} style={{ marginRight: 4 }} /> How It Works</h2>
                <ol className={styles.howList}>
                    <li><User size={18} style={{ marginRight: 4, color: '#6366f1' }} /><b>Sign Up & Add Class</b> → Create your class in seconds.</li>
                    <li><CheckCircle size={18} style={{ marginRight: 4, color: '#6366f1' }} /><b>Start Marking</b> → Mark attendance with a single click.</li>
                    <li><BarChart3 size={18} style={{ marginRight: 4, color: '#6366f1' }} /><b>Track & Export</b> → Analyze patterns and export reports anytime.</li>
                </ol>
            </section>

            {/* Tech Stack Section */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>🛠️ Tech Behind Attendify</h2>
                <ul className={styles.techList}>
                    <li><b>Frontend:</b> React.js + Tailwind CSS</li>
                    <li><b>Routing:</b> React Router</li>
                    <li><b>Icons:</b> Lucide React</li>
                    <li><b>Backend:</b> Node.js + Express.js</li>
                    <li><b>Database:</b> MongoDB (Mongoose ODM)</li>
                    <li><b>Authentication:</b> JWT (JSON Web Token) + bcrypt</li>
                    <li><b>Email Service:</b> NodeMailer (for notifications & verification)</li>
                    <li><b>Version Control:</b> Git & GitHub</li>
                    <li><b>Deployment:</b> Vercel (Frontend) + Render / Railway (Backend)</li>
                </ul>
            </section>

            {/* Live Preview Section */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>🌐 Live Preview</h2>
                <a className={styles.liveLink} href="https://attendifyattendkarley.me" target="_blank" rel="noopener noreferrer">👉 Try it out here</a>
            </section>

            {/* Team Members Section */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}><Users size={20} style={{ marginRight: 4 }} /> Team Members</h2>
                <div className={styles.teamGrid}>
                    {/* Abhishek Card */}
                    <div className={styles.teamCard}>
                        <div className={styles.teamHeader}>
                            <User size={32} style={{ color: '#6366f1' }} />
                            <span className={styles.teamName}><b>Abhishek Kumar Giri</b></span>
                        </div>
                        <div className={styles.teamInfo}>
                            <span className={styles.teamUniv}>Student at University School of Information Communication & Technology, GGSIPU Dwarka, New Delhi</span>
                        </div>
                        <div className={styles.teamLinks}>
                            <a href="https://www.linkedin.com/in/abhishek-kumar-giri-abhi1913ek-79ri" target="_blank" rel="noopener noreferrer"><Briefcase size={20} style={{ color: '#6366f1', marginRight: 4 }} /> LinkedIn</a>
                            <a href="https://github.com/abhi1913ek-79ri" target="_blank" rel="noopener noreferrer"><Github size={20} style={{ color: '#6366f1', marginRight: 4 }} /> GitHub</a>
                        </div>
                    </div>
                    {/* Rahul Card */}
                    <div className={styles.teamCard}>
                        <div className={styles.teamHeader}>
                            <User size={32} style={{ color: '#6366f1' }} />
                            <span className={styles.teamName}><b>Rahul Kumar</b></span>
                        </div>
                        <div className={styles.teamInfo}>
                            <span className={styles.teamUniv}>Student at University School of Information Communication & Technology, GGSIPU Dwarka, New Delhi</span>
                        </div>
                        <div className={styles.teamLinks}>
                            <a href="https://www.linkedin.com/in/rahul-kumar-84273134a/" target="_blank" rel="noopener noreferrer"><Briefcase size={20} style={{ color: '#6366f1', marginRight: 4 }} /> LinkedIn</a>
                            <a href="https://github.com/Rahul-Kumar-code" target="_blank" rel="noopener noreferrer"><Github size={20} style={{ color: '#6366f1', marginRight: 4 }} /> GitHub</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Acknowledgments Section */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}><ShieldCheck size={20} style={{ marginRight: 4 }} /> Acknowledgments</h2>
                <ul className={styles.ackList}>
                    <li><ShieldCheck size={18} style={{ marginRight: 4, color: '#6366f1' }} /> Icons powered by <a href="https://lucide.dev/" target="_blank" rel="noopener noreferrer">Lucide</a></li>
                    <li><Users size={18} style={{ marginRight: 4, color: '#6366f1' }} /> Inspired by students struggling with outdated attendance systems</li>
                </ul>
            </section>

            {/* Tagline Section */}
            <div className={styles.tagline}>
                <span>“Simplify attendance. Empower education.”</span>
            </div>
        </div>
    );
}