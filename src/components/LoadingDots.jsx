import React from 'react';

const LoadingDots = () => {
  return (
    <div className="flex justify-center items-center space-x-5">
      <div className="animate-ping mr-2">
        <div className="h-3 w-3 bg-gray-400 rounded-full"></div>
      </div>
      <div className="animate-ping mr-2">
        <div className="h-3 w-3 bg-gray-400 rounded-full"></div>
      </div>
      <div className="animate-ping">
        <div className="h-3 w-3 bg-gray-400 rounded-full"></div>
      </div>
    </div>
  );
};

export default LoadingDots