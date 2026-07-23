import { useEffect, useRef } from 'react';
import { X, LayoutDashboard, Layers, LogOut } from 'lucide-react';
import './Sidebar.css';

export function Sidebar({ isOpen, onClose, onLogout, user }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="sidebar" onClick={onClose} role="presentation" aria-hidden={!isOpen}>
      <div
        id="dashboard-sidebar"
        ref={panelRef}
        className="sidebar__panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Dashboard menu"
      >
        <div className="sidebar__header">
          <div className="sidebar__brand">
            <span className="sidebar__logo" aria-hidden="true" />
            <span className="sidebar__title">Backend Lab</span>
          </div>
          <button className="sidebar__close" onClick={onClose} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>

        <div className="sidebar__user">
          <span className="sidebar__label">SIGNED IN AS</span>
          <span className="sidebar__email">{user?.email || 'Guest'}</span>
        </div>

        <nav className="sidebar__nav" aria-label="Dashboard navigation">
          <a href="/dashboard" className="sidebar__link sidebar__link--active">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </a>
          <a href="/" className="sidebar__link">
            <Layers size={20} />
            <span>Services</span>
          </a>
        </nav>

        <div className="sidebar__footer">
          <button className="sidebar__logout" onClick={onLogout}>
            <LogOut size={20} />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
