import { Pencil, Trash2, ImageOff } from 'lucide-react';
import { Card } from '../ui/Card';
import './TaskCard.css';

export function TaskCard({ todo, onEdit, onDelete }) {
  return (
    <Card className="task-card">
      <div className="task-card__content">
        {todo.image_url ? (
          <div className="task-card__media">
            <img
              src={todo.image_url}
              alt={todo.title}
              className="task-card__image"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="task-card__placeholder">
            <ImageOff size={24} aria-hidden="true" />
            <span>No image</span>
          </div>
        )}
        <div className="task-card__body">
          <h3 className="task-card__title">{todo.title}</h3>
          {todo.description && <p className="task-card__description">{todo.description}</p>}
        </div>
      </div>
      <div className="task-card__actions">
        <button
          className="task-card__action task-card__action--edit"
          onClick={() => onEdit(todo)}
          aria-label={`Edit ${todo.title}`}
        >
          <Pencil size={18} />
        </button>
        <button
          className="task-card__action task-card__action--delete"
          onClick={() => onDelete(todo.id)}
          aria-label={`Delete ${todo.title}`}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </Card>
  );
}
