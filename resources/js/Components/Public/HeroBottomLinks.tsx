import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const links = [
  { labelKey: 'home.hero.bottomLinks.about', targetId: 'section-about' },
  { labelKey: 'home.hero.bottomLinks.coreValues', targetId: 'section-core-values' },
  { labelKey: 'home.hero.bottomLinks.news', targetId: 'section-linkedin' },
];

// Placeholder gradient colors for each link's hover image
const gradients = [
  'from-primary/50 to-orange-900/30',
  'from-amber-600/50 to-yellow-900/30',
  'from-green-600/50 to-emerald-900/30',
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
            {/* Image reveal container */}
            <div className="relative h-24 sm:h-32 overflow-hidden mb-2 rounded-sm">
              <div
                className={`absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out bg-linear-to-t ${gradients[index]}`}
              />
            </div>

            {/* Line */}
            <div className="h-0.5 bg-white/30 group-hover:bg-primary transition-colors duration-300" />

            {/* Label */}
            <p className="text-white/60 group-hover:text-white text-xs sm:text-sm mt-3 uppercase tracking-widest transition-colors duration-300 font-medium">
              {t(link.labelKey)}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
