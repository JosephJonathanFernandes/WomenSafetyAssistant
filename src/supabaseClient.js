import { createClient } from "@supabase/supabase-js";

// Using environment variables is recommended for API keys
// The current key has a very long expiration date (year 2035) which is a security concern
// Consider using a .env file with shorter-lived keys that are rotated regularly
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://awgmeffngebhhbsltomt.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3Z21lZmZuZ2ViaGhic2x0b210Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MTkwNTksImV4cCI6MjA3MjI5NTA1OX0.l4M-Uqa_nDWxEa4aktffNVxeiQ7ePrimXnEgL0rEb7c";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Auth helper functions
export const signUp = async (email, password, fullName, phone) => {
  try {
    // First, create the user account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone
        }
      }
    });
    
    if (error) {
      // Check if user already exists
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      }
      throw error;
    }
    
    // Wait a moment for the user to be fully created
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create profile record only if user was created successfully
    if (data.user && data.user.id) {
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              full_name: fullName,
              phone: phone,
              email: email
            }
          ]);
        
        if (profileError) {
          console.warn('Profile creation failed:', profileError);
          // Don't throw error here as the user account was created successfully
        }
      } catch (profileError) {
        console.warn('Profile creation failed:', profileError);
        // Don't throw error here as the user account was created successfully
      }
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  
  // Ensure profile exists
  if (data.user) {
    await ensureProfileExists(data.user);
  }
  
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Helper function to ensure profile exists
export const ensureProfileExists = async (user) => {
  try {
    // Check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();
    
    if (fetchError && fetchError.code === 'PGRST116') {
      // Profile doesn't exist, create it
      const { error: createError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            full_name: user.user_metadata?.full_name || '',
            phone: user.user_metadata?.phone || ''
          }
        ]);
      
      if (createError) {
        console.warn('Failed to create profile:', createError);
      }
    }
  } catch (error) {
    console.warn('Error ensuring profile exists:', error);
  }
};

// Trusted contacts functions
export const getTrustedContacts = async (userId) => {
  const { data, error } = await supabase
    .from('trusted_contacts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const addTrustedContact = async (contact) => {
  const { data, error } = await supabase
    .from('trusted_contacts')
    .insert([contact])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateTrustedContact = async (id, updates) => {
  const { data, error } = await supabase
    .from('trusted_contacts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteTrustedContact = async (id) => {
  const { error } = await supabase
    .from('trusted_contacts')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// SOS alerts functions
export const createSOSAlert = async (alert) => {
  const { data, error } = await supabase
    .from('sos_alerts')
    .insert([alert])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getSOSAlerts = async (userId) => {
  const { data, error } = await supabase
    .from('sos_alerts')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Safety reports functions
export const createSafetyReport = async (report) => {
  const { data, error } = await supabase
    .from('safety_reports')
    .insert([report])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getSafetyReports = async (userId) => {
  const { data, error } = await supabase
    .from('safety_reports')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false });
  
  if (error) throw error;
  return data;
};