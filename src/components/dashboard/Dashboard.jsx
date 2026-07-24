import { useState, useEffect, useCallback } from 'react';
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

const PAGE_SIZE = 3;
const SEARCH_DEBOUNCE_MS = 350;
const TASK_IMAGE_BUCKET = 'task-images';

function createImagePath(file, userId) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const uniqueName = crypto.randomUUID();
  return `${userId || 'public'}/${uniqueName}-${safeName}`;
}

async function uploadTaskImage(file, userId) {
  const path = createImagePath(file, userId);
  const { error: uploadError } = await supabase.storage
    .from(TASK_IMAGE_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(TASK_IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function getTaskImagePath(imageUrl) {
  if (!imageUrl) return null;
  const marker = `/storage/v1/object/public/${TASK_IMAGE_BUCKET}/`;
  const markerIndex = imageUrl.indexOf(marker);
  return markerIndex === -1 ? null : decodeURIComponent(imageUrl.slice(markerIndex + marker.length));
}

async function removeTaskImage(imageUrl) {
  const path = getTaskImagePath(imageUrl);
  if (!path) return;
  await supabase.storage.from(TASK_IMAGE_BUCKET).remove([path]);
}

export function Dashboard() {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [totalCount, setTotalCount] = useState(0);
  const [editingTodo, setEditingTodo] = useState(null);

  const fetchTasks = useCallback(async (currentSearch = '', currentLimit = PAGE_SIZE) => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from('tasks')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(0, currentLimit - 1);

    const normalizedSearch = currentSearch.trim();
    if (normalizedSearch) {
      const escapedSearch = normalizedSearch.replace(/[,%()]/g, '');
      query = query.or(
        `title.ilike.%${escapedSearch}%,description.ilike.%${escapedSearch}%`
      );
    }

    const { data, count, error: fetchError } = await query;

    if (fetchError) {
      setTodos([]);
      setTotalCount(0);
      setError(fetchError.message || 'Failed to load tasks from Supabase.');
    } else {
      setTodos(data || []);
      setTotalCount(count || 0);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setVisibleCount(PAGE_SIZE);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchTasks(debouncedSearch, visibleCount);
  }, [debouncedSearch, fetchTasks, visibleCount]);

  const hasMore = todos.length < totalCount;

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
  }, []);

  const handleLoadMore = useCallback(() => {
    setVisibleCount((currentCount) => currentCount + PAGE_SIZE);
  }, []);

  const handleAdd = useCallback(
    async ({ title, description, image }) => {
      setError(null);
      let imageUrl = null;

      try {
        if (image) {
          imageUrl = await uploadTaskImage(image, user?.id);
        }

        const { error: insertError } = await supabase
          .from('tasks')
          .insert({ title, description, image_url: imageUrl });

        if (insertError) throw insertError;

        setVisibleCount(PAGE_SIZE);
        await fetchTasks(debouncedSearch, PAGE_SIZE);
        return true;
      } catch (err) {
        if (imageUrl) await removeTaskImage(imageUrl);
        setError(err.message || 'Failed to add task.');
        return false;
      }
    },
    [debouncedSearch, fetchTasks, user?.id]
  );

  const handleEdit = useCallback(
    async ({ title, description, image, existingImageUrl }) => {
      if (!editingTodo) return false;

      setError(null);
      const previousImageUrl = editingTodo.image_url || null;
      let imageUrl = existingImageUrl || null;
      let uploadedImageUrl = null;

      try {
        if (image) {
          uploadedImageUrl = await uploadTaskImage(image, user?.id);
          imageUrl = uploadedImageUrl;
        }

        const { error: updateError } = await supabase
          .from('tasks')
          .update({ title, description, image_url: imageUrl })
          .eq('id', editingTodo.id);

        if (updateError) throw updateError;

        setEditingTodo(null);
        await fetchTasks(debouncedSearch, visibleCount);

        if (previousImageUrl && previousImageUrl !== imageUrl) {
          await removeTaskImage(previousImageUrl);
        }

        return true;
      } catch (err) {
        if (uploadedImageUrl) await removeTaskImage(uploadedImageUrl);
        setError(err.message || 'Failed to update task.');
        return false;
      }
    },
    [debouncedSearch, editingTodo, fetchTasks, user?.id, visibleCount]
  );

  const handleDelete = useCallback(
    async (id) => {
      setError(null);
      const task = todos.find((todo) => todo.id === id);

      try {
        const { error: deleteError } = await supabase
          .from('tasks')
          .delete()
          .eq('id', id)
          .select('id')
          .single();
        if (deleteError) throw deleteError;

        if (editingTodo?.id === id) setEditingTodo(null);
        await fetchTasks(debouncedSearch, visibleCount);
        if (task?.image_url) await removeTaskImage(task.image_url);
      } catch (err) {
        setError(err.message || 'Failed to delete task.');
      }
    },
    [debouncedSearch, editingTodo?.id, fetchTasks, todos, visibleCount]
  );

  const handleRetry = useCallback(() => {
    fetchTasks(debouncedSearch, visibleCount);
  }, [debouncedSearch, fetchTasks, visibleCount]);

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
          ) : todos.length === 0 ? (
            <EmptyState query={debouncedSearch} />
          ) : (
            <>
              <div className="dashboard__grid">
                {todos.map((todo) => (
                  <TaskCard key={todo.id} todo={todo} onEdit={setEditingTodo} onDelete={handleDelete} />
                ))}
              </div>
              <LoadMoreButton onClick={handleLoadMore} hasMore={hasMore} />
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
