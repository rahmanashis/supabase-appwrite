import { useState, useEffect, useRef, useCallback } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { Button } from '../ui/Button';
import './TaskForm.css';

export function TaskForm({ onSubmit, editingTodo, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const reset = useCallback(() => {
    setTitle('');
    setDescription('');
    setImage(null);
    setImagePreview(null);
  }, []);

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title || '');
      setDescription(editingTodo.description || '');
      setImage(null);
      setImagePreview(editingTodo.image_url || null);
    } else {
      reset();
    }
  }, [editingTodo, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsLoading(true);
    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      image,
      existingImageUrl: imagePreview && !image ? imagePreview : null,
    });
    setIsLoading(false);
    if (!editingTodo) reset();
  };

  const isEditing = Boolean(editingTodo);
  const submitLabel = isEditing ? 'Save Task' : 'Add Task';

  return (
    <div className="task-form">
      <h2 className="task-form__title">{isEditing ? 'Edit task' : 'New task'}</h2>
      <form className="task-form__grid" onSubmit={handleSubmit}>
        <div className="task-form__field">
          <label htmlFor="task-title" className="task-form__label">
            TITLE
          </label>
          <input
            id="task-title"
            className="task-form__input"
            type="text"
            placeholder="e.g. Plan weekly sync"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="task-form__field">
          <label htmlFor="task-description" className="task-form__label">
            DESCRIPTION
          </label>
          <input
            id="task-description"
            className="task-form__input"
            type="text"
            placeholder="A short note about this task"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="task-form__actions">
          <div className="task-form__upload">
            <input
              id="task-image"
              ref={fileInputRef}
              className="task-form__file"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              aria-label="Attach image"
            />
            <label htmlFor="task-image" className="task-form__upload-button">
              <ImagePlus size={18} aria-hidden="true" />
              <span>Attach image</span>
            </label>
            {imagePreview ? (
              <div className="task-form__preview">
                <img src={imagePreview} alt="Preview" className="task-form__preview-thumb" />
                <button
                  type="button"
                  className="task-form__preview-clear"
                  onClick={clearImage}
                  aria-label="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <span className="task-form__upload-empty">EMPTY</span>
            )}
          </div>

          <div className="task-form__buttons">
            {isEditing && (
              <Button type="button" variant="secondary" size="md" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
              {submitLabel}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
