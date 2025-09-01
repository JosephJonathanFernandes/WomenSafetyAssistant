import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navItems = [
    { path: "/", icon: "🏠", label: "Dashboard" },
    { path: "/panic", icon: "🚨", label: "SOS Alert" },
    { path: "/contacts", icon: "👥", label: "Contacts" },
    { path: "/routes", icon: "🗺️", label: "Safe Routes" },
    { path: "/tips", icon: "💡", label: "Safety Tips" },
    { path: "/profile", icon: "👤", label: "Profile" }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Toggle Button */}
      <div className="flex justify-end p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${
                  isActive(item.path)
                    ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                title={isCollapsed ? item.label : ""}
              >
                <span className="text-xl">{item.icon}</span>
                {!isCollapsed && (
                  <span className="ml-3 font-medium">{item.label}</span>
                )}
                {isCollapsed && isActive(item.path) && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-purple-500 rounded-r-full"></div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapsed State Indicator */}
      {isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-sm font-bold">🛡️</span>
            </div>
            <span className="block">Safety</span>
          </div>
        </div>
      )}
    </div>
  );
}
