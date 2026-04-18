import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const links = [
  { labelKey: 'home.hero.bottomLinks.about', targetId: 'section-about', image: '/images/home/page-links/about-us.png' },
  { labelKey: 'home.hero.bottomLinks.coreValues', targetId: 'section-core-values', image: '/images/home/page-links/core-values.png' },
  { labelKey: 'home.hero.bottomLinks.news', targetId: 'section-linkedin', image: '/images/home/page-links/news.png' },
];

export default function HeroBottomLinks() {
  const { t } = useTranslation();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="container mx-auto px-4 pb-8">
      <div className="flex gap-4 sm:gap-6">
        {links.map((link, index) => (
          <motion.div
            key={link.targetId}
            className="flex-1 group cursor-pointer"
            onClick={() => scrollToSection(link.targetId)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.15, duration: 0.5, ease: 'easeOut' }}
          >
            {/* Image reveal container — hidden on mobile */}
            <div className="relative hidden sm:block h-32 lg:h-44 overflow-hidden mb-2 rounded-sm">
              <img
                src={link.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out grayscale-50 brightness-110"
              />
            </div>

            {/* Line */}
            <div className="h-0.5 bg-white/30 group-hover:bg-primary transition-colors duration-300" />

            {/* Label */}
            <p className="text-white/60 sm:group-hover:text-white text-xs sm:text-sm mt-2 sm:mt-3 uppercase tracking-widest transition-colors duration-300 font-medium">
              {t(link.labelKey)}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
