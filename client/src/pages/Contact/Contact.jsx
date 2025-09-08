import React from 'react';
import styles from './Contact.module.css';
import { Mail, Briefcase, Github, User, Users } from 'lucide-react';

export default function Contact() {
    return (
        <div className={styles.contactPage}>
            <div className={styles.header}>
                <h1>Contact Us</h1>
                <p className={styles.subtitle}>Reach out to the Attendify team for support, feedback, or collaboration!</p>
            </div>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}><Mail size={20} style={{ marginRight: 4 }} /> Official Email</h2>
                <div className={styles.officialEmailBox}>
                    <Mail size={18} style={{ marginRight: 4, color: '#6366f1' }} />
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=attendify.attend.karle@gmail.com">attendify.attend.karle@gmail.com</a>
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}><Users size={20} style={{ marginRight: 4 }} /> Creators</h2>
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
                            <a href="https://github.com/Rahul-Kumar-code" target="_blank" rel="noopener noreferrer"><Github size={20} style={{ color: '#6366f1', marginRight: 4 }} /> GitHub</a>
                            <a href="https://www.linkedin.com/in/rahul-kumar-84273134a/" target="_blank" rel="noopener noreferrer"><Briefcase size={20} style={{ color: '#6366f1', marginRight: 4 }} /> LinkedIn</a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
