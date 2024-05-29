import React, { useEffect, useRef } from 'react';

const Popup = ({ message, icons, isOpen }) => {
  return (
    <div className={`${!isOpen && "hidden"} absolute top-0 left-0 w-full h-screen bg-gray-900 opacity-75 z-[99999999] flex justify-center items-center popup-active`}>
      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-center items-center space-y-3  z-[999999999]">
        <span>{icons}</span>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Popup;
