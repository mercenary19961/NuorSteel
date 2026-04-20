import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import PublicLayout from '@/Layouts/PublicLayout';
import CapabilitiesSection from '@/Components/Public/CapabilitiesSection';
import VisionMissionSection from '@/Components/Public/VisionMissionSection';
import TimelineSection from '@/Components/Public/TimelineSection';
import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  // Shifting green letters for "Saudi Arabia" / "المملكة العربية السعودية"
  const highlightText = t('about.intro.headlineHighlight');
  const GREEN_COUNT = 3;
  const [greenStart, setGreenStart] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGreenStart((prev) => (prev + 1) % highlightText.length);
    }, 150);
    return () => clearInterval(interval);
  }, [highlightText.length]);

  const greenLetters = (
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
  );

  return (
    <PublicLayout>
      <Head title="About Us" />

      {/* SEO h1 — visually hidden */}
      <h1 className="sr-only">{t('about.hero.title')}</h1>

      {/* About Hero — static full-screen section */}
      <section className="relative h-screen bg-surface text-white overflow-hidden">
        {/* Background image */}
        <picture>
          <source media="(max-width: 639px)" srcSet={`/images/about/hero/bg-mobile-${isRtl ? 'ar' : 'en'}.webp`} />
          <img
            src={`/images/about/hero/bg-desktop-${isRtl ? 'ar' : 'en'}.webp`}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-bottom"
          />
        </picture>
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-4xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            >
              <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight mb-6">
                {t('about.intro.headline')}{' '}
                {greenLetters}
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-primary font-medium mb-4 lg:mb-6">
                {t('about.intro.subline')}
              </p>
              <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed mb-3 whitespace-pre-line">
                {t('about.intro.body')}
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl text-white font-bold whitespace-pre-line">
                {t('about.intro.highlight')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <div id="vision-mission" className="scroll-mt-20">
        <VisionMissionSection />
      </div>

      {/* Capabilities */}
      <div id="capabilities" className="scroll-mt-20">
        <CapabilitiesSection />
      </div>

      {/* Timeline */}
      <div id="journey" className="scroll-mt-20">
        <TimelineSection />
      </div>
    </PublicLayout>
  );
}
