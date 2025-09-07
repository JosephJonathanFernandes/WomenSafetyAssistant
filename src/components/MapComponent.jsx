import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapComponent = ({ latitude, longitude, height = '400px', width = '100%', zoom = 15 }) => {
  // Check if coordinates are available
  if (!latitude || !longitude) {
    return (
      <div className="map-container rounded-lg overflow-hidden shadow-lg border border-gray-200">
        <div 
          style={{ height, width }} 
          className="flex items-center justify-center bg-gray-100 text-gray-500"
        >
          Location data not available
        </div>
      </div>
    );
  }

  const position = [latitude, longitude];

  return (
    <div className="map-container rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <MapContainer 
        center={position} 
        zoom={zoom} 
        style={{ height, width }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <strong>Your Location</strong>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;