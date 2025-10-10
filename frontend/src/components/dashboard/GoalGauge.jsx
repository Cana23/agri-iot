// src/components/dashboard/GoalGauge.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const GoalGauge = ({ value = 0, goal = 100, unit = '' }) => {
  const percent = Math.round((value / goal) * 100);
  const data = [
    { name: 'Value', value: value },
    { name: 'Remaining', value: Math.max(0, goal - value) }, // Asegura que no sea negativo
  ];
  const COLORS = ['#16a34a', '#e5e7eb']; // Verde para el valor, gris para el resto

  return (
    <div style={{ width: '100%', height: 200, position: 'relative' }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            startAngle={180}
            endAngle={0}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-gray-800">{value}{unit}</span>
        <span className="text-sm text-gray-500">Meta: {goal}{unit}</span>
      </div>
    </div>
  );
};

export default GoalGauge;