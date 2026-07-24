import { useState, useCallback } from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { validateAuth } from '../../utils/validation';
import './Auth.css';

export function Auth({ mode = 'signin', onSubmit, isLoading = false, error = null, message = null }) {
  const isSignIn = mode === 'signin';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touched, setTouched] = useState({});

  const errors = validateAuth({ email, password, confirmPassword: isSignIn ? undefined : confirmPassword });
  const showErrors = (field) => touched[field] && errors[field];

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setTouched({ email: true, password: true, confirmPassword: true });
      if (Object.keys(errors).length > 0) return;
      onSubmit({ email: email.trim(), password });
    },
    [email, password, errors, onSubmit]
  );

  const title = isSignIn ? 'Welcome back' : 'Create your account';
  const subtitle = isSignIn
    ? 'Sign in to continue to your tasks'
    : 'Sign up to start organizing your tasks';
  const submitLabel = isSignIn ? 'Sign In' : 'Create Account';
  const altText = isSignIn ? "Don't have an account?" : 'Already have an account?';
  const altAction = isSignIn ? 'Sign up' : 'Sign in';
  const altHref = isSignIn ? '/register' : '/login';

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__icon">
          <Check size={28} strokeWidth={3} />
        </div>
        <h1 className="auth-card__title">{title}</h1>
        <p className="auth-card__subtitle">{subtitle}</p>

        <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
          <Input
            id="email"
            type="email"
            label="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            error={showErrors('email')}
            autoComplete="email"
            required
          />
          <Input
            id="password"
            type="password"
            label="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            error={showErrors('password')}
            autoComplete={isSignIn ? 'current-password' : 'new-password'}
            required
          />
          {!isSignIn && (
            <Input
              id="confirmPassword"
              type="password"
              label="CONFIRM PASSWORD"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
              error={showErrors('confirmPassword')}
              autoComplete="new-password"
              required
            />
          )}

          {message && !error && (
            <div className="auth-card__message" role="status">
              {message}
            </div>
          )}

          {error && (
            <div className="auth-card__error" role="alert">
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="auth-card__submit">
            {submitLabel}
          </Button>
        </form>

        <p className="auth-card__footer">
          {altText}{' '}
          <Link to={altHref} className="auth-card__link">
            {altAction}
          </Link>
        </p>
      </div>
    </div>
  );
}
