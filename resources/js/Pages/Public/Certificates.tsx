import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Leaf, ShieldCheck, FileText, ArrowLeft, Download, X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicLayout from '@/Layouts/PublicLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { MagicCard, MagicCardGrid } from '@/Components/ui/magic-card';

// --- Types ---
interface CertificateItem {
  id: number;
  title_en: string;
  title_ar: string;
  description_en: string | null;
  description_ar: string | null;
  file_url: string;
  thumbnail: string | null;
  issue_date: string | null;
  expiry_date: string | null;
}

type Category = 'esg' | 'quality' | 'governance';

interface Props {
  esg: CertificateItem[];
  quality: CertificateItem[];
  governance: CertificateItem[];
  content_en: Record<string, Record<string, string>>;
  content_ar: Record<string, Record<string, string>>;
}

// --- Category metadata ---
const categoryMeta: Record<Category, { icon: typeof Leaf; colorClass: string }> = {
  esg: { icon: Leaf, colorClass: 'text-white' },
  quality: { icon: ShieldCheck, colorClass: 'text-white' },
  governance: { icon: FileText, colorClass: 'text-white' },
};

export default function Certificates({ esg, quality, governance, content_en, content_ar }: Props) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const content = language === 'ar' ? content_ar : content_en;

  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [viewingCert, setViewingCert] = useState<CertificateItem | null>(null);

  // Helpers
  const getTitle = (c: CertificateItem) => language === 'ar' ? c.title_ar : c.title_en;
  const getDesc = (c: CertificateItem) => language === 'ar' ? c.description_ar : c.description_en;

  const categoryCerts: Record<Category, CertificateItem[]> = { esg, quality, governance };

  const categories: { key: Category; titleKey: string; descKey: string }[] = [
    { key: 'esg', titleKey: 'certificates.esg.title', descKey: 'certificates.esg.description' },
    { key: 'quality', titleKey: 'certificates.quality.title', descKey: 'certificates.quality.description' },
    { key: 'governance', titleKey: 'certificates.governance.title', descKey: 'certificates.governance.description' },
  ];

  const activeCategoryTitle = activeCategory
    ? (content?.[activeCategory]?.title || t(`certificates.${activeCategory}.title`))
    : '';

  return (
    <PublicLayout>
      <Head title={t('nav.certificates')} />

      {/* Category Cards / Certificate Grid */}
      <section className="relative bg-black text-white pt-32 lg:pt-44 pb-24 lg:pb-32 min-h-screen">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative container mx-auto px-4">
          <AnimatePresence mode="wait">
            {!activeCategory ? (
              /* --- Level 1: Category Cards --- */
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-3xl mb-16">
                  <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
                    {t('certificates.hero.label')}
                  </p>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-6">
                    {content?.overview?.title || t('certificates.hero.title')}
                  </h2>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    {content?.overview?.description || t('certificates.hero.subtitle')}
                  </p>
                </div>

                <MagicCardGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                  {categories.map(({ key, titleKey, descKey }) => {
                    const meta = categoryMeta[key];
                    const Icon = meta.icon;
                    const count = categoryCerts[key].length;

                    return (
                      <MagicCard key={key} className="relative bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setActiveCategory(key)}
                          className="w-full text-start p-8 lg:p-10 cursor-pointer group"
                        >
                          {/* Icon */}
                          <div className={`w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors`}>
                            <Icon size={28} className={meta.colorClass} />
                          </div>

                          {/* Title + Count */}
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl lg:text-2xl font-bold text-white group-hover:text-primary transition-colors">
                              {content?.[key]?.title || t(titleKey)}
                            </h3>
                            <span className="inline-flex items-center justify-center min-w-[7] h-7 rounded-full bg-primary/20 text-primary text-xs font-bold px-2">
                              {count}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-gray-400 leading-relaxed">
                            {content?.[key]?.description || t(descKey)}
                          </p>

                          {/* Arrow indicator */}
                          <div className="mt-6 flex items-center gap-2 text-sm text-primary/70 group-hover:text-primary transition-colors">
                            {t('certificates.viewCertificate')}
                            <ArrowLeft className="rtl:rotate-180 rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" size={14} />
                          </div>
                        </button>
                      </MagicCard>
                    );
                  })}
                </MagicCardGrid>
              </motion.div>
            ) : (
              /* --- Level 2: Certificate List --- */
              <motion.div
                key={`certs-${activeCategory}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Back button + breadcrumb */}
                <div className="flex items-center gap-3 mb-12">
                  <button
                    onClick={() => setActiveCategory(null)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 hover:bg-white/10 text-sm font-medium transition-all cursor-pointer group"
                  >
                    <ArrowLeft className="rtl:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" size={16} />
                    {t('certificates.backToCategories')}
                  </button>
                  <span className="text-white/30">/</span>
                  <span className="text-white font-medium">{activeCategoryTitle}</span>
                </div>

                {/* Category heading */}
                <div className="flex items-center gap-4 mb-10">
                  {(() => {
                    const meta = categoryMeta[activeCategory];
                    const Icon = meta.icon;
                    return (
                      <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center`}>
                        <Icon size={24} className={meta.colorClass} />
                      </div>
                    );
                  })()}
                  <h2 className="text-2xl lg:text-3xl font-bold">{activeCategoryTitle}</h2>
                </div>

                {/* Certificate cards grid */}
                {categoryCerts[activeCategory].length > 0 ? (
                  <MagicCardGrid className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6">
                    {categoryCerts[activeCategory].map((cert) => (
                      <MagicCard key={cert.id} className="relative bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setViewingCert(cert)}
                          className="w-full text-start cursor-pointer group"
                        >
                          {/* Thumbnail or placeholder */}
                          <div className="h-40 bg-white/2 flex items-center justify-center border-b border-white/5">
                            {cert.thumbnail ? (
                              <img
                                src={cert.thumbnail}
                                alt={getTitle(cert)}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex flex-col items-center gap-2">
                                <FileText size={36} className="text-white/15" />
                                <span className="text-[10px] uppercase tracking-widest text-white/20 font-medium">PDF</span>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            <h3 className="font-bold text-white text-sm leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                              {getTitle(cert)}
                            </h3>
                            {getDesc(cert) && (
                              <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-3">
                                {getDesc(cert)}
                              </p>
                            )}
                            {/* Dates */}
                            {(cert.issue_date || cert.expiry_date) && (
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500">
                                {cert.issue_date && (
                                  <span className="flex items-center gap-1">
                                    <Calendar size={10} />
                                    {t('certificates.issued')}: {cert.issue_date}
                                  </span>
                                )}
                                {cert.expiry_date && (
                                  <span className="flex items-center gap-1">
                                    <Calendar size={10} />
                                    {t('certificates.expires')}: {cert.expiry_date}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </button>
                      </MagicCard>
                    ))}
                  </MagicCardGrid>
                ) : (
                  <div className="text-center py-20">
                    <FileText size={48} className="text-white/10 mx-auto mb-4" />
                    <p className="text-gray-500">{t('certificates.noCertificates')}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* PDF Viewer Modal */}
      {viewingCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setViewingCert(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative bg-gray-900 border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gray-900/95 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <FileText size={20} className="text-primary shrink-0" />
                <h3 className="text-white font-semibold truncate">
                  {getTitle(viewingCert)}
                </h3>
              </div>
              <div className="flex items-center gap-3 shrink-0 ms-4">
                <a
                  href={viewingCert.file_url}
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-sm font-medium transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download size={16} />
                  {t('certificates.download')}
                </a>
                <button
                  onClick={() => setViewingCert(null)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* PDF iframe */}
            <div className="flex-1 min-h-0">
              <iframe
                src={viewingCert.file_url}
                className="w-full h-full min-h-[60vh]"
                title={getTitle(viewingCert)}
              />
            </div>
          </motion.div>
        </div>
      )}
    </PublicLayout>
  );
}
