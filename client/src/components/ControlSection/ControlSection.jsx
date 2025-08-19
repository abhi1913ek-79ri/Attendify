import React from 'react';
import './ControlSection.css';

const ControlSection = ({
  filters,
  setFilters,
  onSearch,
  onReset,
  onRefresh,
  isSearching = false,
  isRefreshing = false,
  subjects = [],
}) => {
  const handleChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch?.();
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

      {/* ⚠️ Critical Filter */}
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
        onKeyDown={handleKeyDown}
        placeholder="Search by name or roll no."
        className="search-term"
      />

      {/* Actions */}
      <div className="actions">
        <button
          type="button"
          className="search-btn"
          onClick={onSearch}
          disabled={isSearching || isRefreshing}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
        <button
          type="button"
          className="reset-btn"
          onClick={onReset}
          disabled={isRefreshing}
        >
          Reset
        </button>
        <button
          type="button"
          className="refresh-btn"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
    </div>
  );
};

export default ControlSection;