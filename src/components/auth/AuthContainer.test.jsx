import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import supabase from '../../utils/supabase';
import { AuthContainer } from './AuthContainer';

vi.mock('../../utils/supabase', () => ({
  default: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    },
  },
}));

function renderAuth(initialEntry) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/login" element={<AuthContainer />} />
        <Route path="/register" element={<AuthContainer />} />
        <Route path="/dashboard" element={<p>Dashboard destination</p>} />
      </Routes>
    </MemoryRouter>
  );
}

function completeCredentials({ signup = false } = {}) {
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'person@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/^password/i), {
    target: { value: 'secret123' },
  });

  if (signup) {
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'secret123' },
    });
  }
}

describe('AuthContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('signs in with email and password and opens the dashboard', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
      error: null,
    });

    renderAuth('/login');
    completeCredentials();
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'person@example.com',
        password: 'secret123',
      });
    });
    expect(await screen.findByText('Dashboard destination')).toBeInTheDocument();
  });

  it('opens the dashboard when signup returns a session', async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: 'user-1' }, session: { user: { id: 'user-1' } } },
      error: null,
    });

    renderAuth('/register');
    completeCredentials({ signup: true });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'person@example.com',
        password: 'secret123',
      });
    });
    expect(await screen.findByText('Dashboard destination')).toBeInTheDocument();
  });

  it('asks for email confirmation when signup returns no session', async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: 'user-1' }, session: null },
      error: null,
    });

    renderAuth('/register');
    completeCredentials({ signup: true });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    expect(
      await screen.findByText('Account created. Check your email to confirm it, then sign in.')
    ).toBeInTheDocument();
  });

  it('shows Supabase authentication errors', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { session: null },
      error: new Error('Invalid login credentials'),
    });

    renderAuth('/login');
    completeCredentials();
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid login credentials');
  });
});
