import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, HardHat, Scale, FileText, Eye, X } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';

type TabKey = 'environment' | 'safety' | 'governance';

type Doc = { key: string; pdf: string };

const DOCS: Record<Exclude<TabKey, 'governance'>, Doc[]> = {
  environment: [
    { key: 'iso14001', pdf: '/documents/sustainability/iso-14001.pdf' },
    { key: 'ncec',     pdf: '/documents/sustainability/ncec.pdf' },
    { key: 'epd',      pdf: '/documents/sustainability/epd.pdf' },
  ],
  safety: [
    { key: 'iso45001', pdf: '/documents/sustainability/iso-45001.pdf' },
    { key: 'hpd',      pdf: '/documents/sustainability/hpd.pdf' },
  ],
};

const TABS: { key: TabKey; icon: typeof Leaf }[] = [
  { key: 'environment', icon: Leaf },
  { key: 'safety',      icon: HardHat },
  { key: 'governance',  icon: Scale },
];

export default function Sustainability() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>('environment');
  const [viewingPdf, setViewingPdf] = useState<Doc | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (viewingPdf) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [viewingPdf]);

  return (
    <PublicLayout>
      <Head title="Sustainability" />

      {/* Hero */}
      <section className="relative bg-surface text-white pt-36 pb-16 lg:pt-44 lg:pb-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
              {t('sustainability.hero.label')}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-5">
              {t('sustainability.hero.title')}
            </h1>
            <p className="text-base lg:text-lg text-gray-300 leading-relaxed">
              {t('sustainability.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Tabs + Content */}
      <section className="relative bg-surface text-white pb-24 lg:pb-32">
        <div className="container mx-auto px-4">
          {/* Pill tab selector */}
          <div className="flex justify-center mb-10 lg:mb-14">
            <div
              role="tablist"
              aria-label={t('sustainability.tabsLabel', { defaultValue: 'Sustainability sections' })}
              className="relative inline-flex items-center gap-1 p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              {TABS.map(({ key, icon: Icon }) => {
                const active = activeTab === key;
                return (
                  <button
                    key={key}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveTab(key)}
                    className={`relative z-10 inline-flex items-center gap-2 px-5 lg:px-7 py-2.5 rounded-full text-sm lg:text-base font-semibold transition-colors duration-200 ${
                      active ? 'text-white' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="tab-pill"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        className="absolute inset-0 rounded-full bg-primary shadow-lg shadow-primary/30"
                      />
                    )}
                    <Icon size={16} className="relative z-10" />
                    <span className="relative z-10 whitespace-nowrap">
                      {t(`sustainability.tabs.${key}`)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {/* Section heading */}
              <div className="max-w-3xl mx-auto text-center mb-10 lg:mb-14">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4">
                  {t(`sustainability.sections.${activeTab}.title`)}
                </h2>
                <p className="text-base lg:text-lg text-gray-300 leading-relaxed">
                  {t(`sustainability.sections.${activeTab}.subtitle`)}
                </p>
              </div>

              {activeTab === 'governance' ? (
                <GovernancePlaceholder />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                  {DOCS[activeTab].map((doc) => (
                    <DocCard key={doc.key} doc={doc} onView={() => setViewingPdf(doc)} />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* PDF Viewer Modal */}
      <AnimatePresence>
        {viewingPdf && (
          <motion.div
            key="pdf-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setViewingPdf(null)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative bg-gray-900 border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gray-900/95 backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText size={20} className="text-primary shrink-0" />
                  <h3 className="text-white font-semibold truncate">
                    {t(`sustainability.docs.${viewingPdf.key}.title`)}
                  </h3>
                </div>
                <button
                  onClick={() => setViewingPdf(null)}
                  aria-label="Close"
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0 ms-4"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 min-h-0">
                <iframe
                  src={viewingPdf.pdf}
                  className="w-full h-full min-h-[60vh] border-0"
                  title={t(`sustainability.docs.${viewingPdf.key}.title`)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PublicLayout>
  );
}

function DocCard({ doc, onView }: { doc: Doc; onView: () => void }) {
  const { t } = useTranslation();
  return (
    <button
      onClick={onView}
      aria-label={t('sustainability.viewPdf')}
      className="group text-start bg-white/5 border border-white/10 hover:border-primary/40 rounded-2xl overflow-hidden transition-colors"
    >
      <div className="relative aspect-3/4 w-full bg-white overflow-hidden">
        <iframe
          src={`${doc.pdf}#toolbar=0&navpanes=0&scrollbar=0&view=Fit&page=1`}
          className="absolute top-0 left-0 w-[200%] h-[200%] origin-top-left scale-50 pointer-events-none border-0"
          title={t(`sustainability.docs.${doc.key}.title`)}
          tabIndex={-1}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors duration-300 flex items-center justify-center pointer-events-none">
          <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2 shadow-lg">
            <Eye size={15} />
            {t('sustainability.viewPdf')}
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold mb-2">
          {t(`sustainability.docs.${doc.key}.title`)}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          {t(`sustainability.docs.${doc.key}.description`)}
        </p>
      </div>
    </button>
  );
}

function GovernancePlaceholder() {
  const { t } = useTranslation();
  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative bg-white/5 border border-white/10 rounded-2xl p-10 lg:p-14 text-center overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.12),transparent_70%)] pointer-events-none"
        />
        <div className="relative">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <Scale size={36} className="text-primary" />
          </div>
          <h3 className="text-2xl lg:text-3xl font-black mb-4">
            {t('sustainability.sections.governance.comingSoonTitle')}
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {t('sustainability.sections.governance.comingSoonBody')}
          </p>
        </div>
      </div>
    </div>
  );
}
