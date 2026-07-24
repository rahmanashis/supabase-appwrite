import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from '../../hooks/useAuth';
import supabase from '../../utils/supabase';
import { Dashboard } from './Dashboard';

const queryLog = [];
let fetchResponses = [];
let mutationResponse = { error: null };

function createQuery() {
  const record = { filters: [], mode: 'fetch' };
  queryLog.push(record);

  const query = {
    select: vi.fn((columns, options) => {
      record.select = [columns, options];
      return query;
    }),
    eq: vi.fn((column, value) => {
      record.filters.push([column, value]);
      return query;
    }),
    order: vi.fn((column, options) => {
      record.order = [column, options];
      return query;
    }),
    range: vi.fn((from, to) => {
      record.range = [from, to];
      return query;
    }),
    or: vi.fn((filter) => {
      record.or = filter;
      return query;
    }),
    insert: vi.fn((values) => {
      record.mode = 'insert';
      record.values = values;
      return query;
    }),
    update: vi.fn((values) => {
      record.mode = 'update';
      record.values = values;
      return query;
    }),
    delete: vi.fn(() => {
      record.mode = 'delete';
      return query;
    }),
    single: vi.fn(() => query),
    then: (resolve, reject) => {
      const result = record.mode === 'fetch'
        ? fetchResponses.shift() || { data: [], count: 0, error: null }
        : mutationResponse;
      return Promise.resolve(result).then(resolve, reject);
    },
  };

  return query;
}

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../utils/supabase', () => ({
  default: {
    from: vi.fn(() => createQuery()),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://example.com/image.png' } })),
        remove: vi.fn(),
      })),
    },
  },
}));

const tasks = [
  { id: 1, title: 'First task', description: 'One', image_url: null },
  { id: 2, title: 'Second task', description: 'Two', image_url: null },
  { id: 3, title: 'Third task', description: 'Three', image_url: null },
];

describe('Dashboard pagination and ownership', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryLog.length = 0;
    fetchResponses = [];
    mutationResponse = { error: null };
    useAuth.mockReturnValue({ user: { id: 'user-1', email: 'person@example.com' } });
  });

  it('fetches the first three tasks for the signed-in user', async () => {
    fetchResponses.push({ data: tasks, count: 5, error: null });
    render(<Dashboard />);

    expect(await screen.findByText('First task')).toBeInTheDocument();
    expect(queryLog[0].select).toEqual(['*', { count: 'exact' }]);
    expect(queryLog[0].filters).toContainEqual(['user_id', 'user-1']);
    expect(queryLog[0].range).toEqual([0, 2]);
    expect(screen.getByRole('button', { name: 'Load more' })).toBeInTheDocument();
  });

  it('loads three more tasks and hides the button at the exact count', async () => {
    const moreTasks = [
      ...tasks,
      { id: 4, title: 'Fourth task', description: 'Four', image_url: null },
      { id: 5, title: 'Fifth task', description: 'Five', image_url: null },
    ];
    fetchResponses.push(
      { data: tasks, count: 5, error: null },
      { data: moreTasks, count: 5, error: null }
    );

    render(<Dashboard />);
    fireEvent.click(await screen.findByRole('button', { name: 'Load more' }));

    expect(await screen.findByText('Fifth task')).toBeInTheDocument();
    expect(queryLog[1].range).toEqual([0, 5]);
    expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument();
  });

  it('applies server-side search and resets pagination to three', async () => {
    fetchResponses.push(
      { data: tasks, count: 4, error: null },
      { data: [...tasks, { id: 4, title: 'Fourth task', description: '', image_url: null }], count: 4, error: null },
      { data: [tasks[1]], count: 1, error: null }
    );

    render(<Dashboard />);
    fireEvent.click(await screen.findByRole('button', { name: 'Load more' }));
    await screen.findByText('Fourth task');
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search tasks' }), {
      target: { value: 'Second' },
    });

    await waitFor(
      () => {
        expect(queryLog[2].or).toBe('title.ilike.%Second%,description.ilike.%Second%');
      },
      { timeout: 1000 }
    );
    expect(queryLog[2].range).toEqual([0, 2]);
  });

  it('includes user ownership when inserting a task', async () => {
    fetchResponses.push(
      { data: [], count: 0, error: null },
      { data: [{ id: 1, title: 'Private task', description: '', image_url: null }], count: 1, error: null }
    );

    render(<Dashboard />);
    await screen.findByText('No tasks yet');
    fireEvent.change(screen.getByLabelText('TITLE'), { target: { value: 'Private task' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add Task' }));

    await waitFor(() => {
      const insert = queryLog.find((record) => record.mode === 'insert');
      expect(insert.values).toEqual({
        title: 'Private task',
        description: '',
        image_url: null,
        user_id: 'user-1',
      });
    });
  });

  it('does not query tasks without an authenticated user', async () => {
    useAuth.mockReturnValue({ user: null });
    render(<Dashboard />);

    expect(await screen.findByText('No tasks yet')).toBeInTheDocument();
    expect(supabase.from).not.toHaveBeenCalled();
  });
});
