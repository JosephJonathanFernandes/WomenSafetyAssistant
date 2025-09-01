import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getTrustedContacts, getSOSAlerts } from "../supabaseClient";

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [sosAlerts, setSosAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [contactsData, alertsData] = await Promise.all([
        getTrustedContacts(user.id),
        getSOSAlerts(user.id)
      ]);
      setContacts(contactsData);
      setSosAlerts(alertsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: "🚨",
      title: "SOS Alerts",
      description: "Instant emergency alerts with location tracking",
      color: "from-red-500 to-pink-500",
      link: "/panic"
    },
    {
      icon: "📍",
      title: "Location Tracking",
      description: "Real-time location sharing with trusted contacts",
      color: "from-blue-500 to-purple-500",
      link: "/routes"
    },
    {
      icon: "👥",
      title: "Emergency Contacts",
      description: "Quick access to your trusted network",
      color: "from-green-500 to-teal-500",
      link: "/contacts"
    },
    {
      icon: "🤖",
      title: "AI Safety Tips",
      description: "Smart advice for various situations",
      color: "from-purple-500 to-indigo-500",
      link: "/tips"
    }
  ];

  const quickStats = [
    { label: "Contacts", value: contacts.length, icon: "👥" },
    { label: "SOS Alerts", value: sosAlerts.length, icon: "🚨" },
    { label: "Member Since", value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A", icon: "📅" },
    { label: "Status", value: "Active", icon: "🟢" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl">🛡️</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="hero-gradient text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'User'}!
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-pink-100 max-w-3xl mx-auto">
            Your safety is our priority. Access all your safety features from one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/panic" className="btn-danger text-lg px-8 py-4">
              🚨 Send SOS Alert
            </Link>
            <Link to="/contacts" className="btn-secondary text-lg px-8 py-4">
              👥 Manage Contacts
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <div key={index} className="card text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-200">
          Safety Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link key={index} to={feature.link} className="block">
              <div className="card text-center hover:transform hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="card">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Recent Activity
          </h3>
          {sosAlerts.length > 0 ? (
            <div className="space-y-3">
              {sosAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    SOS alert sent on {new Date(alert.timestamp).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📱</div>
              <p className="text-gray-600 dark:text-gray-400">
                No recent activity. Your safety log will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
