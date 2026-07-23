import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './Header.css';

export function Header() {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

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

  return (
    <header ref={ref} className="header">
      <div className="container header__container">
        <div className="header__brand">
          <span className="header__logo" aria-hidden="true" />
          <h1 className="header__title">Backend Lab</h1>
        </div>
        <nav className="header__nav" aria-label="Main navigation">
          <a href="#dashboard" className="header__link header__link--active">
            Dashboard
          </a>
          <a href="#services" className="header__link">
            Services
          </a>
          <a href="#settings" className="header__link">
            Settings
          </a>
        </nav>
      </div>
    </header>
  );
}
