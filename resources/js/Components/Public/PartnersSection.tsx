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

const SIZE_CLASSES: Record<PartnerData['size_tier'], string> = {
  sm: 'max-h-20 max-w-20 lg:max-h-28 lg:max-w-28',
  md: 'max-h-24 max-w-24 lg:max-h-36 lg:max-w-36',
  lg: 'max-h-28 max-w-28 lg:max-h-44 lg:max-w-44',
  xl: 'max-h-32 max-w-32 lg:max-h-52 lg:max-w-52',
};

function splitIntoColumns(items: PartnerData[], cols: number): PartnerData[][] {
  const columns: PartnerData[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => columns[i % cols].push(item));
  return columns;
}

function ScrollColumn({
  partners,
  direction,
  language,
}: {
  partners: PartnerData[];
  direction: 'up' | 'down';
  language: 'en' | 'ar';
}) {
  const [paused, setPaused] = useState(false);
  const items = [...partners, ...partners];

  return (
    <div
      className="h-full overflow-hidden px-2"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={`flex flex-col gap-3 py-2 ${direction === 'up' ? 'animate-scroll-up' : 'animate-scroll-down'}`}
        style={{ animationPlayState: paused ? 'paused' : 'running' }}
      >
        {items.map((partner, i) => (
          <div
            key={`${partner.id}-${i}`}
            className="shrink-0 flex items-center justify-center bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-shadow w-28 h-36 p-3 lg:w-36 lg:h-44 lg:p-4 mx-auto"
          >
            {partner.logo && (
              <img
                src={partner.logo}
                alt={language === 'ar' ? partner.name_ar : partner.name_en}
                className={`object-contain ${SIZE_CLASSES[partner.size_tier] ?? SIZE_CLASSES.md}`}
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PartnersSection({ partners }: Props) {
  const { t } = useTranslation();
  const { language } = useLanguage();

  if (!partners || partners.length === 0) return null;

  const columns = splitIntoColumns(partners, 3);

  return (
    <section className="bg-surface overflow-hidden">
      {/* Mobile: stacked layout */}
      <div className="lg:hidden">
        <div className="px-6 pt-10 pb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            {t('home.partners.title')}
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {t('home.partners.description')}
          </p>
        </div>
        <div className="h-105 grid grid-cols-3 gap-0 px-2">
          {columns.map((col, i) => (
            <ScrollColumn
              key={i}
              partners={col}
              direction={i % 2 === 0 ? 'up' : 'down'}
              language={language}
            />
          ))}
        </div>
      </div>

      {/* Desktop: side-by-side layout */}
      <div className="hidden lg:block relative h-150">
        <div className="absolute top-0 right-0 bottom-0 w-3/5 grid grid-cols-3 gap-0 pe-8">
          {columns.map((col, i) => (
            <ScrollColumn
              key={i}
              partners={col}
              direction={i % 2 === 0 ? 'up' : 'down'}
              language={language}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="w-2/5 text-start">
            <h2 className="text-4xl font-black text-white mb-4">
              {t('home.partners.title')}
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              {t('home.partners.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
