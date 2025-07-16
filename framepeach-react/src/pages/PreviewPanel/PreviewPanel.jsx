import React, { useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';

export const PreviewPanel = ({onClose}) => {

  return (
    <>
      {/* Top Menu Bar */}
      <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        {/* Left side - Back button */}
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title="Go Back"
            onClick={() => {
              // Call the onClose function passed as prop
               onClose(false)
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        {/* Center - Title */}
        <div className="flex-1 text-center">
          <h2 className="text-sm font-medium text-gray-200">Preview</h2>
        </div>

        {/* Right side - Close button */}
        <div className="flex items-center gap-2">
          <button
            className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </>
  );
};