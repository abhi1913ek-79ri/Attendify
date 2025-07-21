import { useParams, useNavigate } from "react-router-dom";
import { useStudent } from "../../store/StudentContext.jsx";
import { BadgeCheck, CalendarDays, ArrowLeft, User2, User, UserRound } from "lucide-react";
import './StudentProfileWithoutLogin.css';
import { assets } from "../../assets/assets.js";

const StudentProfile = () => {
  const { id } = useParams();
  const { students } = useStudent();
  const navigate = useNavigate();

  const student = students.find((stu) => String(stu.id) === id);

  if (!student) return <div className="text-center text-red-500">Student not found 😢</div>;

  return (
    <div className="profile-page">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="py-5 flex items-center text-blue-700 hover:text-blue-900 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      {/* Profile Box */}
      <div className="profile-container bg-white rounded shadow border border-gray-300">
        <div className="flex flex-col justify-between items-center space-y-2">
          <div className="profile-image-container">
            <img src={assets.placeHolder.profile_placeholder_image} alt="profile" className="profile-image" />
          </div>
          <h2 className="profile-heading">{student.name} ( {student.rollNo} )</h2>
        </div>
        <div className="profile-content-section">
          <p className="text-gray-600">
            <span className="label">Name : </span><span className="value">{student.name}</span>
          </p>
          <p className="text-gray-600">
            <span className="label">Student ID : </span><span className="value">{student.id}</span>
          </p>
          <p className="text-gray-600">
            <span className="label">Roll No : </span><span className="value">{student.rollNo}</span>
          </p>

          <p className="text-gray-600">
            <span className="label">Total Days : </span><span className="value">{student.attendance.totalDays}</span>
          </p>

          <p className="text-gray-600">
            <span className="label">Present: </span><span className="value">{student.attendance.present}</span>
          </p>

          <p className="text-gray-600">
            <span className="label">Attendance:</span><span className="value">{student.attendance.percentage}%</span>
          </p>

        </div>
        <hr className='text-gray-300' />
        <div className="last-marked-plus-isCritical">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
            <span className="text-blue-950"><span className="font-medium">Last Marked :</span> {student.attendance.lastMarked || 'Not Marked'}</span>
          </div>

          <div className="">
            {student.isCritical ? (
              <span className="text-red-500 font-medium flex items-center">⚠️ Critical Attendance</span>
            ) : (
              <span className="text-green-600 font-semibold flex items-center">
                <BadgeCheck className="w-5 h-5 mr-2" /> All Good
              </span>
            )}
          </div>
        </div>
      </div>
    </div>

  );
};

export default StudentProfile;
