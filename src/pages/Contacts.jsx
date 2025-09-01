import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getTrustedContacts, addTrustedContact, updateTrustedContact, deleteTrustedContact } from "../supabaseClient";

export default function Contacts() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
    relation: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      loadContacts();
    }
  }, [user]);

  const loadContacts = async () => {
    try {
      const data = await getTrustedContacts(user.id);
      setContacts(data);
    } catch (error) {
      setMessage(`Error loading contacts: ${error.message}`);
    }
  };

  const addContact = async () => {
    if (!newContact.name || !newContact.phone) {
      setMessage("Name and phone are required");
      return;
    }

    setLoading(true);
    try {
      const contact = {
        user_id: user.id,
        name: newContact.name,
        phone: newContact.phone,
        email: newContact.email || "",
        relation: newContact.relation || ""
      };
      
      await addTrustedContact(contact);
      setNewContact({ name: "", phone: "", email: "", relation: "" });
      setShowAddForm(false);
      setMessage("Contact added successfully!");
      loadContacts();
      
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(`Error adding contact: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateContact = async (contact) => {
    setLoading(true);
    try {
      await updateTrustedContact(contact.id, {
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        relation: contact.relation
      });
      
      setEditingContact(null);
      setMessage("Contact updated successfully!");
      loadContacts();
      
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(`Error updating contact: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await deleteTrustedContact(id);
        setMessage("Contact deleted successfully!");
        loadContacts();
        
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        setMessage(`Error deleting contact: ${error.message}`);
      }
    }
  };

  const handleCall = (phone) => {
    window.open(`tel:${phone}`);
  };

  const handleMessage = (phone) => {
    window.open(`sms:${phone}`);
  };

  const handleEmail = (email) => {
    if (email) {
      window.open(`mailto:${email}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Trusted Contacts
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your emergency contacts for safety alerts
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            + Add Contact
          </button>
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

        {/* Add Contact Form */}
        {showAddForm && (
          <div className="card mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Add New Contact
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name *"
                value={newContact.name}
                onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                value={newContact.phone}
                onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={newContact.email}
                onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <input
                type="text"
                placeholder="Relationship (optional)"
                value={newContact.relation}
                onChange={(e) => setNewContact({...newContact, relation: e.target.value})}
                className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="flex space-x-3 mt-4">
              <button 
                onClick={addContact} 
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Contact"}
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Contacts List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <div key={contact.id} className="card">
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-4xl">👤</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {contact.name}
                  </h3>
                  {contact.relation && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {contact.relation}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-gray-700 dark:text-gray-300 font-mono">
                  📞 {contact.phone}
                </p>
                {contact.email && (
                  <p className="text-gray-700 dark:text-gray-300 font-mono">
                    📧 {contact.email}
                  </p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => handleCall(contact.phone)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  📞 Call
                </button>
                <button
                  onClick={() => handleMessage(contact.phone)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  💬 SMS
                </button>
                {contact.email && (
                  <button
                    onClick={() => handleEmail(contact.email)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    📧 Email
                  </button>
                )}
              </div>

              {/* Edit/Delete Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingContact(contact)}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => deleteContact(contact.id)}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {contacts.length === 0 && !showAddForm && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No contacts yet
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mb-4">
              Add your first emergency contact to get started
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              Add Your First Contact
            </button>
          </div>
        )}

        {/* Edit Contact Modal */}
        {editingContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Edit Contact
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={editingContact.name}
                  onChange={(e) => setEditingContact({...editingContact, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={editingContact.phone}
                  onChange={(e) => setEditingContact({...editingContact, phone: e.target.value})}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={editingContact.email}
                  onChange={(e) => setEditingContact({...editingContact, email: e.target.value})}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <input
                  type="text"
                  placeholder="Relationship"
                  value={editingContact.relation}
                  onChange={(e) => setEditingContact({...editingContact, relation: e.target.value})}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => updateContact(editingContact)}
                  disabled={loading}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Contact"}
                </button>
                <button
                  onClick={() => setEditingContact(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
