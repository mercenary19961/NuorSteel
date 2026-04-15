import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const AUTO_ADVANCE_MS = 10_000;
const EVENT_COUNT = 6;

const YEAR_IMAGES = ['2010', '2014', '2016', '2020', '2023', null]; // index 5 = "Present", uses original bg

function getJourneyBg(activeIndex: number, type: 'desktop' | 'mobile', lang: string) {
  const year = YEAR_IMAGES[activeIndex];
  const l = lang === 'ar' ? 'ar' : 'en';
  if (!year) return `/images/about/journey/bg-${type}-${l}.webp`;
  return `/images/about/journey/${year}-${type}-${l}.webp`;
}

/* ─────────────────────────────────────────────
   Mobile: Swipeable card carousel
   ───────────────────────────────────────────── */
function MobileTimeline() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const [active, setActive] = useState(0);
  const touchStartRef = useRef(0);
  const touchDeltaRef = useRef(0);

  const events = Array.from({ length: EVENT_COUNT }, (_, i) => ({
    year: t(`about.timeline.events.${i}.year`),
    title: t(`about.timeline.events.${i}.title`),
    body: t(`about.timeline.events.${i}.body`),
  }));

  const goNext = () => setActive((prev) => (prev + 1) % EVENT_COUNT);
  const goPrev = () => setActive((prev) => (prev - 1 + EVENT_COUNT) % EVENT_COUNT);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(goNext, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [active]);

  // Touch swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
    touchDeltaRef.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchDeltaRef.current = e.touches[0].clientX - touchStartRef.current;
  };
  const onTouchEnd = () => {
    const threshold = 50;
    if (isRtl) {
      if (touchDeltaRef.current > threshold) goNext();
      else if (touchDeltaRef.current < -threshold) goPrev();
    } else {
      if (touchDeltaRef.current < -threshold) goNext();
      else if (touchDeltaRef.current > threshold) goPrev();
    }
  };

  return (
    <section className="relative bg-black overflow-hidden">
      {/* Background image — changes per active event */}
      <AnimatePresence mode="sync">
        <motion.img
          key={`mobile-bg-${active}`}
          src={getJourneyBg(active, 'mobile', language)}
          alt=""
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      <div className="relative z-10 min-h-[85vh] flex flex-col px-5 py-12">
        {/* Section title */}
        <h2 className="text-2xl font-black text-white mb-8 text-center">
          {t('about.timeline.title')}
        </h2>

        {/* Card area */}
        <div
          className="flex-1 flex flex-col justify-center"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: isRtl ? -60 : 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRtl ? 60 : -60 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
            >
              <div className="text-5xl font-bold text-primary/80 mb-3 leading-none">
                {events[active].year}
              </div>
              <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-wide">
                {events[active].title}
              </h3>
              <p className="text-sm text-white/90 leading-relaxed">
                {events[active].body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation arrows + counter */}
        <div className="flex items-center justify-center gap-4 mt-6 mb-4">
          <button
            onClick={goPrev}
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 active:text-white cursor-pointer"
            aria-label="Previous"
          >
            {isRtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          <span className="text-sm text-white/50 font-medium">
            {active + 1} / {EVENT_COUNT}
          </span>
          <button
            onClick={goNext}
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 active:text-white cursor-pointer"
            aria-label="Next"
          >
            {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2">
          {events.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === active
                  ? 'w-6 h-2 bg-primary'
                  : 'w-2 h-2 bg-white/30'
              }`}
              aria-label={`Go to event ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Desktop: Scroll-driven timeline (unchanged)
   ───────────────────────────────────────────── */
function DesktopTimeline() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [active, setActive] = useState(0);
  const [fillProgress, setFillProgress] = useState(0);
  const activeRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const modeRef = useRef<'auto' | 'scroll' | 'manual'>('auto');
  const isAutoScrollingRef = useRef(false);
  const isRtl = language === 'ar';

  const events = Array.from({ length: EVENT_COUNT }, (_, i) => ({
    year: t(`about.timeline.events.${i}.year`),
    title: t(`about.timeline.events.${i}.title`),
    body: t(`about.timeline.events.${i}.body`),
  }));

  const stopAll = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (progressRef.current) { clearInterval(progressRef.current); progressRef.current = null; }
  }, []);

  const scrollToEvent = useCallback((idx: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper || typeof window === 'undefined') return;
    const rect = wrapper.getBoundingClientRect();
    const wrapperTop = window.scrollY + rect.top;
    const wrapperHeight = rect.height;
    const targetScroll = wrapperTop + (idx / EVENT_COUNT) * wrapperHeight;
    isAutoScrollingRef.current = true;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    setTimeout(() => { isAutoScrollingRef.current = false; }, 800);
  }, []);

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

  const sectionRef = useRef<HTMLElement>(null);
  const isInViewRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          startAuto(activeRef.current);
        } else {
          stopAll();
          modeRef.current = 'auto';
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      stopAll();
    };
  }, [startAuto, stopAll]);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  const scrollIdleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (modeRef.current === 'manual') return;
    if (isAutoScrollingRef.current) return;

    if (modeRef.current === 'auto') {
      stopAll();
      modeRef.current = 'scroll';
    }

    const idx = Math.min(EVENT_COUNT - 1, Math.floor(v * EVENT_COUNT));
    activeRef.current = idx;
    setActive(idx);
    setFillProgress(Math.min(EVENT_COUNT - 1, v * EVENT_COUNT));

    if (scrollIdleRef.current) clearTimeout(scrollIdleRef.current);
    scrollIdleRef.current = setTimeout(() => {
      if (modeRef.current === 'scroll') {
        startAuto(idx);
      }
    }, 3000);
  });

  const goTo = (index: number) => {
    stopAll();
    modeRef.current = 'manual';
    activeRef.current = index;
    setActive(index);
    setFillProgress(index);

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
      <section ref={sectionRef} className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* Background image — changes per active event */}
        <AnimatePresence mode="sync">
          <motion.img
            key={`desktop-bg-${active}`}
            src={getJourneyBg(active, 'desktop', language)}
            alt=""
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        <div className="relative z-10 flex flex-row h-full">
          <div className="flex-1" />

          {/* Timeline rail */}
          <div className="relative flex flex-col items-center justify-center gap-0 px-8 shrink-0">
            {events.map((event, i) => (
              <div key={i} className="flex flex-col items-center relative">
                {i > 0 && (
                  <div className="w-px h-8 relative">
                    <div className="absolute inset-0 bg-white/10" />
                    <div
                      className="absolute top-0 left-0 right-0 bg-primary transition-[height] duration-300 ease-out"
                      style={{
                        height: fillProgress >= i ? '100%' : fillProgress > i - 1 ? `${(fillProgress - (i - 1)) * 100}%` : '0%',
                      }}
                    />
                  </div>
                )}

                <button
                  onClick={() => goTo(i)}
                  className="group flex flex-col items-center gap-1 cursor-pointer focus:outline-none"
                >
                  <span className={`text-sm font-medium transition-colors whitespace-nowrap ${
                    i === active ? 'text-primary' : i <= fillProgress ? 'text-primary/70' : 'text-white/50 group-hover:text-white/80'
                  }`}>
                    {event.year}
                  </span>

                  <div className={`rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                    i === active
                      ? 'w-6 h-6 border-primary bg-primary shadow-[0_0_12px_rgba(255,122,0,0.5)]'
                      : i < fillProgress
                        ? 'w-4 h-4 border-primary bg-primary/40'
                        : 'w-4 h-4 border-white/30 bg-transparent group-hover:border-white/60'
                  }`}>
                    {i === active && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                </button>
              </div>
            ))}
          </div>

          {/* Content panel */}
          <div className="flex-1 flex flex-col justify-center ps-12 pe-16 xl:pe-24 py-16">
            <div className="flex items-center gap-4 mb-12">
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

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <div className="text-8xl xl:text-9xl font-bold text-primary/80 mb-6 leading-none">
                  {events[active].year}
                </div>
                <h3 className="text-3xl font-bold text-white mb-6 uppercase tracking-wide">
                  {events[active].title}
                </h3>
                <p className="text-lg text-white/70 leading-relaxed max-w-3xl">
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

/* ─────────────────────────────────────────────
   Export: picks desktop or mobile
   ───────────────────────────────────────────── */
export default function TimelineSection() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  return isDesktop ? <DesktopTimeline /> : <MobileTimeline />;
}
