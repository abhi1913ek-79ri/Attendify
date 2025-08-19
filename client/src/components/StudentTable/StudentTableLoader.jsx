import React from 'react';
import './StudentTableLoader.css';

const SkeletonRow = () => (
  <div className="st-skeleton-row">
    <div className="st-cell st-small" />
    <div className="st-cell st-medium" />
    <div className="st-cell st-medium" />
    <div className="st-cell st-small" />
    <div className="st-cell st-small" />
    <div className="st-cell st-medium" />
    <div className="st-cell st-small" />
  </div>
);

const StudentTableLoader = ({ rows = 6 }) => {
  return (
    <div className="st-loader" role="status" aria-busy="true">

      <div className="st-skeleton-body">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>

      <div className="st-loader-note">Loading students…</div>
    </div>
  );
};

export default StudentTableLoader;
