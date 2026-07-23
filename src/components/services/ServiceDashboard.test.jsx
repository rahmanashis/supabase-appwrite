import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ServiceDashboard } from './ServiceDashboard';

describe('ServiceDashboard', () => {
  it('renders the dashboard title and add button', () => {
    render(<ServiceDashboard />);
    expect(screen.getByText('Service Dashboard')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add service' })).toBeInTheDocument();
  });

  it('opens the modal to add a service', () => {
    render(<ServiceDashboard />);
    fireEvent.click(screen.getByRole('button', { name: 'Add service' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Add service' })).toBeInTheDocument();
  });

  it('shows initial services', () => {
    render(<ServiceDashboard />);
    expect(screen.getByText('Coolify Panel')).toBeInTheDocument();
    expect(screen.getByText('Supabase API')).toBeInTheDocument();
  });
});
