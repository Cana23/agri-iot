// src/components/common/Card.jsx
import React from 'react';

const Card = ({ children, className = '' }) => {
  const cardClasses = `bg-white p-6 rounded-lg shadow-md ${className}`;

  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
};

export default Card;