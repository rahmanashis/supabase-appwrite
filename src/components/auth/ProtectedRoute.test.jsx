import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from '../../hooks/useAuth';
import { ProtectedRoute } from './ProtectedRoute';

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

function renderProtectedRoute() {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route path="/login" element={<p>Login page</p>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <p>Private dashboard</p>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => vi.clearAllMocks());

  it('waits for auth initialization', () => {
    useAuth.mockReturnValue({ loading: true, isAuthenticated: false });
    renderProtectedRoute();
    expect(screen.queryByText('Login page')).not.toBeInTheDocument();
    expect(screen.queryByText('Private dashboard')).not.toBeInTheDocument();
  });

  it('redirects unauthenticated users', async () => {
    useAuth.mockReturnValue({ loading: false, isAuthenticated: false });
    renderProtectedRoute();
    expect(await screen.findByText('Login page')).toBeInTheDocument();
  });

  it('renders protected content for authenticated users', () => {
    useAuth.mockReturnValue({ loading: false, isAuthenticated: true });
    renderProtectedRoute();
    expect(screen.getByText('Private dashboard')).toBeInTheDocument();
  });
});
