import React, { useState } from 'react'
import './ControlSection.css'

const ControlSection = () => {
  const [subject, setSubject] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  

  const handleSearch = (e) =>{
    console.log({subject,fromDate,toDate,searchTerm});
  }


  return (
    <div className="control-section">

      {/* 🔽 Subject Selector */}
      <select
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="selector"
      >
        <option value="">All Subjects</option>
        <option value="DBMS">DBMS</option>
        <option value="DSA">DSA</option>
        <option value="OS">Operating Systems</option>
        <option value="CN">Computer Networks</option>
      </select>

      {/* 📅 Date Range Picker */}
      <div className="date-range">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="input-date"
        />
        <span className="text-gray-500  text-sm">to</span>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="input-date"
        />
      </div>

      {/* 🔍 Search */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by name or roll no."
        className="search-term"
      />

      {/* 📤 Search Button */}
      <button className="search-btn" onClick={handleSearch}>
        Search
      </button>
      
    </div>

  )
}

export default ControlSection
