import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentUser, getProfile } from '../supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          try {
            const userProfile = await getProfile(session.user.id);
            setProfile(userProfile);
          } catch (profileError) {
            console.warn("Profile not found, using user data:", profileError);
            // Create a basic profile from user data if profile table doesn't exist
            setProfile({
              id: session.user.id,
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email,
              phone: session.user.user_metadata?.phone || '',
              created_at: session.user.created_at
            });
          }
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          try {
            const userProfile = await getProfile(session.user.id);
            setProfile(userProfile);
          } catch (profileError) {
            console.warn("Profile not found, using user data:", profileError);
            // Create a basic profile from user data if profile table doesn't exist
            setProfile({
              id: session.user.id,
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email,
              phone: session.user.user_metadata?.phone || '',
              created_at: session.user.created_at
            });
          }
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);


  const value = {
    user,
    profile,
    loading,
    setProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};