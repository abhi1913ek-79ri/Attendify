import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/ApiPaths";
import { toast } from "react-toastify";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";
import "./AddStudent.css";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { useStudent } from "../../store/StudentContext";
import { useLocation } from "react-router-dom";
import { SUBJECT_CATALOG, NAME_TO_CODE, CODE_TO_NAME, SUBJECT_NAMES } from "../../config/subjectConfig";


const AddStudent = () => {
  const { student, setStudent} = useStudent();
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    rollNo: "",
    subjects: {}, // will be populated from inputs
  });

  const navigate = useNavigate();
  const rollInputRef = useRef(null);
  const didPrefillRef = useRef(false);
  // subjectInputs: { key: subjectName, value: subjectCode }
  const [subjectInputs, setSubjectInputs] = useState([{ key: "", value: "" }]);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);


const location = useLocation();

useEffect(() => {
  if (student && location.pathname !== "/user-profile") {
    navigate("/user-profile");
  }
}, [student, navigate, location.pathname]);

// Prefill name and auto-focus roll number when student info is available
useEffect(() => {
  if (!student) return;
  if (didPrefillRef.current) return;
  // only prefill when name input is empty
  setFormData((prev) => {
    if (prev.name && prev.name.trim() !== '') return prev;
    return { ...prev, name: student.name || prev.name };
  });
  // focus roll number input after a short delay
  setTimeout(() => {
    try { rollInputRef.current?.focus(); } catch (e) {}
  }, 50);
  didPrefillRef.current = true;
}, [student]);


  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubjectChange = (index, field, value) => {
    const updated = [...subjectInputs];
    // If user selects a known subject name, auto-fill its code
    if (field === 'key') {
      const name = value;
      const autoCode = NAME_TO_CODE[name] || updated[index].value;
      updated[index] = { key: name, value: autoCode };
    } else if (field === 'value') {
      // If user types a known code, auto-fill the name
      const code = value;
      const autoName = CODE_TO_NAME[code] || updated[index].key;
      updated[index] = { key: autoName, value: code };
    }
    setSubjectInputs(updated);
  };

  const addSubjectField = () => {
    setSubjectInputs([...subjectInputs, { key: "", value: "" }]);
  };

  const removeSubjectField = (index) => {
    const updated = [...subjectInputs];
    updated.splice(index, 1);
    setSubjectInputs(updated);
  };

  // Image handling functions
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview("");
    // Clear the file input
    const fileInput = document.getElementById('profileImageInput');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert subjectInputs to an object: { [subjectName]: subjectCode }
    const subjectsObject = {};
    subjectInputs.forEach(({ key, value }) => {
      const name = key?.trim();
      const code = value?.trim();
      if (name) {
        // If name matches catalog and code is missing, auto derive
        const finalCode = code || NAME_TO_CODE[name] || '';
        subjectsObject[name] = finalCode;
      }
    });

    try {
      // Create FormData to handle file upload
      const formDataPayload = new FormData();
      formDataPayload.append('name', formData.name);
      formDataPayload.append('course', formData.course);
      formDataPayload.append('rollNo', formData.rollNo);
      formDataPayload.append('subjects', JSON.stringify(subjectsObject));
      
      // Add profile image if selected
      if (profileImage) {
        formDataPayload.append('profileImage', profileImage);
      }

      setLoading(true);
      const res = await axiosInstance.post(API_PATHS.STUDENT.ADD, formDataPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success("Student added successfully");
      setStudent(res.data);
      navigate("/user-profile");
      
      // Reset form
      setFormData({
        name: "",
        course: "",
        rollNo: "",
        subjects: {},
      });
      setSubjectInputs([{ key: "", value: "" }]);
      removeImage();
    } catch (error) {
      const firstErr =
        error.response?.data?.errors?.[0]?.msg || "Error adding student";
      toast.error(firstErr);
    } finally {
      setLoading(false);
    }
  };

    const handleFormKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add As Student</h2>
      <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className="form">
        {/* Profile Image Upload */}
        <input 
          type="file" 
          id="profileImageInput"
          accept="image/*" 
          onChange={handleImageChange}
          className="hidden" 
        />
        <div className="img-upload">
          {!imagePreview ? (
            <div 
              className="w-21 h-21 flex justify-center items-center bg-sky-100 rounded-full relative cursor-pointer"
              onClick={() => document.getElementById('profileImageInput').click()}
            >
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
                src={imagePreview}
                alt="profile photo"
                className="w-21 h-21 rounded-full object-cover border-2 border-orange-200"
              />
              <button
                type="button"
                onClick={removeImage}
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

        {/* Roll No. */}
        <div className="form-group">
          <label className="form-label">Roll No.</label>
          <input
            type="text"
            name="rollNo"
            ref={rollInputRef}
            value={formData.rollNo}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

  {/* Course & Sem */}
        <div className="form-group">
          <label className="form-label">Course & Semester</label>
          <input
            type="text"
            name="course"
            value={formData.course}
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
              {/* Code input with datalist */}
              <input
                list="subject-codes"
                type="text"
                placeholder="Subject Code"
                value={input.value}
                onChange={(e) => handleSubjectChange(index, "value", e.target.value)}
                className="form-input"
              />
              {/* Name input with datalist */}
              <input
                list="subject-names"
                type="text"
                placeholder="Subject Name"
                value={input.key}
                onChange={(e) => handleSubjectChange(index, "key", e.target.value)}
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
          {/* Datalists for suggestions */}
          <datalist id="subject-names">
            {SUBJECT_NAMES.map((n) => (
              <option key={n} value={n} />
            ))}
          </datalist>
          <datalist id="subject-codes">
            {SUBJECT_CATALOG.map((s) => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </datalist>
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
