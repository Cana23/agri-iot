// src/components/plots/PlotMap.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Arreglo para el icono por defecto de Leaflet que a veces no carga
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const PlotMap = ({ plots }) => {
  const mapCenter = plots.length > 0
    ? [plots[0].location.lat, plots[0].location.lng]
    : [21.1619, -86.8515]; // Coordenada por defecto (Cancún)

  return (
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
              <div><strong>Cultivo:</strong> {plot.crop}</div>
              <div><strong>Responsable:</strong> {plot.responsible}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default PlotMap;