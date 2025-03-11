import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  created_at: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  signUp: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            created_at: data.user.created_at
          },
          error: null
        });
      }
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            created_at: data.user.created_at
          },
          error: null
        });
      }
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear user state after successful sign out
      set({ user: null, error: null });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
  setUser: (user) => set({ user, loading: false, error: null }),
  clearError: () => set({ error: null })
}));

// Initialize auth state
supabase.auth.onAuthStateChange((event, session) => {
  if (session?.user) {
    useAuthStore.getState().setUser({
      id: session.user.id,
      email: session.user.email!,
      created_at: session.user.created_at
    });
  } else {
    useAuthStore.getState().setUser(null);
  }
});