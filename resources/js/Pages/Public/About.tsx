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

  // Text container: start offset left, move further left on scroll
  const textX = useTransform(scrollYProgress, [0, 0.5], [isRtl ? '40%' : '-40%', isRtl ? '70%' : '-70%']);
  const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);

  // TMT image: visible initially, fades out on scroll
  const tmtOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const tmtX = useTransform(scrollYProgress, [0, 0.15], ['0%', isRtl ? '-30%' : '30%']);

  // Billets image: fades in after TMT fades out
  const billetsOpacity = useTransform(scrollYProgress, [0.2, 0.45], [0, 1]);
  const billetsX = useTransform(scrollYProgress, [0.2, 0.45], [isRtl ? '-30%' : '30%', '0%']);

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
                <p className="text-sm sm:text-base lg:text-lg text-primary font-medium mb-4 lg:mb-6">
                  {t('about.intro.subline')}
                </p>
                <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed mb-3">
                  {t('about.intro.body')}
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl text-white font-semibold">
                  {t('about.intro.highlight')}
                </p>
              </motion.div>

              {/* TMT image — visible initially, fades out to the side on scroll */}
              <motion.div
                style={{ opacity: tmtOpacity, x: tmtX }}
                className={`hidden lg:flex absolute top-0 bottom-0 items-center justify-center w-1/2 ${isRtl ? 'start-0' : 'end-0'}`}
              >
                <img
                  src={`/images/products/renders/tmt-bars-${language === 'ar' ? 'ar' : 'en'}.webp`}
                  alt="TMT Rebars"
                  className="max-h-[50vh] w-auto object-contain"
                />
              </motion.div>

              {/* Billets image — fades in from the side after TMT fades out */}
              <motion.div
                style={{ opacity: billetsOpacity, x: billetsX }}
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
