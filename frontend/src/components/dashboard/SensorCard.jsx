// src/components/dashboard/SensorCard.jsx
import React from 'react';

const SensorCard = ({ title, value, unit, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800">
          {value !== undefined && value !== null ? value : '--'}
          <span className="text-xl font-semibold text-gray-600 ml-1">{unit}</span>
        </p>
      </div>
      <div className="text-4xl">
        {icon}
      </div>
    </div>
  );
};

export default SensorCard;