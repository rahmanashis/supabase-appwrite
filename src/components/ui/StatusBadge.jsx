import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './StatusBadge.css';

const STATUS_LABELS = {
  healthy: 'Healthy',
  warning: 'Warning',
  error: 'Error',
  unknown: 'Unknown',
};

export function StatusBadge({ status }) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const label = STATUS_LABELS[status] || STATUS_LABELS.unknown;

  useEffect(() => {
    if (reducedMotion || !ref.current) return;

    const pulse = gsap.to(ref.current.querySelector('.status-badge__dot'), {
      scale: 1.35,
      opacity: 0.7,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    return () => {
      pulse.kill();
    };
  }, [reducedMotion, status]);

  return (
    <span ref={ref} className={`status-badge status-badge--${status}`}>
      <span className="status-badge__dot" aria-hidden="true" />
      <span className="status-badge__label">{label}</span>
    </span>
  );
}
