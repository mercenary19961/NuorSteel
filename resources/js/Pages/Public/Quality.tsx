import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gauge, FlaskConical, Ruler, Flame, ShieldCheck, FileCheck, FileText, Eye, Download, X, ChevronDown } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { MagicCardGrid, MagicCard } from '@/Components/ui/magic-card';
import { useLanguage } from '@/contexts/LanguageContext';

type ShowcaseKey = 'iso9001' | 'sasoLicense' | 'alHotyCalibration' | 'sasoTest' | 'saudiMade';

const SHOWCASE: { key: ShowcaseKey; pdf: string }[] = [
  { key: 'iso9001',           pdf: '/documents/quality/iso-9001.pdf' },
  { key: 'sasoLicense',       pdf: '/documents/quality/saso-license.pdf' },
  { key: 'alHotyCalibration', pdf: '/documents/quality/al-hoty-calibration.pdf' },
  { key: 'sasoTest',          pdf: '/documents/quality/saso-test-certificate.pdf' },
  { key: 'saudiMade',         pdf: '/documents/quality/saudi-made.pdf' },
];

export default function Quality() {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [isDesktop, setIsDesktop] = useState(false);
  const [activeCert, setActiveCert] = useState(0);
  const [viewingPdf, setViewingPdf] = useState<string | null>(null);
  const showcaseWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Scroll-driven active-cert stepping (desktop only)
  useEffect(() => {
    if (typeof window === 'undefined' || !isDesktop) return;
    const handleScroll = () => {
      const wrapper = showcaseWrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const stickyTravel = wrapper.offsetHeight - viewportHeight;
      if (stickyTravel <= 0) return;
      const scrolled = -rect.top;
      if (scrolled <= 0) { setActiveCert(0); return; }
      const stepSize = stickyTravel / SHOWCASE.length;
      const step = Math.floor(scrolled / stepSize);
      setActiveCert(Math.max(0, Math.min(SHOWCASE.length - 1, step)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDesktop]);

  // Lock body scroll while PDF modal is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (viewingPdf) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [viewingPdf]);

  const viewingEntry = viewingPdf ? SHOWCASE.find(c => c.pdf === viewingPdf) : null;

  // Warm opposite-language hero image during idle time so the language
  // toggle is instant without hurting initial LCP.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const other = language === 'ar' ? 'en' : 'ar';
    const urls = [
      `/images/quality/hero/hero-desktop-${other}.webp`,
      `/images/quality/hero/hero-mobile-${other}.webp`,
    ];
    const preload = () => urls.forEach((src) => { const img = new Image(); img.src = src; });
    const hasIdle = 'requestIdleCallback' in window;
    const handle = hasIdle
      ? window.requestIdleCallback(preload, { timeout: 2000 })
      : window.setTimeout(preload, 1500);
    return () => {
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, [language]);

  return (
    <PublicLayout>
      <Head title="Quality" />

      {/* Hero Section */}
      <section className="relative h-screen bg-surface text-white overflow-hidden flex items-center">
        {/* Background image */}
        <div className="absolute inset-0">
          <picture>
            <source media="(max-width: 639px)" srcSet={`/images/quality/hero/hero-mobile-${language}.webp`} />
            <img
              key={`quality-hero-${language}`}
              src={`/images/quality/hero/hero-desktop-${language}.webp`}
              alt=""
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-bottom"
            />
          </picture>
        </div>

        <div className="relative container mx-auto px-4 pb-32 lg:pb-44">
          <div className="max-w-2xl">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
              {t('quality.hero.label', 'Quality Assurance')}
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6 whitespace-pre-line">
              {t('quality.hero.title')}
            </h1>
            <p className="text-lg lg:text-xl text-gray-400 max-w-lg leading-relaxed">
              {t('quality.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Quality & Manufacturing Assurance */}
      <section className="relative bg-surface text-white py-24 lg:py-32">
        <div className="relative container mx-auto px-4">
          {/* Section intro */}
          <div className="max-w-3xl mb-20">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
              {t('quality.assurance.label', 'Our Approach')}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-8">
              {t('quality.assurance.title', 'Quality & Manufacturing Assurance')}
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              {t('quality.assurance.intro1', 'At Nuor Steel, quality is engineered into every stage of production, from raw material selection to final bar inspection. Our manufacturing process operates under controlled parameters to ensure consistency, compliance, and structural reliability across every delivery.')}
            </p>
            <p className="text-gray-400 leading-relaxed italic border-s-2 border-primary/50 ps-4">
              {t('quality.assurance.intro2', 'We follow a preventive quality philosophy: defects are not detected after production; they are designed out of the process.')}
            </p>
          </div>

          {/* Process cards */}
          <MagicCardGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
            {[
              {
                icon: Gauge,
                title: t('quality.assurance.processControl.title', 'Process Control'),
                description: t('quality.assurance.processControl.description', 'Each billet and rebar is produced through monitored rolling and cooling parameters to maintain uniform mechanical performance and dimensional accuracy across all batches.'),
              },
              {
                icon: FlaskConical,
                title: t('quality.assurance.labTesting.title', 'Laboratory Testing'),
                description: t('quality.assurance.labTesting.description', 'Samples are continuously tested for mechanical and chemical properties including yield strength, tensile strength, elongation, and bend performance to verify compliance with applicable standards.'),
              },
              {
                icon: Ruler,
                title: t('quality.assurance.dimensionalPrecision.title', 'Dimensional Precision'),
                description: t('quality.assurance.dimensionalPrecision.description', 'Bars are manufactured with consistent rib geometry and roundness to guarantee proper concrete bonding and structural stability.'),
              },
              {
                icon: Flame,
                title: t('quality.assurance.weldingWorkability.title', 'Welding & Workability Verification'),
                description: t('quality.assurance.weldingWorkability.description', 'Products are validated for bending and welding performance to ensure safe on-site fabrication without compromising material integrity.'),
              },
              {
                icon: ShieldCheck,
                title: t('quality.assurance.durability.title', 'Durability Performance'),
                description: t('quality.assurance.durability.description', 'Controlled chemical composition and surface quality support resistance to environmental exposure and long-term structural performance.'),
              },
              {
                icon: FileCheck,
                title: t('quality.assurance.commitment.title', 'Quality Commitment'),
                description: t('quality.assurance.commitment.description', 'Every shipment is traceable and documented.'),
              },
            ].map((card, i) => (
              <MagicCard
                key={i}
                className="relative bg-white/5 border border-white/10 rounded-xl p-8"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-5">
                    <card.icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">{card.description}</p>
                </div>
              </MagicCard>
            ))}
          </MagicCardGrid>

          {/* Closing statement */}
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-12 h-px bg-primary/50 mx-auto mb-8" />
            <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">
              {t('quality.assurance.closing', 'Our objective is not only to meet standards but to provide contractors and consultants with confidence that the material will perform as designed throughout the life of the structure.')}
            </p>
          </div>
        </div>
      </section>

      {/* Certifications Showcase — scroll-driven carousel on desktop, stacked cards on mobile */}
      <div ref={showcaseWrapperRef} className="lg:h-[500vh]">
        <section className="relative bg-surface text-white overflow-hidden lg:sticky lg:top-0 lg:h-screen lg:flex lg:flex-col lg:justify-center">
          <div className="container mx-auto px-4 w-full py-20 lg:py-24">
            {/* Section intro */}
            <div className="max-w-3xl mb-12 lg:mb-16">
              <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
                {t('quality.showcase.label')}
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4">
                {t('quality.showcase.title')}
              </h2>
              <p className="text-base lg:text-lg text-gray-300 leading-relaxed">
                {t('quality.showcase.subtitle')}
              </p>
            </div>

            {/* Desktop: 2-column scroll-driven split */}
            <div className="hidden lg:grid lg:grid-cols-[1fr_minmax(0,520px)] gap-12 xl:gap-16 items-center">
              {/* Left: info panel */}
              <div className="relative min-h-75">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={SHOWCASE[activeCert].key}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                    <div className="text-primary/70 text-sm font-semibold tracking-[0.3em] mb-3">
                      {String(activeCert + 1).padStart(2, '0')} / {String(SHOWCASE.length).padStart(2, '0')}
                    </div>
                    <h3 className="text-3xl xl:text-4xl font-black mb-5 leading-tight">
                      {t(`quality.showcase.items.${SHOWCASE[activeCert].key}.title`)}
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-base lg:text-lg mb-8">
                      {t(`quality.showcase.items.${SHOWCASE[activeCert].key}.description`)}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Progress indicator dots */}
                <div className="flex items-center gap-2 mt-2">
                  {SHOWCASE.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 rounded-full transition-all duration-500 ${
                        i === activeCert ? 'bg-primary w-12' : 'bg-white/20 w-5'
                      }`}
                    />
                  ))}
                </div>

                {/* Scroll hint — fades out after first change */}
                {activeCert === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-2 text-gray-500 text-sm mt-8"
                  >
                    <ChevronDown size={16} className="animate-bounce" />
                    {t('quality.showcase.scrollHint')}
                  </motion.div>
                )}
              </div>

              {/* Right: PDF preview card */}
              <div className="relative flex justify-center">
                <AnimatePresence mode="wait">
                  <motion.button
                    key={SHOWCASE[activeCert].key}
                    initial={{ opacity: 0, scale: 0.95, rotateY: 8 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.95, rotateY: -8 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    onClick={() => setViewingPdf(SHOWCASE[activeCert].pdf)}
                    aria-label={t('quality.showcase.viewPdf')}
                    className="relative w-full max-w-120 aspect-3/4 rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-white cursor-pointer group"
                  >
                    <iframe
                      src={`${SHOWCASE[activeCert].pdf}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                      className="absolute top-0 left-0 w-[200%] h-[200%] origin-top-left scale-50 pointer-events-none border-0"
                      title={t(`quality.showcase.items.${SHOWCASE[activeCert].key}.title`)}
                      tabIndex={-1}
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                      <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold inline-flex items-center gap-2 shadow-lg">
                        <Eye size={16} />
                        {t('quality.showcase.viewPdf')}
                      </div>
                    </div>
                  </motion.button>
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile: stacked cards */}
            <div className="lg:hidden flex flex-col gap-6">
              {SHOWCASE.map((cert) => (
                <button
                  key={cert.key}
                  onClick={() => setViewingPdf(cert.pdf)}
                  className="text-start bg-white/5 border border-white/10 rounded-xl overflow-hidden active:scale-[0.99] transition-transform"
                  aria-label={t('quality.showcase.viewPdf')}
                >
                  <div className="relative aspect-3/4 w-full bg-white overflow-hidden">
                    <iframe
                      src={`${cert.pdf}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                      className="absolute top-0 left-0 w-[200%] h-[200%] origin-top-left scale-50 pointer-events-none border-0"
                      title={t(`quality.showcase.items.${cert.key}.title`)}
                      tabIndex={-1}
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2">
                      {t(`quality.showcase.items.${cert.key}.title`)}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                      {t(`quality.showcase.items.${cert.key}.description`)}
                    </p>
                    <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold">
                      <Eye size={14} />
                      {t('quality.showcase.viewPdf')}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* PDF Viewer Modal */}
      <AnimatePresence>
        {viewingPdf && viewingEntry && (
          <motion.div
            key="pdf-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setViewingPdf(null)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative bg-gray-900 border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gray-900/95 backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText size={20} className="text-primary shrink-0" />
                  <h3 className="text-white font-semibold truncate">
                    {t(`quality.showcase.items.${viewingEntry.key}.title`)}
                  </h3>
                </div>
                <div className="flex items-center gap-3 shrink-0 ms-4">
                  <a
                    href={viewingPdf}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-sm font-medium transition-colors"
                  >
                    <Download size={16} />
                    <span className="hidden sm:inline">{t('quality.showcase.download')}</span>
                  </a>
                  <button
                    onClick={() => setViewingPdf(null)}
                    aria-label="Close"
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <iframe
                  src={viewingPdf}
                  className="w-full h-full min-h-[60vh] border-0"
                  title={t(`quality.showcase.items.${viewingEntry.key}.title`)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PublicLayout>
  );
}
