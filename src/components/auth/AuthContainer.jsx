import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Auth } from './Auth';
import { useAuth } from '../../hooks/useAuth';
import { DEMO_USER } from '../../constants/demo';

export function AuthContainer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const mode = location.pathname === '/register' ? 'signup' : 'signin';
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = useCallback(
    async ({ email }) => {
      setIsLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 600));
        login(email || DEMO_USER.email);
        navigate('/dashboard', { replace: true });
      } catch (err) {
        setError(err.message || 'Authentication failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [login, navigate]
  );

  return <Auth mode={mode === 'signin' ? 'signin' : 'signup'} onSubmit={handleSubmit} isLoading={isLoading} error={error} />;
}
