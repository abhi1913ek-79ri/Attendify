import React from 'react'
import './MarkAttendance.css'
import { CalendarCheck } from 'lucide-react'
import { useAuth } from '../../store/AuthContext';
import AuthPrompt from '../../components/AuthPrompt/AuthPrompt';
const MarkAttendance = () => {
  const { isLoggedIn, user } = useAuth();
  return (
    <div className='mark-attendance'>
      <div className="mark-attendance-heading">
        <span className='text-3xl'><CalendarCheck /></span>
        <h2>Mark Attendance</h2>
      </div>
      <hr className='text-gray-300' />
      {isLoggedIn ? (
        <div className="p-4 bg-green-100 rounded">
          <p>✅ You are logged in as <strong>{user.name}</strong>.</p>
          <p>🗓️ Now you can mark your attendance here.</p>
          {/* TODO: Add your attendance form here */}
        </div>
      ) : (
        <AuthPrompt />
      )}

    </div>
  )
}

export default MarkAttendance
