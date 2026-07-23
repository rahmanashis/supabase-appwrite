import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it.each([
    ['healthy', 'Healthy'],
    ['warning', 'Warning'],
    ['error', 'Error'],
    ['unknown', 'Unknown'],
  ])('renders %s status with %s label', (status, label) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
