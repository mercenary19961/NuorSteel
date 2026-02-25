import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { CalendarDays, Eye, Target, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface CardProps {
  icon: LucideIcon;
  title: string;
  highlight?: string;
  description: string;
  large?: boolean;
  index: number;
  fromRight?: boolean;
  sweepActive?: boolean;
}

function SweepText({
  children,
  active,
  offset = 0,
  fromColor,
  toColor = '#FF7A00',
}: {
  children: string;
  active: boolean;
  offset?: number;
  fromColor: string;
  toColor?: string;
}) {
  const charDelay = 0.025;
  return (
    <>
      {children.split('').map((char, i) => (
        <motion.span
          key={i}
          animate={active ? { color: [fromColor, toColor, fromColor] } : undefined}
          transition={active ? { duration: 0.4, delay: (offset + i) * charDelay, ease: 'easeInOut' } : undefined}
        >
          {char}
        </motion.span>
      ))}
    </>
  );
}

function VisionCard({ icon: Icon, title, highlight, description, large, index, fromRight, sweepActive }: CardProps) {
  const titleLen = title.length;
  const highlightLen = highlight?.length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: fromRight ? 60 : -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: 'easeOut' }}
      className={`group relative rounded-2xl border border-white/10 bg-gray-800/80 backdrop-blur-sm p-6 lg:p-8 flex flex-col ${
        large ? 'lg:col-span-1 lg:row-span-1' : ''
      }`}
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-5">
          <h3 className="text-lg lg:text-xl font-bold text-white">
            {sweepActive ? (
              <SweepText active offset={0} fromColor="#ffffff">{title}</SweepText>
            ) : title}
          </h3>
          <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 ms-3">
            <Icon className="text-primary" size={22} />
          </div>
        </div>

        {highlight && (
          <span className="text-3xl lg:text-4xl font-bold text-primary mb-3">
            {sweepActive ? (
              <SweepText active offset={titleLen} fromColor="#FF7A00" toColor="#ffffff">{highlight}</SweepText>
            ) : highlight}
          </span>
        )}

        <p className="text-sm lg:text-base text-white/60 leading-relaxed mt-auto">
          {sweepActive ? (
            <SweepText active offset={titleLen + highlightLen} fromColor="rgba(255,255,255,0.6)">{description}</SweepText>
          ) : description}
        </p>
      </div>
    </motion.div>
  );
}

const CHAR_DELAY = 0.025;
const ANIM_DURATION = 0.4;
const SWEEP_GAP = 400;

export default function VisionMissionSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeSweepCard, setActiveSweepCard] = useState(-1);

  const cards: CardProps[] = [
    {
      icon: CalendarDays,
      title: t('about.visionMission.established.title'),
      highlight: t('about.visionMission.established.year'),
      description: t('about.visionMission.established.description'),
      index: 0,
    },
    {
      icon: Eye,
      title: t('about.visionMission.vision.title'),
      description: t('about.visionMission.vision.description'),
      large: true,
      index: 1,
    },
    {
      icon: Target,
      title: t('about.visionMission.mission.title'),
      description: t('about.visionMission.mission.description'),
      large: true,
      fromRight: true,
      index: 2,
    },
    {
      icon: Users,
      title: t('about.visionMission.employees.title'),
      highlight: t('about.visionMission.employees.count'),
      description: t('about.visionMission.employees.description'),
      fromRight: true,
      index: 3,
    },
  ];

  const cardsRef = useRef(cards);
  cardsRef.current = cards;

  useEffect(() => {
    if (!isInView) return;

    const allEntranceMs = (0.6 + 3 * 0.12) * 1000;
    let timeoutId: number;
    let cancelled = false;

    const getSweepMs = (card: (typeof cards)[0]) => {
      const total = card.title.length + (card.highlight?.length ?? 0) + card.description.length;
      return ((total - 1) * CHAR_DELAY + ANIM_DURATION) * 1000;
    };

    const scheduleNext = (index: number) => {
      if (cancelled) return;
      setActiveSweepCard(index);
      const duration = getSweepMs(cardsRef.current[index]);
      timeoutId = window.setTimeout(() => {
        scheduleNext((index + 1) % cardsRef.current.length);
      }, duration + SWEEP_GAP);
    };

    timeoutId = window.setTimeout(() => scheduleNext(0), allEntranceMs + 1000);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [isInView]);

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-linear-to-b from-gray-800 to-gray-900 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-10 lg:mb-14"
        >
          {t('about.visionMission.title')}
        </motion.h2>

        {/* 4-column grid: small | large | large | small */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 max-w-6xl mx-auto lg:grid-rows-1 lg:auto-rows-fr">
          {/* Established — smaller */}
          <div className="lg:col-span-1">
            <VisionCard {...cards[0]} sweepActive={activeSweepCard === 0} />
          </div>
          {/* Vision — larger */}
          <div className="lg:col-span-1 lg:[&>div]:min-h-70">
            <VisionCard {...cards[1]} sweepActive={activeSweepCard === 1} />
          </div>
          {/* Mission — larger */}
          <div className="lg:col-span-1 lg:[&>div]:min-h-70">
            <VisionCard {...cards[2]} sweepActive={activeSweepCard === 2} />
          </div>
          {/* Employees — smaller */}
          <div className="lg:col-span-1">
            <VisionCard {...cards[3]} sweepActive={activeSweepCard === 3} />
          </div>
        </div>
      </div>
    </section>
  );
}
