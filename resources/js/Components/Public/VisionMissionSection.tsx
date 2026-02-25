import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
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
}

function VisionCard({ icon: Icon, title, highlight, description, large, index, fromRight }: CardProps) {
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
            {title}
          </h3>
          <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 ms-3">
            <Icon className="text-primary" size={22} />
          </div>
        </div>

        {highlight && (
          <span className="text-3xl lg:text-4xl font-bold text-primary mb-3">
            {highlight}
          </span>
        )}

        <p className="text-sm lg:text-base text-white/60 leading-relaxed mt-auto">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export default function VisionMissionSection() {
  const { t } = useTranslation();

  const cards: (CardProps & { key: string })[] = [
    {
      key: 'established',
      icon: CalendarDays,
      title: t('about.visionMission.established.title'),
      highlight: t('about.visionMission.established.year'),
      description: t('about.visionMission.established.description'),
      index: 0,
    },
    {
      key: 'vision',
      icon: Eye,
      title: t('about.visionMission.vision.title'),
      description: t('about.visionMission.vision.description'),
      large: true,
      index: 1,
    },
    {
      key: 'mission',
      icon: Target,
      title: t('about.visionMission.mission.title'),
      description: t('about.visionMission.mission.description'),
      large: true,
      fromRight: true,
      index: 2,
    },
    {
      key: 'employees',
      icon: Users,
      title: t('about.visionMission.employees.title'),
      highlight: t('about.visionMission.employees.count'),
      description: t('about.visionMission.employees.description'),
      fromRight: true,
      index: 3,
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-linear-to-b from-gray-800 to-gray-900 overflow-hidden">
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
            <VisionCard {...cards[0]} />
          </div>
          {/* Vision — larger */}
          <div className="lg:col-span-1 lg:[&>div]:min-h-[280px]">
            <VisionCard {...cards[1]} />
          </div>
          {/* Mission — larger */}
          <div className="lg:col-span-1 lg:[&>div]:min-h-[280px]">
            <VisionCard {...cards[2]} />
          </div>
          {/* Employees — smaller */}
          <div className="lg:col-span-1">
            <VisionCard {...cards[3]} />
          </div>
        </div>
      </div>
    </section>
  );
}
