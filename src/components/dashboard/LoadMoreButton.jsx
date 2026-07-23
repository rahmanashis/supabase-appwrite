import { Button } from '../ui/Button';
import './LoadMoreButton.css';

export function LoadMoreButton({ onClick, hasMore }) {
  if (!hasMore) return null;
  return (
    <div className="load-more">
      <Button onClick={onClick} variant="secondary" size="md">
        Load more
      </Button>
    </div>
  );
}
