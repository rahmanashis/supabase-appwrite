import { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Menu, LogOut } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { supabase } from '../../lib/supabase';
import { Sidebar } from './Sidebar';
import './Header.css';

export function Header() {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  const isDashboard = location.pathname === '/dashboard';

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setUser(data.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

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
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
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
            <h1 className="header__title">Backend Lab</h1>
          </div>

          <nav className="header__nav" aria-label="Main navigation">
            <a href="/" className={`header__link ${location.pathname === '/' ? 'header__link--active' : ''}`}>
              Services
            </a>
            <a href="/dashboard" className={`header__link ${isDashboard ? 'header__link--active' : ''}`}>
              Dashboard
            </a>
          </nav>

          {user && (
            <div className="header__actions">
              <span className="header__email">{user.email}</span>
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
