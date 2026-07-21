'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';
import type { Admin } from '@/lib/types';

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  user: { email: string; id: string } | null;
  admin: Admin | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  changePassword: (newPassword: string) => Promise<{ error: string | null }>;
  updateProfile: (data: { full_name?: string; avatar_url?: string }) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email: string; id: string } | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);

  const fetchAdminProfile = useCallback(async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error || !data) {
        return {
          id: userId,
          email,
          full_name: email.split('@')[0],
          role: 'admin' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
      return data as Admin;
    } catch {
      return {
        id: userId,
        email,
        full_name: email.split('@')[0],
        role: 'admin' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted && session?.user) {
          setIsAuthenticated(true);
          setUser({ email: session.user.email || '', id: session.user.id });
          const profile = await fetchAdminProfile(session.user.id, session.user.email || '');
          if (mounted) setAdmin(profile);
        }
      } catch {
        // no session — stay unauthenticated
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        setIsAuthenticated(true);
        setUser({ email: session.user.email || '', id: session.user.id });
        fetchAdminProfile(session.user.id, session.user.email || '').then(setAdmin);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setAdmin(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchAdminProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        setIsAuthenticated(true);
        setUser({ email: data.user.email || '', id: data.user.id });
        const profile = await fetchAdminProfile(data.user.id, data.user.email || '');
        setAdmin(profile);
        try {
          await supabase.from('admins').update({ last_login_at: new Date().toISOString() }).eq('id', data.user.id);
        } catch { /* ignore */ }
      }
      return { error: null };
    } catch (err: any) {
      return { error: err?.message || 'Invalid email or password' };
    }
  }, [fetchAdminProfile]);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch { /* ignore */ }
    setIsAuthenticated(false);
    setUser(null);
    setAdmin(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      return { error: err?.message || 'Failed to send reset email' };
    }
  }, []);

  const changePassword = useCallback(async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      return { error: err?.message || 'Failed to change password' };
    }
  }, []);

  const updateProfile = useCallback(async (data: { full_name?: string; avatar_url?: string }) => {
    if (!user) return { error: 'Not authenticated' };
    try {
      const { error } = await supabase
        .from('admins')
        .update(data)
        .eq('id', user.id);
      if (error) throw error;
      setAdmin(prev => prev ? { ...prev, ...data } : null);
      return { error: null };
    } catch (err: any) {
      return { error: err?.message || 'Failed to update profile' };
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, admin, signIn, signOut, resetPassword, changePassword, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
