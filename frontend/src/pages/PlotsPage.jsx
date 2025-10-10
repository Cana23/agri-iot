// src/pages/PlotsPage.jsx
import React, { useState, useEffect } from 'react';
import { plotService } from '../services/plotService';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Arreglo para el icono por defecto de Leaflet que a veces no carga
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

const PlotsPage = () => {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    plotService.getActivePlots()
      .then(data => {
        setPlots(data);
        setLoading(false);
      })
      .catch(err => console.error("Error al cargar las parcelas", err));
  }, []);
  
  if (loading) return <p>Cargando parcelas...</p>;

  // Coordenada central del mapa (ajusta a tu necesidad)
  const mapCenter = plots.length > 0 ? [plots[0].location.lat, plots[0].location.lng] : [21.1619, -86.8515];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Mapa de Parcelas</h1>
        <button className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
          + Añadir Parcela
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md h-[600px]">
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {plots.map(plot => (
            <Marker key={plot.id} position={[plot.location.lat, plot.location.lng]}>
              <Popup>
                <div className="font-bold">{plot.name}</div>
                <div>Cultivo: {plot.crop}</div>
                <div>Responsable: {plot.responsible}</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default PlotsPage;