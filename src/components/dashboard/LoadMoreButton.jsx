import { Button } from '../ui/Button';
import './LoadMoreButton.css';

export function LoadMoreButton({ onClick, hasMore, isLoading = false }) {
  if (!hasMore) return null;
  return (
    <div className="load-more">
      <Button onClick={onClick} variant="secondary" size="md" isLoading={isLoading}>
        Load more
      </Button>
    </div>
  );
}
