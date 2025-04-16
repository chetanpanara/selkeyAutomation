import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ToggleComponent = () => {


  return (
    <div className="flex items-center justify-between px-4 py-2 border rounded-md shadow-sm w-full">
      {/* Label and Icon */}
      <div className="flex items-center space-x-2">
        <span className="text-gray-900 font-medium">Select Your Workflow</span>
        <div className="text-gray-500 cursor-pointer">
          {/* Icon (Three dots) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12 12a.75.75 0 100-1.5.75.75 0 000 1.5zM12 17.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ToggleComponent;
