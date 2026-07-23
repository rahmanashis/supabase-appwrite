import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './Modal.css';

export function Modal({ isOpen, title, children, onClose }) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;

    const lastFocused = document.activeElement;
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.focus();
    }

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('keydown', handleKey);
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!overlayRef.current || !dialogRef.current) return;

    const ctx = gsap.context(() => {
      if (isOpen) {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: reducedMotion ? 0 : 0.25, ease: 'power2.out' }
        );
        gsap.fromTo(
          dialogRef.current,
          { opacity: 0, y: 24, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: reducedMotion ? 0 : 0.3,
            ease: 'power2.out',
          }
        );
      } else {
        gsap.to(overlayRef.current, { opacity: 0, duration: reducedMotion ? 0 : 0.2 });
        gsap.to(dialogRef.current, {
          opacity: 0,
          y: 16,
          scale: 0.98,
          duration: reducedMotion ? 0 : 0.2,
        });
      }
    });

    return () => ctx.revert();
  }, [isOpen, reducedMotion]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="modal-overlay"
      onClick={onClose}
      role="presentation"
      aria-hidden={!isOpen}
    >
      <div
        ref={dialogRef}
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {title}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close dialog">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
