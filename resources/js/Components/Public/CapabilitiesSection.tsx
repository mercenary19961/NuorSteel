import { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { Factory, Cpu, Building2, FlaskConical, Wrench } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { LucideIcon } from 'lucide-react';

const capabilities: { icon: LucideIcon; key: string }[] = [
  { icon: Factory, key: 'integratedManufacturing' },
  { icon: Cpu, key: 'advancedTechnology' },
  { icon: Building2, key: 'largeScaleSupply' },
  { icon: FlaskConical, key: 'qualityAssurance' },
  { icon: Wrench, key: 'customization' },
];

const CARD_COUNT = capabilities.length;

function MobileFlipCard({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 flex items-start gap-4"
      initial={{ opacity: 0, rotateX: 60 }}
      animate={isInView ? { opacity: 1, rotateX: 0 } : {}}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
        delay: index * 0.1,
      }}
      style={{ transformOrigin: 'top center' }}
    >
      {children}
    </motion.div>
  );
}

export default function CapabilitiesSection() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const wrapperTop = window.scrollY + rect.top;
    const wrapperHeight = rect.height;
    const vh = window.innerHeight;
    const scrollRange = wrapperHeight - vh;

    if (scrollRange <= 0) return;

    const rawProgress = (window.scrollY - wrapperTop) / scrollRange;
    setProgress(Math.max(0, Math.min(1, rawProgress)));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        handleScroll();
        rafId = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [handleScroll]);

  // Cards start appearing at 5% scroll and finish by 90%
  const cardRangeStart = 0.05;
  const cardRangeEnd = 0.9;
  const segmentSize = (cardRangeEnd - cardRangeStart) / CARD_COUNT;

  return (
    <div ref={wrapperRef} className="relative" style={{ height: isDesktop ? '350vh' : 'auto' }}>
      <section className="sticky top-0 h-screen bg-surface overflow-hidden" style={isDesktop ? undefined : { position: 'relative', height: 'auto' }}>

        {isDesktop ? (
          /* ── Desktop: scroll-driven horizontal reveal ── */
          <div className="relative z-10 h-full flex flex-col justify-center px-8 xl:px-16">
            {/* Heading */}
            <div
              ref={headingRef}
              className="text-center mb-10"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3 lg:mb-4">
                {t('about.capabilities.title')}
              </h2>
              <p className="text-base lg:text-lg text-white/60 max-w-2xl mx-auto">
                {t('about.capabilities.subtitle')}
              </p>
            </div>

            {/* Cards row */}
            <div className="flex gap-4 xl:gap-5 items-stretch">
              {capabilities.map(({ icon: Icon, key }, i) => {
                const cardStart = cardRangeStart + i * segmentSize;
                const cardProgress = Math.max(0, Math.min(1, (progress - cardStart) / segmentSize));
                // Ease-out cubic
                const eased = 1 - Math.pow(1 - cardProgress, 3);

                // Slide from right in LTR, from left in RTL
                const translateX = (1 - eased) * (isRtl ? -120 : 120);
                const opacity = eased;

                return (
                  <div
                    key={key}
                    className="flex-1 min-w-0 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 xl:p-6 flex flex-col"
                    style={{
                      transform: `translateX(${translateX}%)`,
                      opacity,
                      willChange: 'transform, opacity',
                    }}
                  >
                    <div className="shrink-0 w-11 h-11 xl:w-12 xl:h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                      <Icon className="text-primary" size={22} />
                    </div>
                    <h3 className="text-base xl:text-lg font-bold text-white mb-2">
                      {t(`about.capabilities.${key}.title`)}
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                      {t(`about.capabilities.${key}.description`)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ── Mobile: flip-in cards ── */
          <div className="relative z-10 py-16 px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-white mb-3">
                {t('about.capabilities.title')}
              </h2>
              <p className="text-base text-white/60 max-w-md mx-auto">
                {t('about.capabilities.subtitle')}
              </p>
            </div>
            <div className="flex flex-col gap-4 max-w-md mx-auto" style={{ perspective: '800px' }}>
              {capabilities.map(({ icon: Icon, key }, i) => (
                <MobileFlipCard key={key} index={i}>
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Icon className="text-primary" size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1.5">
                      {t(`about.capabilities.${key}.title`)}
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                      {t(`about.capabilities.${key}.description`)}
                    </p>
                  </div>
                </MobileFlipCard>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
