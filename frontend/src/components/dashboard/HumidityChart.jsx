// src/components/dashboard/HumidityChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HumidityChart = ({ data }) => {
  // Asegúrate de que haya datos para evitar errores
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500">No hay datos de humedad disponibles.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart 
        data={data} 
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="timestamp" stroke="#888888" fontSize={12} tickFormatter={(time) => new Date(time).toLocaleTimeString()} />
        <YAxis stroke="#888888" fontSize={12} />
        <Tooltip
          contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cccccc' }}
          labelStyle={{ fontWeight: 'bold' }}
        />
        <Legend />
        <Bar dataKey="value" name="Humedad (%)" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HumidityChart;