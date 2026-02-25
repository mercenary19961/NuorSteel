import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Factory, Cpu, Building2, FlaskConical, Wrench } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
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

function MobileCard({ icon: Icon, translationKey }: { icon: LucideIcon; translationKey: string }) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="p-6 rounded-2xl bg-gray-800/95 border border-white/10 shadow-xl shadow-black/20"
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
          <Icon className="text-primary" size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-2">
            {t(`about.capabilities.${translationKey}.title`)}
          </h3>
          <p className="text-sm text-white/70 leading-relaxed">
            {t(`about.capabilities.${translationKey}.description`)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function CapabilitiesSection() {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  if (!isDesktop) {
    return (
      <section id="section-capabilities" className="bg-linear-to-b from-gray-800 to-gray-900 py-16 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              {t('about.capabilities.title')}
            </h2>
            <p className="text-base text-white/60">
              {t('about.capabilities.subtitle')}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {capabilities.map(({ icon, key }) => (
              <MobileCard key={key} icon={icon} translationKey={key} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="section-capabilities" className="bg-linear-to-b from-gray-800 to-gray-900">
      <ScrollStack
        useWindowScroll
        itemStackDistance={25}
        stackPosition="5%"
        baseScale={0.88}
        itemScale={0.025}
        scrollPerCard={80}
      >
        {/* Heading centered in viewport — cards slide up and cover it */}
        <div className="absolute inset-0 flex items-center justify-center text-center px-4 z-0">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">
              {t('about.capabilities.title')}
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              {t('about.capabilities.subtitle')}
            </p>
          </div>
        </div>
        {capabilities.map(({ icon: Icon, key }) => (
          <ScrollStackItem
            key={key}
            className="h-[50vh] mx-auto max-w-4xl w-[50%] p-10 rounded-3xl bg-gray-800/95 backdrop-blur-sm border border-white/10 shadow-2xl shadow-black/30 flex items-center"
          >
            <div className="w-full">
              <div className="flex items-start gap-5">
                <div className="shrink-0 w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Icon className="text-primary" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {t(`about.capabilities.${key}.title`)}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
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
