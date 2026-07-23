import './SkeletonWebpage.css';

export function SkeletonWebpage() {
  return (
    <div className="skeleton-webpage" aria-hidden="true">
      <div className="skeleton-webpage__navbar">
        <div className="skeleton-webpage__hamburger" />
        <div className="skeleton-webpage__nav-links">
          <div className="skeleton-webpage__link" />
          <div className="skeleton-webpage__link skeleton-webpage__link--short" />
        </div>
        <div className="skeleton-webpage__avatar" />
      </div>
      <div className="skeleton-webpage__hero">
        <div className="skeleton-webpage__title" />
        <div className="skeleton-webpage__title skeleton-webpage__title--short" />
        <div className="skeleton-webpage__cta" />
      </div>
      <div className="skeleton-webpage__panel">
        <div className="skeleton-webpage__panel-row" />
        <div className="skeleton-webpage__panel-row skeleton-webpage__panel-row--short" />
        <div className="skeleton-webpage__panel-row skeleton-webpage__panel-row--short" />
      </div>
      <div className="skeleton-webpage__grid">
        <div className="skeleton-webpage__card" />
        <div className="skeleton-webpage__card" />
        <div className="skeleton-webpage__card" />
      </div>
    </div>
  );
}
