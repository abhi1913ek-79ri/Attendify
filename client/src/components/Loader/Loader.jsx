import React from 'react';
import './Loader.css'; 

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <div className="spinner" />
      <p className="loader-text">Fetching Data...</p>
    </div>
  );
};

export default Loader;
