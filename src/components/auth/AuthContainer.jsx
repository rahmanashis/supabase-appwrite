import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import supabase from '../../utils/supabase';
import { Auth } from './Auth';

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
        if (mode === 'signin') {
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) throw signInError;
          if (!data.session) throw new Error('Sign in succeeded but no session was returned.');

          const destination = location.state?.from?.pathname || '/dashboard';
          navigate(destination, { replace: true });
        } else {
          const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
          });

          if (signUpError) throw signUpError;
          if (!data.user) throw new Error('Supabase did not return a new user.');

          if (data.session) {
            const destination = location.state?.from?.pathname || '/dashboard';
            navigate(destination, { replace: true });
          } else {
            navigate('/login', {
              replace: true,
              state: {
                message: 'Account created. Check your email to confirm it, then sign in.',
              },
            });
          }
        }
      } catch (err) {
        console.error(`Supabase ${mode} error:`, err);
        setError(err.message || 'Authentication failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [location.state, mode, navigate]
  );

  return (
    <Auth
      mode={mode}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      message={location.state?.message}
    />
  );
}
