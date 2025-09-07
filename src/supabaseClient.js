import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://awgmeffngebhhbsltomt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3Z21lZmZuZ2ViaGhic2x0b210Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MTkwNTksImV4cCI6MjA3MjI5NTA1OX0.l4M-Uqa_nDWxEa4aktffNVxeiQ7ePrimXnEgL0rEb7c";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'X-Client-Info': 'women-safety-app'
    }
  }
});

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

// Auth helper functions
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
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

// Profile functions
export const getProfile = async (userId) => {
  // Add timeout to prevent hanging
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
  );
  
  const profilePromise = supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  const { data, error } = await Promise.race([profilePromise, timeoutPromise]);
  
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

// Trusted Contacts functions
export const getTrustedContacts = async (userId) => {
  const { data, error } = await supabase
    .from('trusted_contacts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
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

export const updateTrustedContact = async (contactId, updates) => {
  const { data, error } = await supabase
    .from('trusted_contacts')
    .update(updates)
    .eq('id', contactId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteTrustedContact = async (contactId) => {
  const { error } = await supabase
    .from('trusted_contacts')
    .delete()
    .eq('id', contactId);
  
  if (error) throw error;
};

// SOS Alerts functions
export const getSOSAlerts = async (userId) => {
  const { data, error } = await supabase
    .from('sos_alerts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const createSOSAlert = async (alert) => {
  const { data, error } = await supabase
    .from('sos_alerts')
    .insert([alert])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};