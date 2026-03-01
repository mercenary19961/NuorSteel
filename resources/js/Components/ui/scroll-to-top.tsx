import { useState, useEffect, useCallback } from 'react';
import { ChevronUp } from 'lucide-react';

const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScrollToTop() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const update = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0;

    setScrollProgress(progress);
    setVisible(progress >= 0.7);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        update();
        rafId = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [update]);

  const dashOffset = CIRCUMFERENCE * (1 - scrollProgress);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-gray-900/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 cursor-pointer hover:bg-gray-800 group ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      {/* Progress ring */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 44 44"
      >
        {/* Background track */}
        <circle
          cx="22"
          cy="22"
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
        />
        {/* Progress arc */}
        <circle
          cx="22"
          cy="22"
          r={RADIUS}
          fill="none"
          stroke="#FF7A00"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          className="transition-[stroke-dashoffset] duration-100"
        />
      </svg>

      <ChevronUp
        size={18}
        className="relative text-white/70 group-hover:text-primary transition-colors"
      />
    </button>
  );
}
