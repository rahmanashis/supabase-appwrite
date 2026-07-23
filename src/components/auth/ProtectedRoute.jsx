import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const [ready, setReady] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) {
    return (
      <div className="auth-page">
        <div className="auth-card__icon" style={{ margin: 0 }}>
          <span className="button__spinner" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
