import React from 'react'
import './MarkAttendanceFilterSection.css'

const MarkAttendanceFilterSection = ({ filters, setFilters, onSearch }) => {
  const handleChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  return (
    <div className='mark-attendance-filterSection'>
      MarkAttendanceFilterSection
    </div>
  )
}

export default MarkAttendanceFilterSection
