import React, { useState, useEffect } from 'react';
import './Settings.css';
import { useStudent } from '../../store/StudentContext';
import { useAttendance } from '../../store/AttendanceContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/ApiPaths';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';

const Settings = () => {
  const { student, fetchStudent } = useStudent();
  const { fetchAttendanceData } = useAttendance();

  const [selectedSection, setSelectedSection] = useState('profile');
  const [subjects, setSubjects] = useState({});
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [saving, setSaving] = useState(false);

  // Profile editing state
  const [editName, setEditName] = useState('');
  const [editCourse, setEditCourse] = useState('');
  const [editRollNo, setEditRollNo] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const [imageDeleteModalOpen, setImageDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (student) {
      // Student.subjects may be a Map or object
      const s = student.subjects && student.subjects instanceof Map
        ? Object.fromEntries(student.subjects)
        : (student.subjects || {});
      setSubjects(s);
      setEditName(student.name || '');
      setEditCourse(student.course || '');
      setEditRollNo(student.rollNo || '');
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

  // Profile update handlers
  const handleProfileImageChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) return toast.error('Choose an image file');
    setProfileImageFile(f);
    // create preview
    const reader = new FileReader();
    reader.onloadend = () => setProfileImagePreview(reader.result || '');
    reader.readAsDataURL(f);
  };

  const uploadProfileImage = async () => {
    if (!profileImageFile) return toast.error('No image selected');
    setIsUpdatingImage(true);
    try {
      const fd = new FormData();
      fd.append('profileImage', profileImageFile);
      const res = await axiosInstance.put(API_PATHS.STUDENT.UPDATE_PROFILE_IMAGE, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data.success) {
        toast.success('Profile image updated');
        setProfileImageFile(null);
        setProfileImagePreview('');
        fetchStudent?.();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload image');
    } finally { setIsUpdatingImage(false); }
  };

  const requestDeleteProfileImage = () => {
    if (!student?.profileImageUrl) return toast.info('No image to delete');
    setImageDeleteModalOpen(true);
  };

  const confirmDeleteProfileImage = async () => {
    setImageDeleteModalOpen(false);
    setIsUpdatingImage(true);
    try {
      const res = await axiosInstance.delete(API_PATHS.STUDENT.DELETE_PROFILE_IMAGE);
      if (res.data.success) {
        toast.success('Profile image deleted');
        fetchStudent?.();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete image');
    } finally { setIsUpdatingImage(false); }
  };

  const saveProfile = async () => {
    if (!editName?.trim()) return toast.error('Name is required');
    setSaving(true);
    try {
      const payload = { name: editName.trim(), rollNo: editRollNo.trim(), course: editCourse.trim() };
      const res = await axiosInstance.put(API_PATHS.STUDENT.UPDATE_PROFILE || '/api/student/profile', payload);
      toast.success('Profile updated');
      fetchStudent?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally { setSaving(false); }
  };

  const renderProfileSection = () => (
    <div>
      <h3>Profile</h3>
      <p className="muted">Update your profile details and profile image.</p>

      <div className="profile-edit-grid">
        <div>
          <label>Name</label>
          <input value={editName} onChange={(e) => setEditName(e.target.value)} />
        </div>
        <div>
          <label>Roll No</label>
          <input value={editRollNo} onChange={(e) => setEditRollNo(e.target.value)} />
        </div>
        <div>
          <label>Course</label>
          <input value={editCourse} onChange={(e) => setEditCourse(e.target.value)} />
        </div>
        <div className="profile-image-controls">
          <label>Profile Image</label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
            <div style={{ width: 84, height: 84, borderRadius: 9999, overflow: 'hidden', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {profileImagePreview ? (
                <img src={profileImagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (student?.profileImageUrl ? (
                <img src={student.profileImageUrl} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ color: '#9ca3af' }}>No image</div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input type="file" accept="image/*" onChange={handleProfileImageChange} />
              <div className="profile-image-cta">
                <button className="btn-primary" onClick={uploadProfileImage} disabled={isUpdatingImage || !profileImageFile}>{isUpdatingImage ? 'Uploading...' : 'Upload'}</button>
                <button className="btn-secondary" onClick={() => { setProfileImageFile(null); setProfileImagePreview(''); }} disabled={!profileImageFile}>Cancel</button>
                <button className="btn-danger" onClick={requestDeleteProfileImage} disabled={isUpdatingImage || !student?.profileImageUrl}>Delete Image</button>
              </div>
              {profileImageFile && <div className="muted">Selected: {profileImageFile.name}</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="save-profile-row">
        <button className="btn-primary" onClick={saveProfile} disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>
      </div>
    </div>
  );

  const renderSubjectsSection = () => (
    <div>
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
    </div>
  );

  // Appearance removed

  return (
    <div className="settings-page">
      <h2 className="settings-title">Settings</h2>

      <div className="settings-container">
        <div className="settings-panel">
          <div className="card-header">
            <div className="tabs">
              <button
                className={`tab-pill ${selectedSection === 'profile' ? 'active' : ''}`}
                onClick={() => setSelectedSection('profile')}
              >
                Update Profile
              </button>
              <button
                className={`tab-pill ${selectedSection === 'subjects' ? 'active' : ''}`}
                onClick={() => setSelectedSection('subjects')}
              >
                Update Subjects
              </button>
            </div>
          </div>

          <div className="card-body">
            {selectedSection === 'profile' && renderProfileSection()}
            {selectedSection === 'subjects' && renderSubjectsSection()}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={modalOpen}
        title={`Remove subject "${pendingRemoval}"?`}
        message={`This will permanently remove attendance history for "${pendingRemoval}". Are you sure?`}
        onCancel={cancelRemoval}
        onConfirm={confirmRemoval}
      />

      <ConfirmModal
        open={imageDeleteModalOpen}
        title={`Delete profile image?`}
        message={`This will remove your profile image. Are you sure?`}
        onCancel={() => setImageDeleteModalOpen(false)}
        onConfirm={confirmDeleteProfileImage}
      />

    </div>
  );
};

export default Settings;

