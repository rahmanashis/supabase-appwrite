import { useState, useEffect, useCallback, useMemo } from 'react';
import { User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { TaskForm } from './TaskForm';
import { TaskCard } from './TaskCard';
import { SearchBar } from './SearchBar';
import { LoadMoreButton } from './LoadMoreButton';
import { SkeletonWebpage } from './SkeletonWebpage';
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';
import { ErrorState } from '../ui/ErrorState';
import './Dashboard.css';

const PAGE_SIZE = 6;

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

async function uploadImage(file, userId) {
  if (!file) return null;
  const path = `${userId}/${generateId()}-${file.name}`;
  const { error } = await supabase.storage.from('todo-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('todo-images').getPublicUrl(path);
  return data.publicUrl;
}

export function Dashboard() {
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!mounted) return;
        setUser(userData.user);
        await fetchTodos(userData.user.id);
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load dashboard.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [fetchTodos]);

  const fetchTodos = useCallback(async (userId) => {
    const { data, error: fetchError } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (fetchError) throw fetchError;
    setTodos(data || []);
    setVisibleCount(PAGE_SIZE);
  }, []);

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
    async ({ title, description, image, existingImageUrl }) => {
      try {
        let imageUrl = existingImageUrl;
        if (image) {
          imageUrl = await uploadImage(image, user.id);
        }
        const { error: insertError } = await supabase.from('todos').insert({
          user_id: user.id,
          title,
          description,
          image_url: imageUrl,
        });
        if (insertError) throw insertError;
        await fetchTodos(user.id);
      } catch (err) {
        setError(err.message || 'Failed to add task.');
      }
    },
    [user, fetchTodos]
  );

  const handleEdit = useCallback(
    async ({ title, description, image, existingImageUrl }) => {
      try {
        if (!editingTodo) return;
        let imageUrl = existingImageUrl;
        if (image) {
          imageUrl = await uploadImage(image, user.id);
        }
        const { error: updateError } = await supabase
          .from('todos')
          .update({ title, description, image_url: imageUrl })
          .eq('id', editingTodo.id)
          .eq('user_id', user.id);
        if (updateError) throw updateError;
        setEditingTodo(null);
        await fetchTodos(user.id);
      } catch (err) {
        setError(err.message || 'Failed to update task.');
      }
    },
    [editingTodo, user, fetchTodos]
  );

  const handleDelete = useCallback(
    async (id) => {
      try {
        const { error: deleteError } = await supabase.from('todos').delete().eq('id', id).eq('user_id', user.id);
        if (deleteError) throw deleteError;
        await fetchTodos(user.id);
      } catch (err) {
        setError(err.message || 'Failed to delete task.');
      }
    },
    [user, fetchTodos]
  );

  const handleRetry = useCallback(() => {
    setError(null);
    if (user) fetchTodos(user.id);
  }, [user, fetchTodos]);

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
              {user?.email ? `Signed in as ${user.email}` : 'Organize your work one task at a time.'}
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
