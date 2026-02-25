import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Factory, Cpu, Building2, FlaskConical, Wrench } from 'lucide-react';
import ScrollStack, { ScrollStackItem } from '@/Components/ui/scroll-stack';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { LucideIcon } from 'lucide-react';

const capabilities: { icon: LucideIcon; key: string }[] = [
  { icon: Factory, key: 'integratedManufacturing' },
  { icon: Cpu, key: 'advancedTechnology' },
  { icon: Building2, key: 'largeScaleSupply' },
  { icon: FlaskConical, key: 'qualityAssurance' },
  { icon: Wrench, key: 'customization' },
];

export default function CapabilitiesSection() {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const headingRef = useRef<HTMLDivElement>(null);

  // Fade heading out as user scrolls into the section (first card covers it)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const section = document.getElementById('section-capabilities');
    if (!section) return;

    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const heading = headingRef.current;
        if (!heading) { rafId = null; return; }

        const scrollIntoSection = -(section.getBoundingClientRect().top);
        const fadeEnd = window.innerHeight * 0.35;

        const opacity = scrollIntoSection <= 0 ? 1
          : scrollIntoSection >= fadeEnd ? 0
          : 1 - scrollIntoSection / fadeEnd;

        heading.style.opacity = String(Math.max(0, Math.min(1, opacity)));
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section id="section-capabilities" className="bg-linear-to-b from-gray-800 to-gray-900">
      <ScrollStack
        useWindowScroll
        itemStackDistance={isDesktop ? 45 : 30}
        stackPosition={isDesktop ? '5%' : '12%'}
        baseScale={isDesktop ? 0.88 : 0.92}
        itemScale={isDesktop ? 0.025 : 0.015}
        scrollPerCard={isDesktop ? 80 : 50}
      >
        {/* Heading centered in viewport — fades out as first card enters */}
        <div
          ref={headingRef}
          className="absolute inset-0 flex items-center justify-center text-center px-4 z-0 transition-opacity duration-100"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 lg:mb-4">
              {t('about.capabilities.title')}
            </h2>
            <p className="text-base lg:text-lg text-white/60 max-w-2xl mx-auto">
              {t('about.capabilities.subtitle')}
            </p>
          </div>
        </div>
        {capabilities.map(({ icon: Icon, key }) => (
          <ScrollStackItem
            key={key}
            className="min-h-[55vh] lg:min-h-[50vh] mx-auto max-w-4xl w-[92%] lg:w-[50%] p-6 lg:p-10 rounded-2xl lg:rounded-3xl bg-gray-800 lg:bg-gray-800/95 backdrop-blur-sm border border-white/10 shadow-2xl shadow-black/30 flex items-center"
          >
            <div className="w-full">
              <div className="flex items-start gap-4 lg:gap-5">
                <div className="shrink-0 w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Icon className="text-primary" size={isDesktop ? 28 : 24} />
                </div>
                <div>
                  <h3 className="text-lg lg:text-2xl font-bold text-white mb-2 lg:mb-3">
                    {t(`about.capabilities.${key}.title`)}
                  </h3>
                  <p className="text-sm lg:text-base text-white/70 leading-relaxed">
                    {t(`about.capabilities.${key}.description`)}
                  </p>
                </div>
              </div>
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
}
