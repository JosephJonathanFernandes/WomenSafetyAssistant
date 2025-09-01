import React, { useState, useEffect } from "react";

export default function SafeRoutes() {
  const [userLocation, setUserLocation] = useState(null);
  const [safeZones, setSafeZones] = useState([
    {
      id: 1,
      name: "Mall de Goa",
      type: "Commercial",
      safety: "High",
      coordinates: { lat: 15.5010, lng: 73.9857 },
      description: "Well-lit shopping mall with security guards and many people around"
    },
    {
      id: 2,
      name: "Panaji Police Station",
      type: "Emergency",
      safety: "Very High",
      coordinates: { lat: 15.4909, lng: 73.8278 },
      description: "24/7 police presence, emergency services available"
    },
    {
      id: 3,
      name: "Miramar Beach",
      type: "Public Area",
      safety: "High",
      coordinates: { lat: 15.4909, lng: 73.8278 },
      description: "Popular public beach, well-lit, many people around"
    },
    {
      id: 4,
      name: "Goa Medical College",
      type: "Emergency",
      safety: "Very High",
      coordinates: { lat: 15.5010, lng: 73.9857 },
      description: "Hospital with 24/7 emergency services and security"
    },
    {
      id: 5,
      name: "Panaji Bus Stand",
      type: "Transportation",
      safety: "Medium",
      coordinates: { lat: 15.4909, lng: 73.8278 },
      description: "Public transport hub, well-lit, many people around"
    }
  ]);

  const [selectedZone, setSelectedZone] = useState(null);
  const [isSharingLocation, setIsSharingLocation] = useState(false);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Error getting location:", error);
          // Set default location (Panaji, Goa)
          setUserLocation({ lat: 15.4909, lng: 73.8278 });
        }
      );
    }
  }, []);

  const handleShareLocation = () => {
    setIsSharingLocation(true);
    // Here you would integrate with your backend to share location
    setTimeout(() => setIsSharingLocation(false), 3000);
  };

  const getSafetyColor = (safety) => {
    switch (safety) {
      case "Very High": return "text-green-600 bg-green-100 dark:bg-green-900";
      case "High": return "text-blue-600 bg-blue-100 dark:bg-blue-900";
      case "Medium": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900";
      case "Low": return "text-red-600 bg-red-100 dark:bg-red-900";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900";
    }
  };

  const getZoneIcon = (type) => {
    switch (type) {
      case "Public Area": return "🏞️";
      case "Emergency": return "🚔";
      case "Commercial": return "🏬";
      case "Transportation": return "🚇";
      default: return "📍";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Safe Routes & Zones
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Find safe areas and plan secure routes to your destination in Goa
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleShareLocation}
              className="btn-secondary"
            >
              📍 Share Location
            </button>
            <button className="btn-primary">
              🗺️ View Map
            </button>
          </div>
        </div>

        {/* Location Status */}
        <div className="card mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Your Current Location
              </h3>
              {userLocation ? (
                <p className="text-gray-600 dark:text-gray-400">
                  📍 {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </p>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  📍 Getting your location...
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 text-sm"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Safe Zones Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {safeZones.map((zone) => (
            <div
              key={zone.id}
              className="card cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              onClick={() => setSelectedZone(zone)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{getZoneIcon(zone.type)}</div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSafetyColor(zone.safety)}`}>
                  {zone.safety}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {zone.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {zone.type}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {zone.description}
              </p>
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  📍 {zone.coordinates.lat.toFixed(4)}, {zone.coordinates.lng.toFixed(4)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Zone Details */}
        {selectedZone && (
          <div className="card">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {selectedZone.name} - Details
              </h3>
              <button
                onClick={() => setSelectedZone(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Zone Information</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Type:</span> {selectedZone.type}</p>
                  <p><span className="font-medium">Safety Level:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getSafetyColor(selectedZone.safety)}`}>
                      {selectedZone.safety}
                    </span>
                  </p>
                  <p><span className="font-medium">Coordinates:</span> {selectedZone.coordinates.lat.toFixed(4)}, {selectedZone.coordinates.lng.toFixed(4)}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h4>
                <p className="text-gray-600 dark:text-gray-400">{selectedZone.description}</p>
                <div className="mt-4 space-y-2">
                  <button className="btn-primary w-full">
                    📍 Get Directions
                  </button>
                  <button className="btn-secondary w-full">
                    📞 Contact Zone
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Safety Tips */}
        <div className="card mt-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            🛡️ Safety Tips for Navigation
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                • Always stay in well-lit areas when walking at night
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                • Share your location with trusted contacts
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                • Avoid isolated or poorly lit streets
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                • Keep emergency contacts on speed dial
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                • Trust your instincts - if something feels wrong, change your route
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                • Use the SOS button if you feel unsafe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
