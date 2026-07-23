import { ClipboardList } from 'lucide-react';
import './EmptyState.css';

export function EmptyState({ query }) {
  return (
    <div className="empty-state">
      <ClipboardList size={40} className="empty-state__icon" aria-hidden="true" />
      <h3 className="empty-state__title">{query ? 'No matching tasks' : 'No tasks yet'}</h3>
      <p className="empty-state__text">
        {query
          ? 'Try a different search term or clear the search bar.'
          : 'Add your first task above to get started.'}
      </p>
    </div>
  );
}
