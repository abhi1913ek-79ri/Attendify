import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/ApiPaths';

const AddStudent = () => {
  const [formData, setFormData] = useState({
    // classId: '',
    name: '',
    rollNo: '',
    studentId: '',

  });

  const [user, setUser] = useState([]);
  // const [classes, setClasses] = useState([]);

  // Fetch users and classes for dropdown
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const res = await axios.get('/api/users');
  //       // const classesRes = await axios.get('/api/classes');
  //       setUser(res.data);
  //       // setClasses(classesRes.data);
  //     } catch (err) {
  //       toast.error('Failed to fetch profile');
  //     }
  //   };
  //   fetchProfile();
  // }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(API_PATHS.STUDENT.ADD, formData);
      toast.success('Student added successfully!');
      setFormData({ name: '', rollNo: '', studentId: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding student');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add New Student</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Class Dropdown
        <div>
          <label className="block mb-1 font-medium">Class</label>
          <select
            name="classId"
            value={formData.classId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>{cls.name}</option>
            ))}
          </select>
        </div> */}

        {/* Name Input */}
        <div>
          <label className="block mb-1 font-medium">Student Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* Roll No Input */}
        <div>
          <label className="block mb-1 font-medium">Roll Number</label>
          <input
            type="number"
            name="rollNo"
            value={formData.rollNo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        {/* Student Id Input */}
        <div>
          <label className="block mb-1 font-medium">Student Id</label>
          <input
            type="number"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Add Student
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
