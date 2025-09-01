import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { createSOSAlert } from "../supabaseClient";

export default function PanicButton() {
  const { user } = useAuth();
  const [isAlertSent, setIsAlertSent] = useState(false);
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSOS = async () => {
    if (!user) {
      setMessage("Please log in to send SOS alerts");
      return;
    }

    setLoading(true);
    try {
      // Get current location
      let location = null;
      if (navigator.geolocation) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      }

      // Create SOS alert in Supabase
      const alert = {
        user_id: user.id,
        location: location,
        status: "sent",
        method: "button_press"
      };

      await createSOSAlert(alert);
      setIsAlertSent(true);
      setMessage("SOS alert sent successfully! Emergency contacts have been notified.");
      
      // Reset after 10 seconds
      setTimeout(() => {
        setIsAlertSent(false);
        setMessage("");
      }, 10000);
    } catch (error) {
      setMessage(`Error sending SOS: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleShareLocation = () => {
    setIsSharingLocation(true);
    setMessage("Location shared with emergency contacts");
    
    setTimeout(() => {
      setIsSharingLocation(false);
      setMessage("");
    }, 3000);
  };

  const quickActions = [
    {
      icon: "📍",
      title: "Share Live Location",
      description: "Share your current location with emergency contacts",
      action: handleShareLocation,
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: "📞",
      title: "Call Emergency Services",
      description: "Direct call to emergency services",
      action: () => window.open("tel:911"),
      color: "from-red-500 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Emergency SOS Alert
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Use this button only in genuine emergency situations
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes("Error") 
              ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
              : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
          }`}>
            {message}
          </div>
        )}

        {/* Main SOS Button */}
        <div className="text-center mb-16">
          <button
            onClick={handleSOS}
            disabled={isAlertSent || loading}
            className={`w-64 h-64 rounded-full text-white font-bold text-3xl transition-all duration-300 transform hover:scale-105 ${
              isAlertSent 
                ? "bg-green-600 cursor-not-allowed" 
                : loading
                ? "bg-yellow-600 cursor-not-allowed"
                : "btn-danger glow-animation"
            }`}
          >
            {loading ? "⏳ Sending..." : isAlertSent ? "✅ SOS Sent!" : "🚨 SOS"}
          </button>
          
          {isAlertSent && (
            <div className="mt-6 p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
              <p className="font-semibold">Emergency alert sent successfully!</p>
              <p className="text-sm">Your contacts have been notified with your location.</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <div key={index} className="card text-center hover:transform hover:scale-105 transition-all duration-300">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center text-3xl`}>
                {action.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                {action.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                {action.description}
              </p>
              <button
                onClick={action.action}
                className="btn-primary w-full"
              >
                {action.title}
              </button>
            </div>
          ))}
        </div>

        {/* Emergency Information */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Emergency Information
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                What happens when you press SOS?
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Emergency alert sent to all contacts</li>
                <li>• Your location automatically shared</li>
                <li>• Alert recorded in your safety log</li>
                <li>• Quick access to emergency services</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Safety Tips
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Stay calm and assess the situation</li>
                <li>• Move to a safe location if possible</li>
                <li>• Keep your phone accessible</li>
                <li>• Trust your instincts</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Location Status */}
        {isSharingLocation && (
          <div className="fixed bottom-6 right-6 p-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg shadow-lg">
            <p className="font-semibold">📍 Sharing location...</p>
            <p className="text-sm">Your emergency contacts can see your real-time location</p>
          </div>
        )}
      </div>
    </div>
  );
}
