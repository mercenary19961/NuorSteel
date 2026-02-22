import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Leaf, Lightbulb, TrendingUp, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';
import PublicLayout from '@/Layouts/PublicLayout';
import HeroBottomLinks from '@/Components/Public/HeroBottomLinks';
import RadialOrbitalTimeline from '@/Components/ui/radial-orbital-timeline';
import { useLanguage } from '@/contexts/LanguageContext';

interface LinkedinPost {
  id: number;
  post_id: string;
  content: string;
  image_url: string | null;
  post_url: string;
  posted_at: string;
}

type ContentMap = Record<string, Record<string, string>>;

interface Props {
  content_en: ContentMap;
  content_ar: ContentMap;
  featured_products: { id: number; name: string; slug: string; short_description: string | null; image: string | null }[];
  linkedin_posts: LinkedinPost[];
}

const heroVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

export default function Home({ content_en, content_ar, linkedin_posts }: Props) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const content = language === 'ar' ? content_ar : content_en;

  const coreValuesData = [
    {
      id: 1,
      title: content?.core_values?.quality_title || t('home.coreValues.quality.title'),
      date: '',
      content: content?.core_values?.quality_description || t('home.coreValues.quality.description'),
      category: 'Quality',
      icon: ShieldCheck,
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
      relatedIds: [1, 3],
      status: 'completed' as const,
      energy: 85,
    },
  ];

  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [linkedinIndex, setLinkedinIndex] = useState(0);
  const [iframeHeight, setIframeHeight] = useState(600);
  const [linkedinPaused, setLinkedinPaused] = useState(false);

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

  // Auto-rotate LinkedIn posts every 15 seconds (pauses on hover)
  useEffect(() => {
    if (typeof window === 'undefined' || linkedin_posts.length <= 1 || linkedinPaused) return;
    const timer = setInterval(() => {
      setLinkedinIndex((prev) => (prev + 1) % linkedin_posts.length);
    }, 15000);
    return () => clearInterval(timer);
  }, [linkedin_posts.length, linkedinPaused]);

  // Reset progress bar on manual navigation
  const goToLinkedinPost = (direction: 'prev' | 'next') => {
    setLinkedinIndex((prev) =>
      direction === 'prev'
        ? (prev - 1 + linkedin_posts.length) % linkedin_posts.length
        : (prev + 1) % linkedin_posts.length
    );
  };

  const scrollToFooter = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('site-footer')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <PublicLayout transparentHeader>
      <Head title="Home" />

      {/* Hero Section — Full Viewport */}
      <section id="section-hero" className="relative h-screen flex flex-col justify-between overflow-hidden">
        {/* Background + Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-gray-800 to-gray-700" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-3xl"
              variants={heroVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight"
              >
                {content?.hero?.title || t('home.hero.title')}
              </motion.h1>

              <motion.a
                variants={itemVariants}
                href="#site-footer"
                onClick={scrollToFooter}
                className="inline-flex items-center mt-8 text-white/70 hover:text-white text-lg group transition-colors duration-200"
              >
                {t('home.hero.contactLink')}
                <ArrowRight className="ltr:ml-2 rtl:mr-2 rtl:rotate-180 group-hover:ltr:translate-x-1 group-hover:rtl:-translate-x-1 transition-transform duration-200" size={20} />
              </motion.a>
            </motion.div>
          </div>
        </div>

        {/* Bottom Navigation Links */}
        <div className="relative z-10">
          <HeroBottomLinks />
        </div>
      </section>

      {/* About Section */}
      <section id="section-about" className="py-16 lg:py-24 bg-linear-to-b from-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              {content?.about?.title || t('home.about.title')}
            </h2>
            <p className="text-lg text-white/80 mb-8">
              {content?.about?.description || t('home.about.description')}
            </p>
            <Link
              href="/about"
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
            >
              {t('home.about.learnMore')}
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section id="section-vision-mission" className="py-16 lg:py-24 bg-linear-to-b from-gray-900 to-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-white text-center mb-12">
            {content?.vision_mission?.title || t('home.visionMission.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">
                {content?.vision_mission?.vision_title || t('home.visionMission.visionTitle')}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {content?.vision_mission?.vision_description || t('home.visionMission.visionDescription')}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">
                {content?.vision_mission?.mission_title || t('home.visionMission.missionTitle')}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {content?.vision_mission?.mission_description || t('home.visionMission.missionDescription')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision 2030 Section */}
      <section id="section-vision-2030" className="py-16 lg:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-lg leading-relaxed text-white/90">
              {content?.vision2030?.paragraph1 || t('home.vision2030.paragraph1')}
            </p>
            <p className="text-lg leading-relaxed text-white/90">
              {content?.vision2030?.paragraph2 || t('home.vision2030.paragraph2')}
            </p>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section id="section-core-values" className="py-16 lg:py-24 bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-white text-center mb-4">
            {content?.core_values?.title || t('home.coreValues.title')}
          </h2>
          <p className="text-lg text-white/60 text-center mb-8 max-w-2xl mx-auto">
            {t('home.coreValues.subtitle', 'Click on any node to explore our core values')}
          </p>
          <RadialOrbitalTimeline timelineData={coreValuesData} />
        </div>
      </section>

      {/* Products Showcase */}
      <section id="section-products" className="overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-100 lg:min-h-137.5 lg:bg-white/20">
          {/* TMT Bars */}
          <Link
            href="/products/tmt-bars"
            className="relative z-10 flex-1 overflow-hidden cursor-pointer group lg:[clip-path:polygon(0_0,calc(100%-3px)_0,calc(100%-3rem-3px)_100%,0_100%)]"
            style={{
              flex: hoveredProduct === 0 ? 1.4 : hoveredProduct === 1 ? 0.6 : 1,
              transition: 'flex 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={() => setHoveredProduct(0)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            {/* Background placeholder (replace with real image later) */}
            <div className="absolute inset-0 bg-linear-to-br from-slate-600 via-slate-500 to-slate-400" />
            {/* Color Overlay */}
            <div
              className="absolute inset-0 bg-blue-900/60 transition-opacity duration-600"
              style={{ opacity: hoveredProduct === 0 ? 0 : 1 }}
            />
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center p-8 lg:p-12 text-white text-center min-h-87.5 lg:min-h-0">
              <h3 className="text-3xl lg:text-4xl font-bold mb-4">
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
            href="/products/billets"
            className="relative flex-1 overflow-hidden cursor-pointer group lg:-ml-12 lg:[clip-path:polygon(calc(3rem+3px)_0,100%_0,100%_100%,3px_100%)]"
            style={{
              flex: hoveredProduct === 1 ? 1.4 : hoveredProduct === 0 ? 0.6 : 1,
              transition: 'flex 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={() => setHoveredProduct(1)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            {/* Background placeholder (replace with real image later) */}
            <div className="absolute inset-0 bg-linear-to-br from-gray-700 via-gray-600 to-gray-500" />
            {/* Color Overlay */}
            <div
              className="absolute inset-0 bg-red-900/60 transition-opacity duration-600"
              style={{ opacity: hoveredProduct === 1 ? 0 : 1 }}
            />
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center p-8 lg:p-12 text-white text-center min-h-87.5 lg:min-h-0">
              <h3 className="text-3xl lg:text-4xl font-bold mb-4">
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

      {/* LinkedIn Feed Section */}
      <section id="section-linkedin" className="py-16 lg:py-24 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Left column: info + controls (flips to right in RTL) */}
            <div className="lg:w-2/5 text-center lg:ltr:text-left lg:rtl:text-right">
              <div className="w-16 h-16 bg-[#0A66C2] rounded-full flex items-center justify-center mx-auto lg:ltr:mx-0 lg:rtl:ms-auto lg:rtl:me-0 mb-6">
                <Linkedin className="text-white" size={32} />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {t('home.linkedin.title')}
              </h2>
              <p className="text-lg text-white/60 mb-8">
                {t('home.linkedin.subtitle')}
              </p>

              {linkedin_posts.length > 1 && (
                <div className="flex items-center gap-4 justify-center lg:ltr:justify-start lg:rtl:justify-end mb-8">
                  <button
                    onClick={() => goToLinkedinPost('prev')}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-white/50 text-sm">
                    {linkedinIndex + 1} / {linkedin_posts.length}
                  </span>
                  <button
                    onClick={() => goToLinkedinPost('next')}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}

              <a
                href="https://www.linkedin.com/company/nuorsteel"
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
              className="lg:w-3/5 w-full"
              onMouseEnter={() => setLinkedinPaused(true)}
              onMouseLeave={() => setLinkedinPaused(false)}
            >
              {linkedin_posts.length > 0 ? (
                <>
                  <div className="relative shadow-lg shadow-black/20 border-2 border-gray-900 transition-[height] duration-300" style={{ height: `${iframeHeight}px` }}>
                    {linkedin_posts.map((post, i) => (
                      <iframe
                        key={post.post_id}
                        src={`https://www.linkedin.com/embed/feed/update/${post.post_id}`}
                        width="100%"
                        height="100%"
                        allowFullScreen
                        style={{ border: 'none' }}
                        title="LinkedIn post"
                        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${i === linkedinIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                      />
                    ))}
                  </div>
                  {linkedin_posts.length > 1 && (
                    <div className="h-1 bg-white/10 mt-3 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0A66C2] rounded-full transition-[width] duration-500 ease-in-out"
                        style={{ width: `${((linkedinIndex + 1) / linkedin_posts.length) * 100}%` }}
                      />
                    </div>
                  )}
                </>
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
