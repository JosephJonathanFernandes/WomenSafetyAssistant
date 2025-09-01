import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { updateProfile } from "../supabaseClient";

export default function Profile() {
  const { profile, setProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (profile) {
      setEditForm({
        full_name: profile.full_name || "",
        phone: profile.phone || ""
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    
    setLoading(true);
    setMessage("");

    try {
      const updatedProfile = await updateProfile(profile.id, editForm);
      setProfile(updatedProfile);
      setIsEditing(false);
      setMessage("Profile updated successfully!");
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(`Error updating profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      full_name: profile?.full_name || "",
      phone: profile?.phone || ""
    });
    setIsEditing(false);
    setMessage("");
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl">👤</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl text-white font-bold">
            {profile.full_name?.charAt(0) || "👤"}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            {profile.full_name || "Profile"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="space-y-6">
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Personal Information
                </h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.full_name}
                      onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button 
                      onClick={handleSave} 
                      disabled={loading}
                      className="btn-primary flex-1 disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button onClick={handleCancel} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex-1">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Name:</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                      {profile.full_name || "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                      {profile.phone || "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Member since:</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                      {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "Unknown"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Info */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Account Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">User ID:</span>
                  <span className="text-gray-800 dark:text-gray-200 font-mono text-sm">
                    {profile.id?.substring(0, 8)}...
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="text-gray-800 dark:text-gray-200 font-medium">
                    {profile.id ? "Verified" : "Not verified"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200">
                  🔐 Change Password
                </button>
                <button className="w-full text-left p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors duration-200">
                  📱 Two-Factor Authentication
                </button>
                <button className="w-full text-left p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors duration-200">
                  🗑️ Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
