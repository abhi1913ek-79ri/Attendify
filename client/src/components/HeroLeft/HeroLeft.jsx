import React, { useEffect, useState } from "react";
import "./HeroLeft.css";
import { Link} from "react-router-dom";
import { useAuth } from "../../store/AuthContext";

const lines = [
    "Smart Attendance.",
    "Track & Succeed.",
];

const HeroLeft = () => {
    const [index, setIndex] = useState(0);
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [speed, setSpeed] = useState(100);
    const {user} = useAuth();

    useEffect(() => {
        const current = lines[index % lines.length];

        const typing = setTimeout(() => {
            setText((prev) =>
                isDeleting ? current.substring(0, prev.length - 1) : current.substring(0, prev.length + 1)
            );

            if (!isDeleting && text === current) {
                setTimeout(() => setIsDeleting(true), 1000);
                setSpeed(50);
            } else if (isDeleting && text === "") {
                setIsDeleting(false);
                setIndex((prev) => (prev + 1) % lines.length);
                setSpeed(150);
            }
        }, speed);

        return () => clearTimeout(typing);
    }, [text, isDeleting, index, speed]);

    return (
        <div className="hero-left max-md:min-h-64 gap-1.5">
            <h1 className="typewriter-text my-0">{text}<span className="cursor"></span></h1>
            <p className="text-justify text-blue-950">Effortlessly mark and manage attendance — Attendify streamlines your academic life with a click. Built for classrooms that value time and clarity.</p>
            <div className="btn-conatiner w-full flex gap-2.5 ">
                <button className="btn-register"><Link to={user?`/user-profile` : `/register`}>Get Started</Link></button>
                <a href="#features" className="btn-features">See Features</a>
            </div>


        </div>
    );
};

export default HeroLeft;
