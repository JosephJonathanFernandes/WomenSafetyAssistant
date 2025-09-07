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
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";
import Insights from "./pages/Insights";

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 bg-white p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/panic" element={<PanicButton />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/routes" element={<SafeRoutes />} />
            <Route path="/tips" element={<SafetyTips />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/insights" element={<Insights />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
