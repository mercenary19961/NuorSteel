import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Leaf, Lightbulb, TrendingUp, Users, Handshake, Linkedin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import PublicLayout from '@/Layouts/PublicLayout';
import HeroBottomLinks from '@/Components/Public/HeroBottomLinks';
import RadialOrbitalTimeline from '@/Components/ui/radial-orbital-timeline';
import PartnersSection from '@/Components/Public/PartnersSection';
import { HeroTypewriter } from '@/Components/ui/typewriter';
import { MagicCardGrid, MagicCard } from '@/Components/ui/magic-card';
import { useLanguage } from '@/contexts/LanguageContext';
import type { LinkedinPost } from '@/types';

type ContentMap = Record<string, Record<string, string>>;

interface Props {
  content_en: ContentMap;
  content_ar: ContentMap;
  featured_products: { id: number; name: string; slug: string; short_description: string | null; image: string | null }[];
  linkedin_posts: LinkedinPost[];
}


function HeroVideo() {
  const loRef = useRef<HTMLVideoElement>(null);
  const hdRef = useRef<HTMLVideoElement>(null);
  const [hdReady, setHdReady] = useState(false);

  useEffect(() => {
    const hdVideo = hdRef.current;
    if (!hdVideo) return;

    const onCanPlay = () => {
      // Sync HD playback time with the low-res video, then swap
      if (loRef.current) {
        hdVideo.currentTime = loRef.current.currentTime;
      }
      hdVideo.play().then(() => setHdReady(true)).catch(() => {});
    };

    hdVideo.addEventListener('canplaythrough', onCanPlay, { once: true });
    hdVideo.load();

    return () => hdVideo.removeEventListener('canplaythrough', onCanPlay);
  }, []);

  return (
    <div className="absolute inset-0">
      {/* Low-res — plays immediately */}
      <video
        ref={loRef}
        autoPlay
        loop
        muted
        playsInline
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${hdReady ? 'opacity-0' : 'opacity-100'}`}
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>
      {/* HD — preloads in background, fades in once ready */}
      <video
        ref={hdRef}
        loop
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${hdReady ? 'opacity-100' : 'opacity-0'}`}
      >
        <source src="/videos/hero-bg-hd.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

export default function Home({ content_en, content_ar, linkedin_posts }: Props) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const content = language === 'ar' ? content_ar : content_en;

  // Warm the browser cache for the opposite-language hero + about images during idle time.
  // This makes the language toggle swap instant without hurting initial LCP — the current
  // language loads eagerly from the <picture> tags, the other language is fetched only
  // after the page is interactive.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const other = language === 'ar' ? 'en' : 'ar';
    const urls = [
      `/images/home/hero/hero-desktop-${other}.webp`,
      `/images/home/hero/hero-mobile-${other}.webp`,
      `/images/home/about/bg-desktop-${other}.webp`,
      `/images/home/about/bg-mobile-${other}.webp`,
    ];
    const preload = () => urls.forEach((src) => { const img = new Image(); img.src = src; });
    const hasIdle = 'requestIdleCallback' in window;
    const handle = hasIdle
      ? window.requestIdleCallback(preload, { timeout: 2000 })
      : window.setTimeout(preload, 1500);
    return () => {
      if (hasIdle) {
        window.cancelIdleCallback(handle);
      } else {
        window.clearTimeout(handle);
      }
    };
  }, [language]);

  const coreValuesData = [
    {
      id: 1,
      title: content?.core_values?.quality_title || t('home.coreValues.quality.title'),
      date: '',
      content: content?.core_values?.quality_description || t('home.coreValues.quality.description'),
      category: 'Quality',
      icon: ShieldCheck,
      image: '/images/home/core-values/quality.webp',
      relatedIds: [2, 4],
      status: 'completed' as const,
      energy: 100,
    },
    {
      id: 2,
      title: content?.core_values?.sustainability_title || t('home.coreValues.sustainability.title'),
      date: '',
      content: content?.core_values?.sustainability_description || t('home.coreValues.sustainability.description'),
      category: 'Sustainability',
      icon: Leaf,
      image: '/images/home/core-values/sustainability.webp',
      relatedIds: [1, 3],
      status: 'completed' as const,
      energy: 95,
    },
    {
      id: 3,
      title: content?.core_values?.innovation_title || t('home.coreValues.innovation.title'),
      date: '',
      content: content?.core_values?.innovation_description || t('home.coreValues.innovation.description'),
      category: 'Innovation',
      icon: Lightbulb,
      image: '/images/home/core-values/innovation.webp',
      relatedIds: [2, 4],
      status: 'completed' as const,
      energy: 90,
    },
    {
      id: 4,
      title: content?.core_values?.strategic_growth_title || t('home.coreValues.strategicGrowth.title'),
      date: '',
      content: content?.core_values?.strategic_growth_description || t('home.coreValues.strategicGrowth.description'),
      category: 'Growth',
      icon: TrendingUp,
      image: '/images/home/core-values/strategic-growth.webp',
      relatedIds: [1, 3],
      status: 'completed' as const,
      energy: 85,
    },
    {
      id: 5,
      title: content?.core_values?.people_teamwork_title || t('home.coreValues.peopleTeamwork.title'),
      date: '',
      content: content?.core_values?.people_teamwork_description || t('home.coreValues.peopleTeamwork.description'),
      category: 'People',
      icon: Users,
      image: '/images/home/core-values/people-teamwork.webp',
      imageBg: true,
      relatedIds: [2, 6],
      status: 'completed' as const,
      energy: 90,
    },
    {
      id: 6,
      title: content?.core_values?.trust_integrity_title || t('home.coreValues.trustIntegrity.title'),
      date: '',
      content: content?.core_values?.trust_integrity_description || t('home.coreValues.trustIntegrity.description'),
      category: 'Trust',
      icon: Handshake,
      image: '/images/home/core-values/trust-integrity.webp',
      imageBg: true,
      relatedIds: [1, 5],
      status: 'completed' as const,
      energy: 88,
    },
  ];

  const [typingDone, setTypingDone] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [linkedinIndex, setLinkedinIndex] = useState(0);
  const [iframeHeight, setIframeHeight] = useState(600);
  const [linkedinPaused, setLinkedinPaused] = useState(false);
  const [preloadNext, setPreloadNext] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [coreValuesStep, setCoreValuesStep] = useState(0);
  const coreValuesWrapperRef = useRef<HTMLDivElement>(null);
  const [linkedinVisible, setLinkedinVisible] = useState(false);
  const linkedinSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Scroll-driven core values stepping (desktop only)
  useEffect(() => {
    if (typeof window === 'undefined' || !isDesktop) {
      setCoreValuesStep(0);
      return;
    }

    const handleScroll = () => {
      const wrapper = coreValuesWrapperRef.current;
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const stickyTravel = wrapper.offsetHeight - viewportHeight;

      if (stickyTravel <= 0) { setCoreValuesStep(0); return; }

      const scrolled = -rect.top;

      if (scrolled <= 0) {
        setCoreValuesStep(0);
      } else {
        // 7 stages: idle view + 6 values
        const stepSize = stickyTravel / 7;
        const step = Math.floor(scrolled / stepSize);
        setCoreValuesStep(Math.min(6, step));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDesktop]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIframeHeight(600);
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.linkedin.com') return;
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data && typeof data.height === 'number' && data.height > 0) {
          setIframeHeight(data.height);
        }
      } catch { /* ignore non-JSON messages */ }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [linkedinIndex]);

  // Only render LinkedIn iframes when section is visible in viewport
  useEffect(() => {
    if (typeof window === 'undefined' || !linkedinSectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setLinkedinVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(linkedinSectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-rotate LinkedIn posts every 15 seconds (pauses on hover or when not visible)
  // Preloads the next iframe 2 seconds before switching
  useEffect(() => {
    if (typeof window === 'undefined' || linkedin_posts.length <= 1 || linkedinPaused || !linkedinVisible) return;
    setPreloadNext(false);
    const preloadTimer = setTimeout(() => setPreloadNext(true), 13000);
    const switchTimer = setTimeout(() => {
      setLinkedinIndex((prev) => (prev + 1) % linkedin_posts.length);
    }, 15000);
    return () => { clearTimeout(preloadTimer); clearTimeout(switchTimer); };
  }, [linkedin_posts.length, linkedinPaused, linkedinIndex]);

  // Reset progress bar on manual navigation
  const goToLinkedinPost = (direction: 'prev' | 'next') => {
    setPreloadNext(false);
    setLinkedinIndex((prev) =>
      direction === 'prev'
        ? (prev - 1 + linkedin_posts.length) % linkedin_posts.length
        : (prev + 1) % linkedin_posts.length
    );
  };

  return (
    <PublicLayout>
      <Head title="Home" />

      {/* Hero Section — Full Viewport */}
      <section id="section-hero" className="relative min-h-[87svh] lg:h-screen flex flex-col justify-between overflow-hidden">
        {/* Background video — low-res plays immediately, HD swaps in once loaded */}
        <HeroVideo />

        {/* Main Content */}
        <div className="relative z-10 flex-1 flex items-end pb-8 lg:items-start lg:pt-[25vh] lg:pb-0">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight">
                <HeroTypewriter
                  key={language}
                  lines={[t('home.hero.line1'), t('home.hero.line2')]}
                  cycleWords={t('home.hero.typewriterWords').split(',')}
                  cycleClassName="text-primary"
                  speed={60}
                  deleteSpeed={40}
                  cycleDelay={3000}
                  onTypingComplete={() => setTypingDone(true)}
                />
              </h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: typingDone ? 1 : 0, y: typingDone ? 0 : 20 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <Link
                  href="/contact"
                  className="relative inline-flex items-center mt-4 lg:mt-8 px-6 py-3 border border-primary text-white font-semibold rounded-lg text-base group overflow-hidden animate-cta-shimmer"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-primary ltr:-translate-x-full rtl:translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
                  />
                  <span className="relative z-10 inline-flex items-center">
                    {t('home.hero.contactLink')}
                    <ArrowRight className="ltr:ml-2 rtl:mr-2 rtl:rotate-180 group-hover:ltr:translate-x-1 group-hover:rtl:-translate-x-1 transition-transform duration-200" size={20} />
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Links */}
        <div className="relative z-10">
          <HeroBottomLinks />
        </div>
      </section>

      {/* About Section (includes Vision & Mission) */}
      <section id="section-about" className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Background image */}
        <picture>
          <source media="(max-width: 639px)" srcSet={`/images/home/about/bg-mobile-${language}.webp`} />
          <img
            key={`about-${language}`}
            src={`/images/home/about/bg-desktop-${language}.webp`}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </picture>

        <div className="relative z-10 container mx-auto px-4 flex-1 flex flex-col py-12 lg:py-16">
          {/* Top: title + description + CTA */}
          <motion.div
            className="lg:max-w-2xl lg:pt-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            <motion.h2
              className="text-3xl lg:text-5xl font-black text-white mb-6"
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            >
              {content?.about?.title || t('home.about.title')}
            </motion.h2>
            <motion.p
              className="text-sm lg:text-base text-white/80 mb-6"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            >
              {content?.about?.description || t('home.about.description')}
            </motion.p>
            <motion.div
              variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            >
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                {t('home.about.learnMore')}
                <ArrowRight size={16} className="rtl:rotate-180" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Vision & Mission cards */}
          {/* Bottom: Vision & Mission cards */}
          <MagicCardGrid className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mt-auto lg:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <MagicCard className="bg-white/5 backdrop-blur-sm p-5 lg:p-6 rounded-xl border border-white/10 h-full">
                <div className="relative z-10">
                  <h3 className="text-base lg:text-lg font-bold text-white mb-2">
                    {content?.vision_mission?.vision_title || t('home.visionMission.visionTitle')}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {content?.vision_mission?.vision_description || t('home.visionMission.visionDescription')}
                  </p>
                </div>
              </MagicCard>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <MagicCard className="bg-white/5 backdrop-blur-sm p-5 lg:p-6 rounded-xl border border-white/10 h-full">
                <div className="relative z-10">
                  <h3 className="text-base lg:text-lg font-bold text-white mb-2">
                    {content?.vision_mission?.mission_title || t('home.visionMission.missionTitle')}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {content?.vision_mission?.mission_description || t('home.visionMission.missionDescription')}
                  </p>
                </div>
              </MagicCard>
            </motion.div>
          </MagicCardGrid>
        </div>
      </section>

      {/* Vision 2030 Section */}
      <section id="section-vision-2030" className="relative min-h-screen flex flex-col text-white overflow-hidden">
        {/* Background image */}
        <picture>
          <source media="(max-width: 1023px)" srcSet="/images/home/vision2030/bg-mobile.webp" />
          <img
            src="/images/home/vision2030/bg-desktop.webp"
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
          />
        </picture>

        <div className="relative z-10 flex-1 flex flex-col justify-start pt-20 lg:justify-center lg:pt-0 container mx-auto px-4">
          {/* Mobile: logo centered, then text below */}
          <div className="lg:hidden flex flex-col items-center">
            <img src="/images/home/vision2030/vision2030-logo.png" alt="Saudi Vision 2030" loading="lazy" decoding="async" className="h-36 object-contain" />
            <div className="space-y-4 pt-6">
              <p className="text-sm leading-relaxed text-white/90">
                {content?.vision2030?.paragraph1 || t('home.vision2030.paragraph1')}
              </p>
              <p className="text-sm leading-relaxed text-white/90">
                {content?.vision2030?.paragraph2 || t('home.vision2030.paragraph2')}
              </p>
            </div>
          </div>

          {/* Desktop: text left, logo right — same row */}
          <div className="hidden lg:flex justify-between items-center">
            <div className="w-1/2 space-y-6">
              <p className="text-xl leading-relaxed text-white/90">
                {content?.vision2030?.paragraph1 || t('home.vision2030.paragraph1')}
              </p>
              <p className="text-xl leading-relaxed text-white/90">
                {content?.vision2030?.paragraph2 || t('home.vision2030.paragraph2')}
              </p>
            </div>
            <div className="w-1/2 flex items-center justify-end">
              <img src="/images/home/vision2030/vision2030-logo.png" alt="Saudi Vision 2030" loading="lazy" decoding="async" className="h-72 object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section — scroll-driven on desktop */}
      <div ref={coreValuesWrapperRef} className="lg:h-[600vh]">
        <section id="section-core-values" className="relative py-10 lg:py-16 bg-surface overflow-hidden lg:sticky lg:top-0 lg:min-h-screen lg:flex lg:flex-col lg:justify-center">
          <div className="relative container mx-auto px-4">
            <h2 className="text-3xl lg:text-4xl font-black text-white text-center">
              {content?.core_values?.title || t('home.coreValues.title')}
            </h2>
            <MagicCardGrid>
              <RadialOrbitalTimeline timelineData={coreValuesData} centerImage="/images/home/core-values/center.webp" scrollStep={isDesktop ? coreValuesStep : undefined} />
            </MagicCardGrid>
          </div>
        </section>
      </div>

      {/* Products Showcase */}
      <section id="section-products" className="overflow-hidden bg-surface">
        <h2 className="text-3xl lg:text-4xl font-black text-white text-center py-10 lg:py-14">
          {content?.products?.title || t('home.products.title', 'Our Products')}
        </h2>
        <div className="flex flex-col lg:flex-row min-h-100 lg:min-h-137.5 lg:bg-white/20">
          {/* TMT Bars */}
          <Link
            href="/products?product=tmt-bars&expanded=true"
            className="relative z-10 flex-1 overflow-hidden cursor-pointer group"
            style={{
              flex: hoveredProduct === 0 ? 1.4 : hoveredProduct === 1 ? 0.6 : 1,
              transition: 'flex 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              clipPath: isDesktop
                ? language === 'ar'
                  ? 'polygon(3px 0, 100% 0, 100% 100%, calc(3rem + 3px) 100%)'
                  : 'polygon(0 0, calc(100% - 3px) 0, calc(100% - 3rem - 3px) 100%, 0 100%)'
                : undefined,
            }}
            onMouseEnter={() => setHoveredProduct(0)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            {/* Background image */}
            <picture>
              <source media="(max-width: 1023px)" srcSet="/images/home/products/tmt-bars-mobile.png" />
              <img src="/images/home/products/tmt-bars-desktop.png" alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
            </picture>
            {/* Color Overlay */}
            <div
              className="absolute inset-0 bg-gray-900/70 transition-opacity duration-600"
              style={{ opacity: hoveredProduct === 0 ? 0.4 : 1 }}
            />
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center p-8 lg:p-12 text-white text-center min-h-87.5 lg:min-h-0">
              <h3 className="text-3xl lg:text-4xl font-black mb-4 text-primary">
                {t('home.products.tmtBars.title')}
              </h3>
              <p className="text-sm lg:text-base text-white/80 max-w-md leading-relaxed">
                {t('home.products.tmtBars.description')}
              </p>
              <span className="mt-6 inline-flex items-center text-sm font-medium text-white/60 group-hover:text-white transition-colors duration-300">
                {t('products.viewDetails')}
                <ArrowRight className="ltr:ml-2 rtl:mr-2 rtl:rotate-180" size={16} />
              </span>
            </div>
          </Link>

          {/* Billets */}
          <Link
            href="/products?product=billets&expanded=true"
            className="relative flex-1 overflow-hidden cursor-pointer group lg:-ms-12"
            style={{
              flex: hoveredProduct === 1 ? 1.4 : hoveredProduct === 0 ? 0.6 : 1,
              transition: 'flex 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              clipPath: isDesktop
                ? language === 'ar'
                  ? 'polygon(0 0, calc(100% - 3rem - 3px) 0, calc(100% - 3px) 100%, 0 100%)'
                  : 'polygon(calc(3rem + 3px) 0, 100% 0, 100% 100%, 3px 100%)'
                : undefined,
            }}
            onMouseEnter={() => setHoveredProduct(1)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            {/* Background image */}
            <picture>
              <source media="(max-width: 1023px)" srcSet="/images/home/products/billets-mobile.png" />
              <img src="/images/home/products/billets-desktop.png" alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
            </picture>
            {/* Color Overlay */}
            <div
              className="absolute inset-0 bg-gray-900/70 transition-opacity duration-600"
              style={{ opacity: hoveredProduct === 1 ? 0.4 : 1 }}
            />
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center p-8 lg:p-12 text-white text-center min-h-87.5 lg:min-h-0">
              <h3 className="text-3xl lg:text-4xl font-black mb-4 text-primary">
                {t('home.products.billets.title')}
              </h3>
              <p className="text-sm lg:text-base text-white/80 max-w-md leading-relaxed">
                {t('home.products.billets.description')}
              </p>
              <span className="mt-6 inline-flex items-center text-sm font-medium text-white/60 group-hover:text-white transition-colors duration-300">
                {t('products.viewDetails')}
                <ArrowRight className="ltr:ml-2 rtl:mr-2 rtl:rotate-180" size={16} />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Partners & Clients Section — temporarily hidden */}
      {/* <PartnersSection /> */}

      {/* LinkedIn Feed Section */}
      <section ref={linkedinSectionRef} id="section-linkedin" className="relative py-16 lg:py-24 bg-surface overflow-hidden">
        <div className="relative container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Left column: info + controls (flips to right in RTL) */}
            <div className="lg:w-2/5 text-center lg:text-start">
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
                {t('home.hero.bottomLinks.news')}
              </h2>
              <p className="text-lg text-white/60 mb-8">
                {t('home.linkedin.subtitle')}
              </p>

              {linkedin_posts.length > 1 && (
                <div className="flex items-center gap-4 justify-center lg:justify-start mb-8">
                  <button
                    onClick={() => goToLinkedinPost('prev')}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  >
                    <ChevronLeft className="rtl:rotate-180" size={20} />
                  </button>
                  <span className="text-white/50 text-sm">
                    {linkedinIndex + 1} / {linkedin_posts.length}
                  </span>
                  <button
                    onClick={() => goToLinkedinPost('next')}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  >
                    <ChevronRight className="rtl:rotate-180" size={20} />
                  </button>
                </div>
              )}

              <a
                href="https://www.linkedin.com/company/nuor-steel/?trk=public_post_embed_feed-actor-name"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-md font-medium transition-colors"
              >
                {t('footer.followLinkedIn')}
                <Linkedin className="ltr:ml-2 rtl:mr-2" size={18} />
              </a>
            </div>

            {/* Right column: post embed (flips to left in RTL) */}
            <div
              className="lg:w-3/5 w-full flex justify-center"
              onMouseEnter={() => setLinkedinPaused(true)}
              onMouseLeave={() => setLinkedinPaused(false)}
            >
              {linkedin_posts.length > 0 ? (
                <div className="w-full max-w-150">
                  <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-black/30 ring-1 ring-white/10 transition-[height] duration-300" style={{ height: `${iframeHeight}px` }}>
                    {linkedinVisible ? (
                      <>
                        <iframe
                          key={linkedin_posts[linkedinIndex].post_id}
                          src={`https://www.linkedin.com/embed/feed/update/${linkedin_posts[linkedinIndex].post_id}`}
                          width="100%"
                          height="100%"
                          allowFullScreen
                          loading="lazy"
                          style={{ border: 'none' }}
                          title="LinkedIn post"
                          className="absolute inset-0 w-full h-full"
                        />
                        {preloadNext && linkedin_posts.length > 1 && (
                          <iframe
                            key={`preload-${linkedin_posts[(linkedinIndex + 1) % linkedin_posts.length].post_id}`}
                            src={`https://www.linkedin.com/embed/feed/update/${linkedin_posts[(linkedinIndex + 1) % linkedin_posts.length].post_id}`}
                            width="100%"
                            height="100%"
                            style={{ border: 'none' }}
                            title="LinkedIn post preload"
                            className="absolute inset-0 w-full h-full opacity-0"
                            aria-hidden="true"
                            tabIndex={-1}
                          />
                        )}
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                        <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  {linkedin_posts.length > 1 && (
                    <div className="h-1 bg-white/10 mt-4 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0A66C2] rounded-full transition-[width] duration-500 ease-in-out"
                        style={{ width: `${((linkedinIndex + 1) / linkedin_posts.length) * 100}%` }}
                      />
                    </div>
                  )}
                  {linkedin_posts[linkedinIndex]?.post_url && (
                    <div className="mt-4 flex justify-center">
                      <a
                        href={linkedin_posts[linkedinIndex].post_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-md text-sm font-medium transition-colors"
                      >
                        {t('home.linkedin.viewPost')}
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-white/50">{t('home.linkedin.noPosts')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
