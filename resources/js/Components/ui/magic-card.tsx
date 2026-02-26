import { useRef, useEffect, type ReactNode } from 'react';
import './magic-card.css';

interface MagicCardGridProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  /** How far the glow reaches from the cursor to nearby cards */
  spotlightRadius?: number;
}

/**
 * Wraps a set of MagicCard children and tracks the cursor globally,
 * updating each card's border-glow intensity based on proximity.
 */
export function MagicCardGrid({
  children,
  className = '',
  glowColor = '255, 122, 0',
  spotlightRadius = 400,
}: MagicCardGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const grid = gridRef.current;
    if (!grid) return;

    const proximity = spotlightRadius * 0.5;
    const fadeDistance = spotlightRadius * 0.75;

    const handleMouseMove = (e: MouseEvent) => {
      const cards = grid.querySelectorAll<HTMLElement>('.magic-card');

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Distance from cursor to nearest card edge
        const dist = Math.max(
          0,
          Math.hypot(e.clientX - centerX, e.clientY - centerY) -
            Math.max(rect.width, rect.height) / 2,
        );

        let intensity = 0;
        if (dist <= proximity) intensity = 1;
        else if (dist <= fadeDistance)
          intensity = (fadeDistance - dist) / (fadeDistance - proximity);

        const relX = ((e.clientX - rect.left) / rect.width) * 100;
        const relY = ((e.clientY - rect.top) / rect.height) * 100;

        card.style.setProperty('--glow-x', `${relX}%`);
        card.style.setProperty('--glow-y', `${relY}%`);
        card.style.setProperty('--glow-intensity', intensity.toString());
      });
    };

    const handleMouseLeave = () => {
      const cards = grid.querySelectorAll<HTMLElement>('.magic-card');
      cards.forEach((card) => {
        card.style.setProperty('--glow-intensity', '0');
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [spotlightRadius]);

  return (
    <div
      ref={gridRef}
      className={className}
      style={{ '--glow-color': glowColor } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

interface MagicCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * A card with a mouse-tracking border glow effect.
 * Must be placed inside a <MagicCardGrid> for the proximity glow to work.
 */
export function MagicCard({ children, className = '' }: MagicCardProps) {
  return <div className={`magic-card ${className}`}>{children}</div>;
}
