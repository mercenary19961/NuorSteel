import { useTranslation } from 'react-i18next';
import { Head } from '@inertiajs/react';
import { Gauge, FlaskConical, Ruler, Flame, ShieldCheck, FileCheck } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { MagicCardGrid, MagicCard } from '@/Components/ui/magic-card';

export default function Quality() {
  const { t } = useTranslation();

  return (
    <PublicLayout>
      <Head title="Quality" />

      {/* Hero Section */}
      <section className="relative h-screen bg-gray-950 text-white overflow-hidden flex items-center">
        {/* Background gradient + decorative shape */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-linear-to-br from-gray-950 via-gray-900 to-gray-950" />
          {/* Diagonal geometric shape on the right — placeholder for future image */}
          <div
            className="absolute top-0 right-0 w-1/2 h-full hidden lg:block"
            style={{
              clipPath: 'polygon(25% 0, 100% 0, 100% 100%, 0% 100%)',
            }}
          >
            <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-primary/10 to-gray-900/80" />
            <div className="absolute inset-0 bg-linear-to-t from-gray-950/60 to-transparent" />
          </div>
          {/* Subtle accent line */}
          <div
            className="absolute top-0 bottom-0 hidden lg:block w-px bg-primary/30"
            style={{ left: '62.5%', transform: 'skewX(-12deg)' }}
          />
        </div>

        <div className="relative container mx-auto px-4 pt-32 lg:pt-44 pb-16 lg:pb-24">
          <div className="max-w-2xl">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
              {t('quality.hero.label', 'Quality Assurance')}
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              {t('quality.hero.title')}
            </h1>
            <p className="text-lg lg:text-xl text-gray-400 max-w-lg leading-relaxed">
              {t('quality.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Quality & Manufacturing Assurance */}
      <section className="bg-linear-to-b from-gray-950 to-gray-900 text-white py-24 lg:py-32">
        <div className="container mx-auto px-4">
          {/* Section intro */}
          <div className="max-w-3xl mb-20">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
              {t('quality.assurance.label', 'Our Approach')}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-8">
              {t('quality.assurance.title', 'Quality & Manufacturing Assurance')}
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              {t('quality.assurance.intro1', 'At Nuor Steel, quality is engineered into every stage of production, from raw material selection to final bar inspection. Our manufacturing process operates under controlled parameters to ensure consistency, compliance, and structural reliability across every delivery.')}
            </p>
            <p className="text-gray-400 leading-relaxed italic border-s-2 border-primary/50 ps-4">
              {t('quality.assurance.intro2', 'We follow a preventive quality philosophy: defects are not detected after production; they are designed out of the process.')}
            </p>
          </div>

          {/* Process cards */}
          <MagicCardGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
            {[
              {
                icon: Gauge,
                title: t('quality.assurance.processControl.title', 'Process Control'),
                description: t('quality.assurance.processControl.description', 'Each billet and rebar is produced through monitored rolling and cooling parameters to maintain uniform mechanical performance and dimensional accuracy across all batches.'),
              },
              {
                icon: FlaskConical,
                title: t('quality.assurance.labTesting.title', 'Laboratory Testing'),
                description: t('quality.assurance.labTesting.description', 'Samples are continuously tested for mechanical and chemical properties including yield strength, tensile strength, elongation, and bend performance to verify compliance with applicable standards.'),
              },
              {
                icon: Ruler,
                title: t('quality.assurance.dimensionalPrecision.title', 'Dimensional Precision'),
                description: t('quality.assurance.dimensionalPrecision.description', 'Bars are manufactured with consistent rib geometry and roundness to guarantee proper concrete bonding and structural stability.'),
              },
              {
                icon: Flame,
                title: t('quality.assurance.weldingWorkability.title', 'Welding & Workability Verification'),
                description: t('quality.assurance.weldingWorkability.description', 'Products are validated for bending and welding performance to ensure safe on-site fabrication without compromising material integrity.'),
              },
              {
                icon: ShieldCheck,
                title: t('quality.assurance.durability.title', 'Durability Performance'),
                description: t('quality.assurance.durability.description', 'Controlled chemical composition and surface quality support resistance to environmental exposure and long-term structural performance.'),
              },
              {
                icon: FileCheck,
                title: t('quality.assurance.commitment.title', 'Quality Commitment'),
                description: t('quality.assurance.commitment.description', 'Every shipment is traceable and documented.'),
              },
            ].map((card, i) => (
              <MagicCard
                key={i}
                className="relative bg-white/5 border border-white/10 rounded-xl p-8"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                    <card.icon className="text-primary" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">{card.description}</p>
                </div>
              </MagicCard>
            ))}
          </MagicCardGrid>

          {/* Closing statement */}
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-12 h-px bg-primary/50 mx-auto mb-8" />
            <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">
              {t('quality.assurance.closing', 'Our objective is not only to meet standards but to provide contractors and consultants with confidence that the material will perform as designed throughout the life of the structure.')}
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
