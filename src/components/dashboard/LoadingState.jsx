import './LoadingState.css';

export function LoadingState() {
  return (
    <div className="loading-state">
      <span className="loading-state__spinner" aria-hidden="true" />
      <p className="loading-state__text">Loading your tasks...</p>
    </div>
  );
}
