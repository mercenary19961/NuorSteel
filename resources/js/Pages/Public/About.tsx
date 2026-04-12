import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
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

  // Text container: start offset left, move further left on scroll
  const textX = useTransform(scrollYProgress, [0, 0.5], [isRtl ? '40%' : '-40%', isRtl ? '70%' : '-70%']);
  const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);

  // Image: fade in
  const imageOpacity = useTransform(scrollYProgress, [0.2, 0.55], [0, 1]);
  const imageX = useTransform(scrollYProgress, [0.2, 0.55], [isRtl ? '-30%' : '30%', '0%']);

  return (
    <PublicLayout>
      <Head title="About Us" />

      {/* SEO h1 — visually hidden */}
      <h1 className="sr-only">{t('about.hero.title')}</h1>

      {/* About Intro — scroll-driven center → side + image reveal */}
      <div ref={sectionRef} className="relative h-[300vh]">
        <section className="sticky top-0 h-screen bg-black text-white overflow-hidden">
          {/* Grid texture */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          <div className="relative z-10 h-full flex items-center">
            <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
              {/* Text */}
              <motion.div
                style={{ x: textX, scale: textScale }}
                className="max-w-2xl text-start"
              >
                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-4 lg:mb-6">
                  {t('about.intro.headline')}
                </h2>
                <p className="text-lg sm:text-xl lg:text-2xl text-primary font-medium mb-4 lg:mb-6">
                  {t('about.intro.subline')}
                </p>
                <p className="text-base sm:text-lg lg:text-xl text-white/70 leading-relaxed mb-3">
                  {t('about.intro.body')}
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl text-white font-semibold">
                  {t('about.intro.highlight')}
                </p>
              </motion.div>

              {/* Image — fades in from the side on scroll (absolute so it doesn't push text) */}
              <motion.div
                style={{ opacity: imageOpacity, x: imageX }}
                className={`hidden lg:flex absolute top-0 bottom-0 items-center justify-center w-1/2 ${isRtl ? 'start-0' : 'end-0'}`}
              >
                <img
                  src={`/images/products/renders/billets-${language === 'ar' ? 'ar' : 'en'}.webp`}
                  alt={t('about.intro.highlight')}
                  className="max-h-[70vh] w-auto object-contain"
                />
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      {/* Vision & Mission */}
      <VisionMissionSection />

      {/* Capabilities */}
      <CapabilitiesSection />

      {/* Timeline */}
      <TimelineSection />
    </PublicLayout>
  );
}
