import React from 'react';

const CircularLoader = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
  </div>
);

export default CircularLoader;