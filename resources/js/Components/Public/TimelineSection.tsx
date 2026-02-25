import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';

export default function TimelineSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const events = [
    { year: t('about.timeline.events.0.year'), description: t('about.timeline.events.0.description') },
    { year: t('about.timeline.events.1.year'), description: t('about.timeline.events.1.description') },
    { year: t('about.timeline.events.2.year'), description: t('about.timeline.events.2.description') },
    { year: t('about.timeline.events.3.year'), description: t('about.timeline.events.3.description') },
    { year: t('about.timeline.events.4.year'), description: t('about.timeline.events.4.description') },
    { year: t('about.timeline.events.5.year'), description: t('about.timeline.events.5.description') },
  ];

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-linear-to-b from-gray-900 to-gray-950 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-12 lg:mb-16"
        >
          {t('about.timeline.title')}
        </motion.h2>

        {/* Horizontal scrollable on mobile, full width on desktop */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
          <div className="flex min-w-max lg:min-w-0 max-w-5xl mx-auto">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="flex flex-col items-center flex-1 min-w-35 lg:min-w-0 px-2 lg:px-1"
              >
                {/* Year label */}
                <span className="text-sm lg:text-base font-semibold text-white mb-3">
                  {event.year}
                </span>

                {/* Dot + connecting line */}
                <div className="relative w-full flex justify-center py-1.5">
                  {/* Left half of line */}
                  {index > 0 && (
                    <div className="absolute top-1/2 -translate-y-1/2 start-0 end-1/2 h-0.5 bg-white/20" />
                  )}
                  {/* Right half of line */}
                  {index < events.length - 1 && (
                    <div className="absolute top-1/2 -translate-y-1/2 start-1/2 end-0 h-0.5 bg-white/20" />
                  )}
                  {/* Dot */}
                  <div className="w-3 h-3 rounded-full bg-primary relative z-10 shrink-0" />
                </div>

                {/* Circular image placeholder */}
                <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden bg-gray-700 mt-5 mb-4 shrink-0 border-2 border-white/10 shadow-sm">
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                    </svg>
                  </div>
                </div>

                {/* Event description */}
                <p className="text-xs lg:text-sm text-white/60 leading-relaxed text-center max-w-35 lg:max-w-40">
                  {event.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
