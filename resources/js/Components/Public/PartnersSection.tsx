import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';

export interface PartnerData {
  id: number;
  name_en: string;
  name_ar: string;
  logo: string | null;
  size_tier: 'sm' | 'md' | 'lg' | 'xl';
}

interface Props {
  partners: PartnerData[];
}

interface BeltItem {
  key: string;
  name: string;
  logo: string;
  sizeClass: string;
}

const TIER_CLASS: Record<PartnerData['size_tier'], string> = {
  sm: 'max-h-12 md:max-h-16 lg:max-h-20',
  md: 'max-h-14 md:max-h-20 lg:max-h-24',
  lg: 'max-h-16 md:max-h-24 lg:max-h-28',
  xl: 'max-h-20 md:max-h-28 lg:max-h-32',
};

const DEFAULT_PARTNERS: BeltItem[] = [
  { key: 'aramco', name: 'Aramco', logo: '/images/home/partners/aramco.webp', sizeClass: TIER_CLASS.md },
  { key: 'vision-2030', name: 'Vision 2030', logo: '/images/home/partners/vision 2030.webp', sizeClass: TIER_CLASS.lg },
  { key: 'saudi-made', name: 'Saudi Made', logo: '/images/home/partners/SAUDI MADE.webp', sizeClass: TIER_CLASS.md },
  { key: 'modon', name: 'MODON', logo: '/images/home/partners/modon.webp', sizeClass: TIER_CLASS.xl },
  { key: 'nhc', name: 'NHC', logo: '/images/home/partners/nhc.webp', sizeClass: TIER_CLASS.lg },
  { key: 'roshen', name: 'Roshen', logo: '/images/home/partners/roshen.webp', sizeClass: TIER_CLASS.lg },
  { key: 'astm', name: 'ASTM', logo: '/images/home/partners/ASTM.webp', sizeClass: TIER_CLASS.lg },
  { key: 'iso', name: 'ISO', logo: '/images/home/partners/ISO.webp', sizeClass: TIER_CLASS.lg },
  { key: 'saso', name: 'SASO', logo: '/images/home/partners/SASO LOGO.webp', sizeClass: TIER_CLASS.md },
  { key: 'epd', name: 'EPD', logo: '/images/home/partners/epd.webp', sizeClass: TIER_CLASS.md },
  { key: 'hpd', name: 'HPD', logo: '/images/home/partners/HPD.webp', sizeClass: TIER_CLASS.xl },
  { key: 'qarya', name: 'Qarya', logo: '/images/home/partners/qarya.webp', sizeClass: TIER_CLASS.lg },
  { key: 'tasnee3', name: 'Tasnee3', logo: '/images/home/partners/tasnee3.webp', sizeClass: TIER_CLASS.md },
  { key: 'water-co', name: 'Water Co', logo: '/images/home/partners/WATER CO.webp', sizeClass: TIER_CLASS.md },
  { key: 'industry-ministry', name: 'Ministry of Industry', logo: '/images/home/partners/industry ministry.webp', sizeClass: TIER_CLASS.md },
  { key: 'transport-ministry', name: 'Ministry of Transport', logo: '/images/home/partners/TRANSFER MINISTRY.webp', sizeClass: TIER_CLASS.md },
];

function MarqueeBelt({ items }: { items: BeltItem[] }) {
  const [paused, setPaused] = useState(false);
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden relative" dir="ltr">
      <div
        className="flex items-center w-max animate-marquee-left"
        style={{ animationPlayState: paused ? 'paused' : 'running' }}
      >
        {doubled.map((item, index) => (
          <div
            key={`${item.key}-${index}`}
            className="shrink-0 mr-6 md:mr-8 lg:mr-10"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="flex items-center justify-center h-24 w-40 sm:h-28 sm:w-48 md:h-32 md:w-56 lg:h-36 lg:w-60 px-5 py-4 rounded-xl bg-white/95 shadow-[0_4px_16px_rgba(0,0,0,0.18)] ring-1 ring-white/10 hover:shadow-[0_6px_24px_rgba(0,0,0,0.28)] transition-shadow duration-300">
              <img
                src={item.logo}
                alt={item.name}
                title={item.name}
                className={`max-w-full object-contain ${item.sizeClass}`}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PartnersSection({ partners }: Props) {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const items: BeltItem[] =
    partners && partners.length > 0
      ? partners
          .filter((p) => p.logo)
          .map((p) => ({
            key: String(p.id),
            name: language === 'ar' ? p.name_ar : p.name_en,
            logo: p.logo as string,
            sizeClass: TIER_CLASS[p.size_tier] ?? TIER_CLASS.md,
          }))
      : DEFAULT_PARTNERS;

  if (items.length === 0) return null;

  return (
    <section className="relative py-14 md:py-20 lg:py-24 bg-surface overflow-hidden">
      <div className="container mx-auto px-4 text-center mb-10 md:mb-14">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
          {t('home.partners.title')}
        </h2>
        <p className="text-gray-300 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
          {t('home.partners.description')}
        </p>
      </div>

      <MarqueeBelt items={items} />
    </section>
  );
}
