import { useTranslation } from 'react-i18next';
import { useRef, useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PublicLayout from '@/Layouts/PublicLayout';
import CapabilitiesSection from '@/Components/Public/CapabilitiesSection';
import VisionMissionSection from '@/Components/Public/VisionMissionSection';
import TimelineSection from '@/Components/Public/TimelineSection';
import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Text container: start centered, move to the side on scroll
  const textX = useTransform(scrollYProgress, [0, 0.5], [isRtl ? '40%' : '-40%', isRtl ? '70%' : '-70%']);
  const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);

  // Logo animation — slides in from the side and fades in on scroll
  const logoX = useTransform(scrollYProgress, [0.05, 0.4], [isRtl ? '-60%' : '60%', '0%']);
  const logoOpacity = useTransform(scrollYProgress, [0.05, 0.3], [0, 1]);

  // Shifting green letters for "Saudi Arabia" / "المملكة العربية السعودية"
  const highlightText = t('about.intro.headlineHighlight');
  const GREEN_COUNT = 3;
  const [greenStart, setGreenStart] = useState(0);
  const [mobileAnimated, setMobileAnimated] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGreenStart((prev) => (prev + 1) % highlightText.length);
    }, 150);
    return () => clearInterval(interval);
  }, [highlightText.length]);

  // Trigger mobile animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setMobileAnimated(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PublicLayout>
      <Head title="About Us" />

      {/* SEO h1 — visually hidden */}
      <h1 className="sr-only">{t('about.hero.title')}</h1>

      {/* About Intro — Desktop: scroll-driven | Mobile: time-based animation */}
      {/* Desktop */}
      <div ref={sectionRef} className="relative hidden lg:block h-[300vh]">
        <section className="sticky top-0 h-screen bg-black text-white overflow-hidden">
          <picture>
            <img
              src={`/images/about/hero/bg-desktop-${isRtl ? 'ar' : 'en'}.webp`}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </picture>
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 h-full flex items-center">
            <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
              <motion.div
                style={{ x: textX, scale: textScale }}
                className="max-w-2xl text-start"
              >
                <h2 className="text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
                  {t('about.intro.headline')}{' '}
                  <span className="whitespace-nowrap">
                    {highlightText.split('').map((char, i) => {
                      let isGreen = false;
                      for (let g = 0; g < GREEN_COUNT; g++) {
                        if ((greenStart + g) % highlightText.length === i) { isGreen = true; break; }
                      }
                      return (
                        <span
                          key={i}
                          className="transition-colors duration-500"
                          style={{ color: isGreen ? '#00A651' : 'white' }}
                        >
                          {char}
                        </span>
                      );
                    })}
                  </span>
                </h2>
                <p className="text-lg text-primary font-medium mb-6">
                  {t('about.intro.subline')}
                </p>
                <p className="text-base text-white/70 leading-relaxed mb-3">
                  {t('about.intro.body')}
                </p>
                <p className="text-2xl text-white font-semibold">
                  {t('about.intro.highlight')}
                </p>
              </motion.div>

              <div className={`flex absolute top-0 bottom-0 items-center justify-center w-1/2 ${isRtl ? 'start-0' : 'end-0'}`}>
                <motion.img
                  src="/images/about/hero/logo.webp"
                  alt="Nuor Steel"
                  className="w-95 h-auto"
                  style={{
                    x: logoX,
                    opacity: logoOpacity,
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile */}
      <section className="lg:hidden relative min-h-screen bg-black text-white overflow-hidden">
        <img
          src={`/images/about/hero/bg-mobile-${isRtl ? 'ar' : 'en'}.webp`}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-5 py-16">
          {/* Logo — slides down from above */}
          <motion.img
            src="/images/about/hero/logo.webp"
            alt="Nuor Steel"
            className="w-48 sm:w-56 h-auto mb-8"
            initial={{ opacity: 0, y: -40 }}
            animate={mobileAnimated ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          {/* Text — slides up into place */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={mobileAnimated ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
              {t('about.intro.headline')}{' '}
              <span className="whitespace-nowrap">
                {highlightText.split('').map((char, i) => {
                  let isGreen = false;
                  for (let g = 0; g < GREEN_COUNT; g++) {
                    if ((greenStart + g) % highlightText.length === i) { isGreen = true; break; }
                  }
                  return (
                    <span
                      key={i}
                      className="transition-colors duration-500"
                      style={{ color: isGreen ? '#00A651' : 'white' }}
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
            </h2>
            <p className="text-sm sm:text-base text-primary font-medium mb-4">
              {t('about.intro.subline')}
            </p>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-3">
              {t('about.intro.body')}
            </p>
            <p className="text-lg sm:text-xl text-white font-semibold">
              {t('about.intro.highlight')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <VisionMissionSection />

      {/* Capabilities */}
      <CapabilitiesSection />

      {/* Timeline */}
      <TimelineSection />
    </PublicLayout>
  );
}
