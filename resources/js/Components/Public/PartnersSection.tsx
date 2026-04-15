import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Partner {
  name: string;
  logo: string;
  logoClass?: string;
}

const LG = 'max-h-24 max-w-24 lg:max-h-36 lg:max-w-36';
const XL = 'max-h-28 max-w-28 lg:max-h-44 lg:max-w-44';
const XXL = 'max-h-32 max-w-32 lg:max-h-52 lg:max-w-52';
const XXXL = 'max-h-36 max-w-36 lg:max-h-60 lg:max-w-60';

const partners: Partner[] = [
  { name: 'Aramco', logo: '/images/home/partners/aramco.webp' },
  { name: 'Vision 2030', logo: '/images/home/partners/vision 2030.webp', logoClass: XXL },
  { name: 'Saudi Made', logo: '/images/home/partners/SAUDI MADE.webp' },
  { name: 'MODON', logo: '/images/home/partners/modon.webp', logoClass: XXXL },
  { name: 'NHC', logo: '/images/home/partners/nhc.webp', logoClass: XL },
  { name: 'Roshen', logo: '/images/home/partners/roshen.webp', logoClass: XL },
  { name: 'ASTM', logo: '/images/home/partners/ASTM.webp', logoClass: XXL },
  { name: 'ISO', logo: '/images/home/partners/ISO.webp', logoClass: XXL },
  { name: 'SASO', logo: '/images/home/partners/SASO LOGO.webp' },
  { name: 'EPD', logo: '/images/home/partners/epd.webp' },
  { name: 'HPD', logo: '/images/home/partners/HPD.webp', logoClass: XXXL },
  { name: 'Qarya', logo: '/images/home/partners/qarya.webp', logoClass: XXL },
  { name: 'Tasnee3', logo: '/images/home/partners/tasnee3.webp' },
  { name: 'Water Co', logo: '/images/home/partners/WATER CO.webp' },
  { name: 'Ministry of Industry', logo: '/images/home/partners/industry ministry.webp' },
  { name: 'Ministry of Transport', logo: '/images/home/partners/TRANSFER MINISTRY.webp', logoClass: LG },
];

// Split partners into 3 columns
function splitIntoColumns(items: Partner[], cols: number): Partner[][] {
  const columns: Partner[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => columns[i % cols].push(item));
  return columns;
}

function ScrollColumn({
  partners,
  direction,
}: {
  partners: Partner[];
  direction: 'up' | 'down';
}) {
  const [paused, setPaused] = useState(false);
  // Duplicate items for seamless loop
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
            key={`${partner.name}-${i}`}
            className="shrink-0 flex items-center justify-center bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-shadow w-28 h-36 p-3 lg:w-36 lg:h-44 lg:p-4 mx-auto"
          >
            <img
              src={partner.logo}
              alt={partner.name}
              className={`object-contain lg:max-h-none lg:max-w-none ${partner.logoClass || 'max-h-24 max-w-24 lg:max-h-28 lg:max-w-32'}`}
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PartnersSection() {
  const { t } = useTranslation();
  const columns = splitIntoColumns(partners, 3);

  return (
    <section className="bg-[#414042] overflow-hidden">
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
        <div className="h-[420px] grid grid-cols-3 gap-0 px-2">
          {columns.map((col, i) => (
            <ScrollColumn
              key={i}
              partners={col}
              direction={i % 2 === 0 ? 'up' : 'down'}
            />
          ))}
        </div>
      </div>

      {/* Desktop: side-by-side layout */}
      <div className="hidden lg:block relative h-[600px]">
        {/* Right — Scrolling columns (full section height) */}
        <div className="absolute top-0 right-0 bottom-0 w-3/5 grid grid-cols-3 gap-0 pe-8">
          {columns.map((col, i) => (
            <ScrollColumn
              key={i}
              partners={col}
              direction={i % 2 === 0 ? 'up' : 'down'}
            />
          ))}
        </div>

        {/* Left — Text (vertically centered) */}
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
