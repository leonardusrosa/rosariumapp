import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseAvailable } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export interface RosaryUser {
  id: string;
  email: string;
  username?: string;
}

interface AuthContextType {
  user: RosaryUser | null;
  isLoading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  register: (email: string, password: string, username?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<RosaryUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Supabase is available
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available - using guest mode');
      setUser(null);
      setLoading(false);
      return;
    }

    // Get initial session with error handling
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.warn('Session retrieval error:', error);
        setUser(null);
      } else {
        setUser(session?.user ? mapSupabaseUser(session.user) : null);
      }
      setLoading(false);
    }).catch((error) => {
      console.warn('Session initialization error:', error);
      setUser(null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? mapSupabaseUser(session.user) : null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const mapSupabaseUser = (supabaseUser: User): RosaryUser => ({
    id: supabaseUser.id,
    email: supabaseUser.email!,
    username: supabaseUser.user_metadata?.username || supabaseUser.email,
  });

  const login = async (emailOrUsername: string, password: string) => {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error('Authentication not available in guest mode');
    }

    // Check if input is an email or username
    const isEmail = emailOrUsername.includes('@');
    
    let email = emailOrUsername;
    
    // If it's a username, we need to look up the email
    if (!isEmail) {
      try {
        const response = await fetch(`/api/auth/email-by-username/${emailOrUsername}`);
        if (!response.ok) {
          throw new Error('Username not found');
        }
        const data = await response.json();
        email = data.email;
      } catch (error) {
        throw new Error('Username not found');
      }
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const register = async (email: string, password: string, username?: string) => {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error('Registration not available in guest mode');
    }

    // First, register with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email,
        },
      },
    });
    
    if (error) throw error;
    
    // If successful and we have a user ID, create user profile
    if (data.user) {
      try {
        const profileData = {
          userId: data.user.id,
          username: username || email.split('@')[0], // Use email prefix if no username
          email: email,
          displayName: username || email.split('@')[0],
        };
        
        const response = await fetch('/api/user-profiles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profileData),
        });
        
        if (!response.ok) {
          console.warn('Failed to create user profile');
        }
      } catch (profileError) {
        console.warn('Failed to create user profile:', profileError);
      }
    }
  };

  const logout = async () => {
    if (!isSupabaseAvailable() || !supabase) {
      // In guest mode, just clear any local state
      setUser(null);
      return;
    }

    try {
      // Simply attempt to sign out - Supabase will handle gracefully if no session exists
      const { error } = await supabase.auth.signOut();
      if (error && error.message !== 'No session found') {
        console.warn('Logout error:', error);
      }
    } catch (error) {
      // Silently handle logout errors to prevent UI crashes
      console.warn('Logout error:', error);
    } finally {
      // Always clear the user state regardless of Supabase response
      setUser(null);
    }
  };

  const value = {
    user,
    isLoading: loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}