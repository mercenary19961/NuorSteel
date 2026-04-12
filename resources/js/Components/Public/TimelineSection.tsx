import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AUTO_ADVANCE_MS = 10_000;
const EVENT_COUNT = 6;

export default function TimelineSection() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [active, setActive] = useState(0);
  const [fillProgress, setFillProgress] = useState(0);
  const activeRef = useRef(0); // always mirrors `active` for use in closures
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const modeRef = useRef<'auto' | 'scroll' | 'manual'>('auto');
  const isAutoScrollingRef = useRef(false); // true during programmatic smooth scroll
  const isRtl = language === 'ar';

  const events = Array.from({ length: EVENT_COUNT }, (_, i) => ({
    year: t(`about.timeline.events.${i}.year`),
    title: t(`about.timeline.events.${i}.title`),
    body: t(`about.timeline.events.${i}.body`),
  }));

  // --- Helpers to stop all timers ---
  const stopAll = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (progressRef.current) { clearInterval(progressRef.current); progressRef.current = null; }
  }, []);

  // --- Scroll the page to match a given event index ---
  const scrollToEvent = useCallback((idx: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper || typeof window === 'undefined') return;
    const rect = wrapper.getBoundingClientRect();
    const wrapperTop = window.scrollY + rect.top;
    const wrapperHeight = rect.height;
    // Each event occupies 1/EVENT_COUNT of the wrapper
    const targetScroll = wrapperTop + (idx / EVENT_COUNT) * wrapperHeight;
    // Temporarily ignore scroll events so they don't fight auto
    isAutoScrollingRef.current = true;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    // Re-allow scroll events after the smooth scroll settles
    setTimeout(() => { isAutoScrollingRef.current = false; }, 800);
  }, []);

  // --- Auto-advance: fill line segment over AUTO_ADVANCE_MS, then switch ---
  const startAuto = useCallback((fromIdx: number) => {
    stopAll();
    modeRef.current = 'auto';
    activeRef.current = fromIdx;

    const steps = 60;
    const stepMs = AUTO_ADVANCE_MS / steps;
    let step = 0;
    const nextIdx = Math.min(fromIdx + 1, EVENT_COUNT - 1);

    progressRef.current = setInterval(() => {
      if (modeRef.current !== 'auto') {
        if (progressRef.current) clearInterval(progressRef.current);
        return;
      }
      step++;
      const fraction = Math.min(step / steps, 1);
      setFillProgress(fromIdx + (nextIdx - fromIdx) * fraction);

      if (step >= steps) {
        if (progressRef.current) clearInterval(progressRef.current);
        const current = activeRef.current;
        const next = (current + 1) % EVENT_COUNT;
        activeRef.current = next;
        setActive(next);
        setFillProgress(next);
        scrollToEvent(next);
        startAuto(next);
      }
    }, stepMs);
  }, [stopAll, scrollToEvent]);

  // Start auto on mount
  useEffect(() => {
    startAuto(0);
    return stopAll;
  }, [startAuto, stopAll]);

  // --- Scroll-driven ---
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  const scrollIdleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (modeRef.current === 'manual') return;
    if (isAutoScrollingRef.current) return; // ignore programmatic scroll

    // Switch to scroll mode, stop auto
    if (modeRef.current === 'auto') {
      stopAll();
      modeRef.current = 'scroll';
    }

    const idx = Math.min(EVENT_COUNT - 1, Math.floor(v * EVENT_COUNT));
    activeRef.current = idx;
    setActive(idx);
    setFillProgress(Math.min(EVENT_COUNT - 1, v * EVENT_COUNT));

    // Restart auto after scroll stops for 3s
    if (scrollIdleRef.current) clearTimeout(scrollIdleRef.current);
    scrollIdleRef.current = setTimeout(() => {
      if (modeRef.current === 'scroll') {
        startAuto(idx);
      }
    }, 3000);
  });

  // --- Manual (click / arrows) ---
  const goTo = (index: number) => {
    stopAll();
    modeRef.current = 'manual';
    activeRef.current = index;
    setActive(index);
    setFillProgress(index);

    // Restart auto from the NEW position after 2s
    const restartIdx = index;
    setTimeout(() => {
      if (modeRef.current === 'manual') {
        startAuto(restartIdx);
      }
    }, 2000);
  };

  const goPrev = () => goTo((active - 1 + EVENT_COUNT) % EVENT_COUNT);
  const goNext = () => goTo((active + 1) % EVENT_COUNT);

  return (
    <div ref={wrapperRef} className="relative" style={{ height: `${EVENT_COUNT * 100}vh` }}>
      <section className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* Background image */}
        <picture>
          <source media="(max-width: 639px)" srcSet={`/images/about/journey/bg-mobile-${language === 'ar' ? 'ar' : 'en'}.webp`} />
          <img
            src={`/images/about/journey/bg-desktop-${language === 'ar' ? 'ar' : 'en'}.webp`}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </picture>

        {/* Content */}
        <div className="relative z-10 flex flex-col lg:flex-row h-full">
          {/* Spacer */}
          <div className="hidden lg:block lg:flex-1" />

          {/* Timeline rail */}
          <div className="order-2 lg:order-0 relative flex lg:flex-col items-center justify-center gap-0 py-6 lg:py-0 px-4 lg:px-8 shrink-0 overflow-x-auto">
            {events.map((event, i) => (
              <div key={i} className="flex lg:flex-col items-center relative">
                {/* Connecting segment — desktop vertical / mobile horizontal */}
                {i > 0 && (
                  <div className="hidden lg:block w-px h-8 relative">
                    {/* Grey track */}
                    <div className="absolute inset-0 bg-white/10" />
                    {/* Orange fill — fills if this segment is completed */}
                    <div
                      className="absolute top-0 left-0 right-0 bg-primary transition-[height] duration-300 ease-out"
                      style={{
                        height: fillProgress >= i ? '100%' : fillProgress > i - 1 ? `${(fillProgress - (i - 1)) * 100}%` : '0%',
                      }}
                    />
                  </div>
                )}
                {i > 0 && (
                  <div className="lg:hidden h-px w-8 relative">
                    <div className="absolute inset-0 bg-white/10" />
                    <div
                      className="absolute top-0 left-0 bottom-0 bg-primary transition-[width] duration-300 ease-out"
                      style={{
                        width: fillProgress >= i ? '100%' : fillProgress > i - 1 ? `${(fillProgress - (i - 1)) * 100}%` : '0%',
                      }}
                    />
                  </div>
                )}

                {/* Node + year */}
                <button
                  onClick={() => goTo(i)}
                  className="group flex lg:flex-col items-center gap-2 lg:gap-1 cursor-pointer focus:outline-none"
                >
                  {/* Year label — desktop */}
                  <span className={`hidden lg:block text-sm font-medium transition-colors whitespace-nowrap ${
                    i === active ? 'text-primary' : i <= fillProgress ? 'text-primary/70' : 'text-white/50 group-hover:text-white/80'
                  }`}>
                    {event.year}
                  </span>

                  {/* Circle */}
                  <div className={`rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                    i === active
                      ? 'w-5 h-5 lg:w-6 lg:h-6 border-primary bg-primary shadow-[0_0_12px_rgba(255,122,0,0.5)]'
                      : i < fillProgress
                        ? 'w-3.5 h-3.5 lg:w-4 lg:h-4 border-primary bg-primary/40'
                        : 'w-3.5 h-3.5 lg:w-4 lg:h-4 border-white/30 bg-transparent group-hover:border-white/60'
                  }`}>
                    {i === active && <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-white" />}
                  </div>

                  {/* Year — mobile */}
                  <span className={`lg:hidden text-xs font-medium whitespace-nowrap ${
                    i === active ? 'text-primary' : 'text-white/40'
                  }`}>
                    {event.year}
                  </span>
                </button>
              </div>
            ))}
          </div>

          {/* Content panel */}
          <div className="order-1 lg:order-0 flex-1 flex flex-col justify-center px-6 sm:px-10 lg:ps-12 lg:pe-16 xl:pe-24 py-12 lg:py-16">
            {/* Counter + navigation */}
            <div className="flex items-center gap-4 mb-8 lg:mb-12">
              <button
                onClick={goPrev}
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-colors cursor-pointer"
                aria-label="Previous"
              >
                {isRtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
              <span className="text-sm text-white/50 font-medium">
                {active + 1} / {events.length}
              </span>
              <button
                onClick={goNext}
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-colors cursor-pointer"
                aria-label="Next"
              >
                {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
            </div>

            {/* Event content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <div className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold text-primary/80 mb-4 lg:mb-6 leading-none">
                  {events[active].year}
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 lg:mb-6 uppercase tracking-wide">
                  {events[active].title}
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-white/70 leading-relaxed max-w-3xl">
                  {events[active].body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
