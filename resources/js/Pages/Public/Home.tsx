import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, ShieldCheck, Leaf, Lightbulb, TrendingUp, Linkedin, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicLayout from '@/Layouts/PublicLayout';
import HeroBottomLinks from '@/Components/Public/HeroBottomLinks';
import { useLanguage } from '@/contexts/LanguageContext';

interface LinkedinPost {
  id: number;
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

  const coreValues = [
    {
      key: 'quality',
      icon: ShieldCheck,
      title: content?.core_values?.quality_title || t('home.coreValues.quality.title'),
      description: content?.core_values?.quality_description || t('home.coreValues.quality.description'),
      position: 'top-[12%] right-[10%]',
    },
    {
      key: 'sustainability',
      icon: Leaf,
      title: content?.core_values?.sustainability_title || t('home.coreValues.sustainability.title'),
      description: content?.core_values?.sustainability_description || t('home.coreValues.sustainability.description'),
      position: 'top-[35%] left-[8%]',
    },
    {
      key: 'innovation',
      icon: Lightbulb,
      title: content?.core_values?.innovation_title || t('home.coreValues.innovation.title'),
      description: content?.core_values?.innovation_description || t('home.coreValues.innovation.description'),
      position: 'bottom-[25%] left-[30%]',
    },
    {
      key: 'strategicGrowth',
      icon: TrendingUp,
      title: content?.core_values?.strategic_growth_title || t('home.coreValues.strategicGrowth.title'),
      description: content?.core_values?.strategic_growth_description || t('home.coreValues.strategicGrowth.description'),
      position: 'bottom-[8%] right-[15%]',
    },
  ];

  const [activeValue, setActiveValue] = useState(0);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  const scrollToFooter = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('site-footer')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <PublicLayout transparentHeader>
      <Head title="Home" />

      {/* Hero Section — Full Viewport */}
      <section className="relative h-screen flex flex-col justify-between overflow-hidden">
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
      <section className="py-16 lg:py-24 bg-linear-to-b from-gray-900 to-gray-950">
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
      <section className="py-16 lg:py-24 bg-gray-900 text-white">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-10">
                {content?.core_values?.title || t('home.coreValues.title')}
              </h2>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeValue}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl font-semibold text-primary mb-4">
                    {coreValues[activeValue].title}
                  </h3>
                  <p className="text-lg text-white/70 leading-relaxed">
                    {coreValues[activeValue].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: Image with Overlaid Buttons */}
            <div className="relative aspect-4/3 rounded-xl overflow-hidden">
              {/* Gradient Placeholder */}
              <div className="absolute inset-0 bg-linear-to-br from-gray-700 via-gray-600 to-gray-500" />

              {/* Overlay Buttons */}
              {coreValues.map((value, index) => (
                <button
                  key={index}
                  onClick={() => setActiveValue(index)}
                  className={`absolute flex flex-col items-center gap-1.5 group transition-all duration-300 ${value.position}`}
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                      activeValue === index
                        ? 'bg-primary ring-4 ring-primary/30 scale-110'
                        : 'bg-white/20 backdrop-blur-sm hover:bg-white/30'
                    }`}
                  >
                    <value.icon
                      size={24}
                      className={activeValue === index ? 'text-white' : 'text-white/80'}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium whitespace-nowrap transition-colors duration-300 ${
                      activeValue === index ? 'text-primary' : 'text-white/60'
                    }`}
                  >
                    {value.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section className="overflow-hidden">
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
      <section id="section-sustainability" className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-[#0A66C2] rounded-full flex items-center justify-center mx-auto mb-4">
              <Linkedin className="text-white" size={32} />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('home.linkedin.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('home.linkedin.subtitle')}
            </p>
          </div>

          {linkedin_posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
              {linkedin_posts.slice(0, 3).map((post) => (
                <a
                  key={post.id}
                  href={post.post_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {post.image_url && (
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      <img src={post.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-gray-700 text-sm line-clamp-4 mb-3">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{new Date(post.posted_at).toLocaleDateString()}</span>
                      <ExternalLink size={14} />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center mb-8">
              <p className="text-gray-500 mb-4">{t('home.linkedin.noPosts')}</p>
            </div>
          )}

          <div className="text-center">
            <a
              href="https://www.linkedin.com/company/nuorsteel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-md font-medium transition-colors"
            >
              {t('footer.followLinkedIn')}
              <Linkedin className="ml-2" size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            {content?.cta?.title || t('home.cta.title')}
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {content?.cta?.description || t('home.cta.description')}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-white text-primary hover:bg-gray-100 rounded-md font-medium transition-colors"
          >
            {content?.cta?.button || t('home.cta.button')}
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
