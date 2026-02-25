import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import CapabilitiesSection from '@/Components/Public/CapabilitiesSection';
import VisionMissionSection from '@/Components/Public/VisionMissionSection';
import TimelineSection from '@/Components/Public/TimelineSection';
import { TimelineContent } from '@/Components/ui/timeline-animation';

export default function About() {
  const { t } = useTranslation();
  const introRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: { delay: i * 1.5, duration: 0.7 },
    }),
    hidden: {
      filter: 'blur(10px)',
      y: 40,
      opacity: 0,
    },
  };

  const textVariants = {
    visible: (i: number) => ({
      filter: 'blur(0px)',
      opacity: 1,
      transition: { delay: i * 0.3, duration: 0.7 },
    }),
    hidden: {
      filter: 'blur(10px)',
      opacity: 0,
    },
  };

  return (
    <PublicLayout>
      <Head title="About Us" />

      {/* SEO h1 — visually hidden */}
      <h1 className="sr-only">{t('about.hero.title')}</h1>

      {/* About Intro — animated large text with highlighted keywords */}
      <section className="bg-linear-to-br from-gray-900 to-gray-800 text-white pt-32 lg:pt-44 pb-20 lg:pb-32">
        <div className="max-w-6xl mx-auto px-4" ref={introRef}>
          <TimelineContent
            as="p"
            animationNum={0}
            timelineRef={introRef}
            customVariants={revealVariants}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[120%]! font-semibold text-white"
          >
            {t('about.intro.segment1')}{' '}
            <TimelineContent
              as="span"
              animationNum={1}
              timelineRef={introRef}
              customVariants={textVariants}
              className="text-primary border-2 border-primary/50 inline-block border-dotted px-2 rounded-md"
            >
              {t('about.intro.highlight1')}
            </TimelineContent>{' '}
            {t('about.intro.segment2')}{' '}
            <TimelineContent
              as="span"
              animationNum={2}
              timelineRef={introRef}
              customVariants={textVariants}
              className="text-sky-400 border-2 border-sky-400/50 inline-block border-dotted px-2 rounded-md"
            >
              {t('about.intro.highlight2')}
            </TimelineContent>{' '}
            {t('about.intro.segment3')}{' '}
            <TimelineContent
              as="span"
              animationNum={3}
              timelineRef={introRef}
              customVariants={textVariants}
              className="text-emerald-400 border-2 border-emerald-400/50 inline-block border-dotted px-2 rounded-md"
            >
              {t('about.intro.highlight3')}
            </TimelineContent>
          </TimelineContent>
        </div>
      </section>

      {/* Vision & Mission */}
      <VisionMissionSection />

      {/* Capabilities */}
      <CapabilitiesSection />

      {/* Timeline */}
      <TimelineSection />
    </PublicLayout>
  );
}
