import React, { useState, useEffect } from 'react';
import './Settings.css';
import { useStudent } from '../../store/StudentContext';
import { useAttendance } from '../../store/AttendanceContext';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';

const Settings = () => {
  const { student, fetchStudent } = useStudent();
  const { fetchAttendanceData } = useAttendance();
  const [subjects, setSubjects] = useState({});
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState(null);

  useEffect(() => {
    if (student) {
      // Student.subjects may be a Map or object
      const s = student.subjects && student.subjects instanceof Map
        ? Object.fromEntries(student.subjects)
        : (student.subjects || {});
      setSubjects(s);
    }
  }, [student]);

  const handleAdd = async () => {
    const name = (newSubjectName || '').trim();
    const code = (newSubjectCode || '').trim();
    if (!name) return toast.error('Enter subject name');
    setSaving(true);
    try {
  const payload = { add: { [name]: code } };
  const res = await axiosInstance.patch('/api/student/subjects', payload);
  setSubjects(res.data.student.subjects instanceof Object ? res.data.student.subjects : Object.fromEntries(res.data.student.subjects || []));
      setNewSubjectName('');
      setNewSubjectCode('');
      toast.success('Subject added');
  fetchStudent?.();
  fetchAttendanceData?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add subject');
    } finally { setSaving(false); }
  };

  const handleRemove = (name) => {
    setPendingRemoval(name);
    setModalOpen(true);
  };

  const confirmRemoval = async () => {
    const name = pendingRemoval;
    setModalOpen(false);
    setPendingRemoval(null);
    if (!name) return;
    setSaving(true);
    try {
      const payload = { remove: [name] };
      const res = await axiosInstance.patch('/api/student/subjects', payload);
      setSubjects(res.data.student.subjects instanceof Object ? res.data.student.subjects : Object.fromEntries(res.data.student.subjects || []));
      toast.success('Subject removed');
  fetchStudent?.();
  // attendance data may contain records for the removed subject; refresh it so UI updates
  fetchAttendanceData?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove subject');
    } finally { setSaving(false); }
  };

  const cancelRemoval = () => {
    setModalOpen(false);
    setPendingRemoval(null);
  };

  return (
    <div className="settings-page">
      <h2 className="settings-title">Settings</h2>

      <section className="card">
        <h3>Update Subjects</h3>
        <p className="muted">Add or remove subjects for your profile. Changes sync to your account.</p>

        <div className="subject-list">
          {Object.keys(subjects || {}).length === 0 && <div className="muted">No subjects found.</div>}
          {Object.entries(subjects || {}).map(([name, code]) => (
            <div className="subject-row" key={name}>
              <div className="subject-info">
                <strong>{name} <span className='font-light'>- ({code})</span></strong>
                
              </div>
              <div>
                <button className="btn-danger" onClick={() => handleRemove(name)} disabled={saving}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="add-subject-form">
          <input placeholder="Subject name" value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} />
          <input placeholder="Code (optional)" value={newSubjectCode} onChange={(e) => setNewSubjectCode(e.target.value)} />
          <button className="btn-primary" onClick={handleAdd} disabled={saving}>{saving ? 'Saving...' : 'Add Subject'}</button>
        </div>
      </section>

        <ConfirmModal
          open={modalOpen}
          title={`Remove subject "${pendingRemoval}"?`}
          message={`This will permanently remove attendance history for "${pendingRemoval}". Are you sure?`}
          onCancel={cancelRemoval}
          onConfirm={confirmRemoval}
        />

      </div>
  );
};

export default Settings;

