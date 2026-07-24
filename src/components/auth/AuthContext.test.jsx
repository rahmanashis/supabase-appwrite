import { act, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import supabase from '../../utils/supabase';
import { useAuth } from '../../hooks/useAuth';
import { AuthProvider } from './AuthContext.jsx';

const unsubscribe = vi.fn();
let authStateCallback;

vi.mock('../../utils/supabase', () => ({
  default: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn((_callback) => {
        authStateCallback = _callback;
        return { data: { subscription: { unsubscribe } } };
      }),
      signOut: vi.fn(),
    },
  },
}));

function AuthStatus() {
  const { loading, user, isAuthenticated } = useAuth();
  return (
    <p>
      {loading ? 'Loading' : `${isAuthenticated ? 'Signed in' : 'Signed out'}:${user?.email || 'none'}`}
    </p>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authStateCallback = undefined;
  });

  it('restores a Supabase session', async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { email: 'person@example.com' } } },
      error: null,
    });

    render(
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>
    );

    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(await screen.findByText('Signed in:person@example.com')).toBeInTheDocument();
  });

  it('updates when Supabase emits an auth state change', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });

    render(
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>
    );

    expect(await screen.findByText('Signed out:none')).toBeInTheDocument();
    act(() => {
      authStateCallback('SIGNED_IN', { user: { email: 'new@example.com' } });
    });

    await waitFor(() => {
      expect(screen.getByText('Signed in:new@example.com')).toBeInTheDocument();
    });
  });
});
