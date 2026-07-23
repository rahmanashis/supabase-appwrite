import { useState, useEffect, useCallback, useMemo } from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { TaskForm } from './TaskForm';
import { TaskCard } from './TaskCard';
import { SearchBar } from './SearchBar';
import { LoadMoreButton } from './LoadMoreButton';
import { SkeletonWebpage } from './SkeletonWebpage';
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';
import { ErrorState } from '../ui/ErrorState';
import supabase from '../../utils/supabase';
import './Dashboard.css';

const PAGE_SIZE = 6;

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function Dashboard() {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [editingTodo, setEditingTodo] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setTodos([]);
      setError(fetchError.message || 'Failed to load tasks from Supabase.');
    } else {
      setTodos(data || []);
      setVisibleCount(PAGE_SIZE);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTodos = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return todos;
    return todos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(query) ||
        (todo.description && todo.description.toLowerCase().includes(query))
    );
  }, [todos, search]);

  const visibleTodos = useMemo(() => filteredTodos.slice(0, visibleCount), [filteredTodos, visibleCount]);
  const hasMore = visibleCount < filteredTodos.length;

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleAdd = useCallback(
    ({ title, description, image, existingImageUrl }) => {
      try {
        let imageUrl = existingImageUrl || null;
        if (image) {
          imageUrl = URL.createObjectURL(image);
        }
        const newTodo = {
          id: generateId(),
          title,
          description,
          image_url: imageUrl,
          created_at: new Date().toISOString(),
        };
        setTodos((prev) => [newTodo, ...prev]);
        setVisibleCount(PAGE_SIZE);
      } catch (err) {
        setError(err.message || 'Failed to add task.');
      }
    },
    []
  );

  const handleEdit = useCallback(
    ({ title, description, image, existingImageUrl }) => {
      try {
        if (!editingTodo) return;
        let imageUrl = existingImageUrl || null;
        if (image) {
          if (editingTodo.image_url && editingTodo.image_url.startsWith('blob:')) {
            URL.revokeObjectURL(editingTodo.image_url);
          }
          imageUrl = URL.createObjectURL(image);
        }
        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === editingTodo.id
              ? { ...todo, title, description, image_url: imageUrl }
              : todo
          )
        );
        setEditingTodo(null);
      } catch (err) {
        setError(err.message || 'Failed to update task.');
      }
    },
    [editingTodo]
  );

  const handleDelete = useCallback((id) => {
    try {
      setTodos((prev) => {
        const todo = prev.find((t) => t.id === id);
        if (todo?.image_url && todo.image_url.startsWith('blob:')) {
          URL.revokeObjectURL(todo.image_url);
        }
        return prev.filter((t) => t.id !== id);
      });
    } catch (err) {
      setError(err.message || 'Failed to delete task.');
    }
  }, []);

  const handleRetry = useCallback(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCancelEdit = useCallback(() => setEditingTodo(null), []);

  return (
    <section className="dashboard" aria-labelledby="dashboard-title">
      <div className="dashboard__header">
        <div className="dashboard__header-main">
          <div className="dashboard__avatar">
            <User size={20} />
          </div>
          <div>
            <h2 id="dashboard-title" className="dashboard__title">
              Task Dashboard
            </h2>
            <p className="dashboard__subtitle">
              Host backend applications with Coolify on a VPS and manage them through React.
              {user?.email && <span className="dashboard__user"> Signed in as {user.email}.</span>}
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard__layout">
        <div className="dashboard__main">
          <TaskForm
            onSubmit={editingTodo ? handleEdit : handleAdd}
            editingTodo={editingTodo}
            onCancel={handleCancelEdit}
          />

          <SearchBar value={search} onChange={handleSearchChange} />

          {error && <ErrorState title="Something went wrong" message={error} onRetry={handleRetry} />}

          {loading ? (
            <LoadingState />
          ) : filteredTodos.length === 0 ? (
            <EmptyState query={search} />
          ) : (
            <>
              <div className="dashboard__grid">
                {visibleTodos.map((todo) => (
                  <TaskCard key={todo.id} todo={todo} onEdit={setEditingTodo} onDelete={handleDelete} />
                ))}
              </div>
              <LoadMoreButton onClick={() => setVisibleCount((c) => c + PAGE_SIZE)} hasMore={hasMore} />
            </>
          )}
        </div>

        <aside className="dashboard__preview">
          <SkeletonWebpage />
        </aside>
      </div>
    </section>
  );
}
