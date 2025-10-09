// src/pages/DeletedPlotsPage.jsx
import React, { useState, useEffect } from 'react';
import { plotService } from '../services/plotService';

const DeletedPlotsPage = () => {
    const [deletedPlots, setDeletedPlots] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        plotService.getDeletedPlots()
            .then(data => {
                setDeletedPlots(data);
                setLoading(false);
            })
            .catch(err => console.error("Error al cargar parcelas eliminadas:", err));
    }, []);

    if (loading) return <p>Cargando registros...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Parcelas Eliminadas</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                            <th className="px-5 py-3 border-b-2 border-gray-300 text-left">Nombre</th>
                            <th className="px-5 py-3 border-b-2 border-gray-300 text-left">Cultivo</th>
                            <th className="px-5 py-3 border-b-2 border-gray-300 text-left">Responsable</th>
                            <th className="px-5 py-3 border-b-2 border-gray-300 text-left">Fecha Eliminación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deletedPlots.map(plot => (
                            <tr key={plot.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="px-5 py-4 text-sm">{plot.name}</td>
                                <td className="px-5 py-4 text-sm">{plot.crop}</td>
                                <td className="px-5 py-4 text-sm">{plot.responsible}</td>
                                <td className="px-5 py-4 text-sm">
                                    {new Date(plot.deletedAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DeletedPlotsPage;