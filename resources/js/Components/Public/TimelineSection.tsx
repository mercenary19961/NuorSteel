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
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const manualRef = useRef(false);
  const isRtl = language === 'ar';

  const events = Array.from({ length: EVENT_COUNT }, (_, i) => ({
    year: t(`about.timeline.events.${i}.year`),
    title: t(`about.timeline.events.${i}.title`),
    body: t(`about.timeline.events.${i}.body`),
  }));

  // Scroll-driven stepping
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (manualRef.current) return;
    // Map scroll progress to event index (leave some buffer at start/end)
    const idx = Math.min(EVENT_COUNT - 1, Math.floor(v * EVENT_COUNT));
    setActive(idx);
  });

  // Auto-advance timer
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % EVENT_COUNT);
    }, AUTO_ADVANCE_MS);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const goTo = (index: number) => {
    manualRef.current = true;
    setActive(index);
    resetTimer();
    // Re-enable scroll-driven after a delay
    setTimeout(() => { manualRef.current = false; }, 2000);
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
          {/* Spacer — pushes timeline toward center */}
          <div className="hidden lg:block lg:flex-1" />

          {/* Timeline rail */}
          <div className="order-2 lg:order-0 flex lg:flex-col items-center justify-center gap-0 py-6 lg:py-0 px-4 lg:px-8 shrink-0 overflow-x-auto">
            {events.map((event, i) => (
              <div key={i} className="flex flex-col lg:flex-col items-center relative">
                {i > 0 && <div className="hidden lg:block w-px h-8 bg-white/20" />}
                {i > 0 && <div className="lg:hidden w-8 h-px bg-white/20" />}

                <button
                  onClick={() => goTo(i)}
                  className="group flex lg:flex-col items-center gap-2 lg:gap-1 cursor-pointer focus:outline-none"
                >
                  <span className={`hidden lg:block text-sm font-medium transition-colors whitespace-nowrap ${
                    i === active ? 'text-primary' : 'text-white/50 group-hover:text-white/80'
                  }`}>
                    {event.year}
                  </span>

                  <div className={`rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                    i === active
                      ? 'w-5 h-5 lg:w-6 lg:h-6 border-primary bg-primary shadow-[0_0_12px_rgba(255,122,0,0.5)]'
                      : 'w-3.5 h-3.5 lg:w-4 lg:h-4 border-white/30 bg-transparent group-hover:border-white/60'
                  }`}>
                    {i === active && <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-white" />}
                  </div>

                  <span className={`lg:hidden text-xs font-medium whitespace-nowrap ${
                    i === active ? 'text-primary' : 'text-white/40'
                  }`}>
                    {event.year}
                  </span>
                </button>

                {i < events.length - 1 && <div className="hidden lg:block w-px h-8 bg-white/20" />}
                {i < events.length - 1 && <div className="lg:hidden w-8 h-px bg-white/20" />}
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
