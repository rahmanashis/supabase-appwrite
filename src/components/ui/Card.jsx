import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './Card.css';

export function Card({ children, className = '', animated = true, delay = 0 }) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (!animated || reducedMotion || !ref.current) return undefined;

    const element = ref.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          delay,
          ease: 'power2.out',
        }
      );
    }, ref);

    return () => {
      ctx.revert();
      gsap.set(element, { clearProps: 'all' });
    };
  }, [animated, reducedMotion, delay]);

  return (
    <div ref={ref} className={`card ${className}`.trim()}>
      {children}
    </div>
  );
}
