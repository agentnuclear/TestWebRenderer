import React from 'react';  

  export const RadioGroup = ({ value, onChange, options }) => (
    <div className="flex flex-row bg-gray-600 p-0.5 rounded-md h-8 flex-1">
      {options.map(option => (
        <label key={option.value} className={`relative flex-1 flex items-center justify-center overflow-hidden rounded cursor-pointer transition-colors text-white ${
          value === option.value ? 'bg-gray-400' : 'bg-gray-500'
        }`}>
          <input
            className="absolute w-full h-full appearance-none cursor-pointer opacity-0"
            type="radio"
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value === 'true')}
          />
          {option.label}
        </label>
      ))}
    </div>
  );