import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/ApiPaths";
import { toast } from "react-toastify";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";
import "./AddStudent.css";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { useStudent } from "../../store/StudentContext";
import { useLocation } from "react-router-dom";


const AddStudent = () => {
  const { student, setStudent} = useStudent();
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    studentId: "",
    // profileImageUrl: '',
    subjects: {}, // will be populated from inputs
  });

  const navigate = useNavigate();
  const [subjectInputs, setSubjectInputs] = useState([{ key: "", value: "" }]);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);


const location = useLocation();

useEffect(() => {
  if (student && location.pathname !== "/user-profile") {
    navigate("/user-profile");
  }
}, [student, navigate, location.pathname]);


  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...subjectInputs];
    updatedSubjects[index][field] = value;
    setSubjectInputs(updatedSubjects);
  };

  const addSubjectField = () => {
    setSubjectInputs([...subjectInputs, { key: "", value: "" }]);
  };

  const removeSubjectField = (index) => {
    const updated = [...subjectInputs];
    updated.splice(index, 1);
    setSubjectInputs(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert subjectInputs to an object
    const subjectsObject = {};
    subjectInputs.forEach(({ key, value }) => {
      if (key.trim()) {
        subjectsObject[key.trim()] = value.trim();
      }
    });

    try {
      const payload = {
        ...formData,
        subjects: subjectsObject,
      };
      setLoading(true);
      const res = await axiosInstance.post(API_PATHS.STUDENT.ADD, payload);
      toast.success("Student added successfully");
      setStudent(res.data);
      navigate("/user-profile");
      setFormData({
        name: "",
        rollNo: "",
        studentId: "",
        // profileImageUrl: '',
        subjects: {},
      });
      setSubjectInputs([{ key: "", value: "" }]);
    } catch (error) {
      const firstErr =
        error.response?.data?.errors?.[0]?.msg || "Error adding student";
      toast.error(firstErr);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add As Student</h2>
      <form onSubmit={handleSubmit} className="form">
        <input type="file" accept="image/*" className="hidden" />
        <div className="img-upload">
          {!image ? (
            <div className="w-21 h-21 flex justify-center items-center bg-sky-100 rounded-full relative cursor-pointer">
              <LuUser className="text-4xl text-indigo-500" />
              <button
                type="button"
                className="w-9 h-9 flex items-center justify-center absolute bg-linear-to-r from-indigo-500/85 to-indigo-600 text-white rounded-full -bottom-1 -right-1 cursor-pointer"
              >
                <LuUpload />
              </button>
            </div>
          ) : (
            <div className="relative">
              <img
                src={preview || previewUrl}
                alt="profile photo"
                className="w-21 h-21 rounded-full object-cover border-2 border-orange-200"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="w-9 h-9 bg-rose-500 flex items-center justify-center text-white rounded-full absolute -bottom-2 -right-2 cursor-pointer"
              >
                <LuTrash />
              </button>
            </div>
          )}
        </div>
        {/* Name */}
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        {/* Roll No */}
        <div className="form-group">
          <label className="form-label">Roll Number</label>
          <input
            type="text"
            name="rollNo"
            value={formData.rollNo}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        {/* Student ID */}
        <div className="form-group">
          <label className="form-label">Student ID</label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        {/* Subjects Input */}
        <div className="form-group">
          <label className="form-label">Subjects</label>
          {subjectInputs.map((input, index) => (
            <div key={index} className="subject-row">
              <input
                type="text"
                placeholder="Subject Code"
                value={input.value}
                onChange={(e) =>
                  handleSubjectChange(index, "value", e.target.value)
                }
                className="form-input"
              />
               <input
                type="text"
                placeholder="Subject"
                value={input.key}
                onChange={(e) =>
                  handleSubjectChange(index, "key", e.target.value)
                }
                className="form-input"
              />
              <button
                type="button"
                onClick={() => removeSubjectField(index)}
                className="remove-subject-btn"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSubjectField}
            className="add-subject-btn"
          >
            + Add Subject
          </button>
        </div>

        {/* Submit */}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? <Loader /> : <span>Add Student</span>}
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
