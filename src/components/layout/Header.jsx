import { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Menu, LogOut } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useAuth } from '../../hooks/useAuth';
import { Sidebar } from './Sidebar';
import './Header.css';

export function Header() {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isDashboard = location.pathname === '/dashboard';

  useEffect(() => {
    if (reducedMotion || !ref.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }, ref);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Supabase logout error:', err);
    }
  };

  return (
    <>
      <header ref={ref} className="header">
        <div className="container header__container">
          <div className="header__brand">
            {isDashboard && (
              <button
                className="header__menu"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
                aria-expanded={sidebarOpen}
                aria-controls="dashboard-sidebar"
              >
                <Menu size={22} />
              </button>
            )}
            <span className="header__logo" aria-hidden="true" />
            <h1 className="header__title">Supabase-Aperite</h1>
          </div>

          {isAuthenticated && (
            <div className="header__actions">
              <span className="header__email">{user?.email}</span>
              <button className="header__logout" onClick={handleLogout} aria-label="Log out">
                <LogOut size={18} />
                <span className="header__logout-text">Log out</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} user={user} />
    </>
  );
}
