import { useTranslation } from 'react-i18next';
import { Factory, Cpu, Building2, FlaskConical, Wrench } from 'lucide-react';
import ScrollStack, { ScrollStackItem } from '@/Components/ui/scroll-stack';
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
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
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
            className="h-[50vh] mx-auto max-w-4xl w-[50%] p-8 lg:p-10 rounded-3xl bg-gray-800/95 backdrop-blur-sm border border-white/10 shadow-2xl shadow-black/30 flex items-center"
          >
            <div className="w-full">
              <div className="flex items-start gap-5">
                <div className="shrink-0 w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Icon className="text-primary" size={28} />
                </div>
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">
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
