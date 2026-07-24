import { useCallback, useEffect, useMemo, useState } from 'react';
import supabase from '../../utils/supabase';
import { AuthContext } from './AuthContext.js';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let authEventReceived = false;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted || authEventReceived) return;
      if (error) console.error('Failed to restore Supabase session:', error.message);
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      authEventReceived = true;
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      logout,
      isAuthenticated: Boolean(session),
    }),
    [loading, logout, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
