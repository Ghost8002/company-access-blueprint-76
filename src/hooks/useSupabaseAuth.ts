
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id ? 'User logged in' : 'User logged out');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Ensure profile exists when user signs in
        if (session?.user && event === 'SIGNED_IN') {
          setTimeout(() => {
            ensureUserProfile(session.user);
          }, 0);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.id ? 'User logged in' : 'No session');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Ensure profile exists for existing session
      if (session?.user) {
        setTimeout(() => {
          ensureUserProfile(session.user);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const ensureUserProfile = async (user: User) => {
    try {
      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile) {
        // Create profile if it doesn't exist
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
            email: user.email || '',
            role: 'manager'
          });

        if (error) {
          console.error('Error creating profile:', error);
        } else {
          console.log('Profile created successfully');
        }
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      console.log('Sign in successful');
      return { data, error: null };
    } catch (error) {
      console.error('Sign in failed:', error);
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('Attempting sign up for:', email);
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }

      console.log('Sign up successful');
      return { data, error: null };
    } catch (error) {
      console.error('Sign up failed:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }

      console.log('Sign out successful');
      return { error: null };
    } catch (error) {
      console.error('Sign out failed:', error);
      return { error };
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };
};
