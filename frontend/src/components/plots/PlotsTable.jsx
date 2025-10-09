// src/components/plots/PlotsTable.jsx
import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const PlotsTable = ({ plots, onEdit, onDelete }) => {
  if (!plots || plots.length === 0) {
    return <div className="text-center p-4 bg-white rounded-lg shadow-md">No hay parcelas para mostrar.</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
            <th className="px-5 py-3 border-b-2 border-gray-300 text-left">Nombre</th>
            <th className="px-5 py-3 border-b-2 border-gray-300 text-left">Cultivo</th>
            <th className="px-5 py-3 border-b-2 border-gray-300 text-left">Responsable</th>
            <th className="px-5 py-3 border-b-2 border-gray-300 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {plots.map(plot => (
            <tr key={plot.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="px-5 py-4 text-sm">{plot.name}</td>
              <td className="px-5 py-4 text-sm">{plot.crop}</td>
              <td className="px-5 py-4 text-sm">{plot.responsible}</td>
              <td className="px-5 py-4 text-sm text-center">
                <button onClick={() => onEdit(plot)} className="text-blue-500 hover:text-blue-700 mr-4" title="Editar">
                  <FaEdit />
                </button>
                <button onClick={() => onDelete(plot.id)} className="text-red-500 hover:text-red-700" title="Eliminar">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlotsTable;