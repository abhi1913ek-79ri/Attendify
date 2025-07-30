import { useParams, useNavigate } from "react-router-dom";
import { useStudent } from "../../store/StudentContext.jsx";
import { BadgeCheck, CalendarDays, ArrowLeft, User2, User, UserRound } from "lucide-react";
import './StudentProfileWithoutLogin.css';
import { assets } from "../../assets/assets.js";
import { v4 as uuidv4 } from 'uuid';
import StudentHeatmapCalendar from "../../components/StudentCalendar/StudentHeatmapCalendar.jsx";

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
      <div className="profile-container">
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
            <span className="label">Total Days : </span><span className="value">{student.overall.totalClasses}</span>
          </p>

          <p className="text-gray-600">
            <span className="label">Present: </span><span className="value">{student.overall.present}</span>
          </p>

          <p className="text-gray-600">
            <span className="label">Attendance:</span><span className="value">{student.overall.percentage}%</span>
          </p>

        </div>
        <hr className='text-gray-300' />
        {/* Students Subject */}
        <div className="last-marked-plus-isCritical">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
            <span className="text-blue-950"><span className="font-medium">Last Marked :</span> {student.overall.lastMarked || 'Not Marked'}</span>
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

      <div className="student-subjects">
          <h3 className="student-subjects-heading">Subject Wise Attendance of <span className="font-bold">{student.name}</span></h3>
          <div className="student-subject-list scrollbar-hide">
            <table id="student-subject-table" className="min-w-full divide-y divide-gray-300  text-left max-md:min-w-[600px] table-auto border-collapse">
              <thead className="text-[#F9F9FB] bg-blue-950">
                <tr>
                  <th className="table-data">#</th>
                  <th className="table-data">Subject</th>
                  <th className="table-data">Total Classes</th>
                  <th className="table-data">Present</th>
                  <th className="table-data">%</th>
                  <th className="table-data">Last Marked</th>

                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white ">
                {student.subjects.map((subject, index) => {
                  const record = student.attendance[subject] || {};
                  return (
                    <tr key={uuidv4()} >
                      <td className="table-data">{index + 1}</td>
                      <td className="table-data">{subject}</td>
                      <td className="table-data">{record.totalClasses ?? '-'}</td>
                      <td className="table-data">{record.present ?? '-'}</td>
                      <td className="table-data">{record.percentage ?? '-'}</td>
                      <td className="table-data">{record.lastMarked ?? '-'}</td>
                    </tr>
                  );
                })}
                <tr id="student-subject-total" key={uuidv4()}>
                  <td colSpan={2} className="table-data total"><span className="font-medium">Total</span></td>
                  <td className="table-data"><span className="font-medium">{student.overall.totalClasses}</span></td>
                  <td className="table-data"><span className="font-medium">{student.overall.present}</span></td>
                  <td className="table-data"><span className="font-medium">{student.overall.percentage}</span></td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

      <div className="student-calendar">
        <StudentHeatmapCalendar presentDates={student.overall.presentDates} />
      </div>
    </div>

  );
};

export default StudentProfile;
