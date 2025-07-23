import React from 'react';
import './ControlSection.css';

const ControlSection = ({ filters, setFilters, onSearch , subjects}) => {
  const handleChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="control-section">
      {/* 🔽 Subject Selector */}
      <select
        value={filters.subject}
        onChange={(e) => handleChange('subject', e.target.value)}
        className="selector"
      >
        <option value="">All Subjects</option>
        {subjects.map((subject) => (
          <option key={subject} value={subject}>
            {subject}
          </option>
        ))}
      </select>
      <select
        value={filters.isCritical}
        onChange={(e) => handleChange('isCritical', e.target.value)}
        className="selector"
      >
        <option value="">All</option>
        <option value="true">Critical</option>
        <option value="false">Safe</option>
      </select>

      {/* 📅 Date Range Picker */}
      <div className="date-range">
        <input
          type="date"
          value={filters.fromDate}
          onChange={(e) => handleChange('fromDate', e.target.value)}
          className="input-date"
        />
        <span className="text-gray-500 text-sm">to</span>
        <input
          type="date"
          value={filters.toDate}
          onChange={(e) => handleChange('toDate', e.target.value)}
          className="input-date"
        />
      </div>

      {/* 🔍 Search */}
      <input
        type="text"
        value={filters.searchTerm}
        onChange={(e) => handleChange('searchTerm', e.target.value)}
        placeholder="Search by name or roll no."
        className="search-term"
      />

      {/* 📤 Search Button */}
      <button className="search-btn" onClick={onSearch}>
        Search
      </button>
    </div>
  );
};

export default ControlSection;
