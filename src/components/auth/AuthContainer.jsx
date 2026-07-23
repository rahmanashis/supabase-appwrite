import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Auth } from './Auth';
import { supabase } from '../../lib/supabase';

export function AuthContainer() {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.pathname === '/register' ? 'signup' : 'signin';
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = useCallback(
    async ({ email, password }) => {
      setIsLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 600));

        if (mode === 'signin') {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (signInError) throw signInError;
        } else {
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
          });
          if (signUpError) throw signUpError;
        }

        navigate('/dashboard', { replace: true });
      } catch (err) {
        setError(err.message || 'Authentication failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [mode, navigate]
  );

  return <Auth mode={mode === 'signin' ? 'signin' : 'signup'} onSubmit={handleSubmit} isLoading={isLoading} error={error} />;
}
