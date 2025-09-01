import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Auth from "./components/Auth";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import PanicButton from "./pages/PanicButton";
import Contacts from "./pages/Contacts";
import SafeRoutes from "./pages/SafeRoutes";
import SafetyTips from "./pages/SafetyTips";
import Profile from "./pages/Profile";

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl">🛡️</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <Router>
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 bg-white dark:bg-gray-900 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/panic" element={<PanicButton />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/routes" element={<SafeRoutes />} />
              <Route path="/tips" element={<SafetyTips />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
