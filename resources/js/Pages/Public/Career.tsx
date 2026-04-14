import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Head, router } from '@inertiajs/react';
import {
  Briefcase, MapPin, Clock, Send, CheckCircle, X,
  ArrowRight, FileUp, UserPlus,
} from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { MagicCardGrid, MagicCard } from '@/Components/ui/magic-card';
import { useLanguage } from '@/contexts/LanguageContext';

interface CareerListItem {
  id: number;
  title: string;
  title_en: string;
  title_ar: string;
  slug: string;
  description: string;
  description_en: string;
  description_ar: string;
  requirements: string | null;
  requirements_en: string | null;
  requirements_ar: string | null;
  location: string | null;
  employment_type: string;
  expires_at: string | null;
  created_at: string;
}

interface Props {
  listings: CareerListItem[];
  content_en: Record<string, Record<string, string>>;
  content_ar: Record<string, Record<string, string>>;
}

export default function Career({ listings, content_en, content_ar }: Props) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const content = language === 'ar' ? content_ar : content_en;

  // Warm opposite-language hero image during idle time so the language
  // toggle is instant without hurting initial LCP.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const other = language === 'ar' ? 'en' : 'ar';
    const urls = [
      `/images/career/hero/hero-desktop-${other}.webp`,
      `/images/career/hero/hero-mobile-${other}.webp`,
    ];
    const preload = () => urls.forEach((src) => { const img = new Image(); img.src = src; });
    const hasIdle = 'requestIdleCallback' in window;
    const handle = hasIdle
      ? window.requestIdleCallback(preload, { timeout: 2000 })
      : window.setTimeout(preload, 1500);
    return () => {
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, [language]);

  const [selectedJob, setSelectedJob] = useState<CareerListItem | null>(null);
  const [showOpenApplication, setShowOpenApplication] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [processing, setProcessing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const getJobTitle = (job: CareerListItem) =>
    language === 'ar' ? (job.title_ar || job.title_en) : job.title_en;
  const getJobDescription = (job: CareerListItem) =>
    language === 'ar' ? (job.description_ar || job.description_en) : job.description_en;
  const getJobRequirements = (job: CareerListItem) =>
    language === 'ar' ? (job.requirements_ar || job.requirements_en) : job.requirements_en;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, slug?: string) => {
    e.preventDefault();
    setFormError('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    const cv = formData.get('cv') as File;
    if (!cv || cv.size === 0) {
      setFormError(t('career.form.cvRequired'));
      return;
    }
    if (cv.type !== 'application/pdf') {
      setFormError(t('career.form.cvPdfOnly'));
      return;
    }
    if (cv.size > 5 * 1024 * 1024) {
      setFormError(t('career.form.cvTooLarge'));
      return;
    }

    setProcessing(true);
    const url = slug ? `/career/${slug}/apply` : '/career/apply';
    router.post(url, formData as any, {
      forceFormData: true,
      onSuccess: () => setSubmitted(true),
      onError: () => setFormError(t('career.form.submitError')),
      onFinish: () => setProcessing(false),
    });
  };

  const closeModal = () => {
    setSelectedJob(null);
    setSubmitted(false);
    setFormError('');
  };

  const closeOpenApplication = () => {
    setShowOpenApplication(false);
    setSubmitted(false);
    setFormError('');
  };

  // Truncate description for card preview
  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max).trimEnd() + '...' : text;

  return (
    <PublicLayout>
      <Head title="Career" />

      {/* Hero Section — matches Quality page pattern */}
      <section className="relative h-screen bg-black text-white overflow-hidden flex items-center">
        <div className="absolute inset-0">
          <picture>
            <source media="(max-width: 639px)" srcSet={`/images/career/hero/hero-mobile-${language}.webp`} />
            <img
              key={`career-hero-${language}`}
              src={`/images/career/hero/hero-desktop-${language}.webp`}
              alt=""
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </picture>
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 pt-32 lg:pt-44 pb-16 lg:pb-24">
          <div className="max-w-2xl">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
              {t('career.hero.label', 'Careers')}
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6">
              {content?.overview?.title || t('career.hero.title')}
            </h1>
            <p className="text-lg lg:text-xl text-gray-400 max-w-lg leading-relaxed">
              {content?.overview?.description || t('career.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section className="relative bg-black text-white py-24 lg:py-32">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mb-16">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
              {t('career.hero.label', 'Careers')}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-6">
              {t('career.openPositions')}
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              {t('career.listingsSubtitle', 'Explore current opportunities and find your place at Nuor Steel.')}
            </p>
          </div>

          {listings.length > 0 ? (
            <MagicCardGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
              {listings.map((job) => (
                <MagicCard
                  key={job.id}
                  className="relative bg-white/5 border border-white/10 rounded-xl p-8 cursor-pointer group"
                >
                  <button
                    onClick={() => { setSelectedJob(job); setSubmitted(false); setFormError(''); }}
                    className="relative z-10 text-start w-full h-full flex flex-col cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-5">
                      <Briefcase className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {getJobTitle(job)}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-4">
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {t(`career.locations.${job.location}`, job.location)}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {t(`career.employmentType.${job.employment_type}`, job.employment_type)}
                      </span>
                    </div>
                    <p className="text-gray-400 leading-relaxed text-sm grow">
                      {truncate(getJobDescription(job), 150)}
                    </p>
                    <div className="mt-5 inline-flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                      {t('career.viewDetails')}
                      <ArrowRight size={16} className="ms-1 rtl:rotate-180" />
                    </div>
                  </button>
                </MagicCard>
              ))}
            </MagicCardGrid>
          ) : (
            <div className="text-center py-16 mb-16">
              <Briefcase size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">{t('career.noPositions')}</p>
            </div>
          )}

          {/* Open Application CTA */}
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-12 h-px bg-primary/50 mx-auto mb-8" />
            <div className="flex items-center justify-center gap-3 mb-4">
              <UserPlus size={24} className="text-primary" />
              <h3 className="text-xl lg:text-2xl font-bold">
                {content?.open_application?.title || t('career.openApplication.title')}
              </h3>
            </div>
            <p className="text-gray-400 leading-relaxed mb-8 max-w-xl mx-auto">
              {content?.open_application?.description || t('career.openApplication.description')}
            </p>
            <button
              onClick={() => { setShowOpenApplication(true); setSubmitted(false); setFormError(''); }}
              className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors cursor-pointer"
            >
              {t('career.openApplication.button')}
              <ArrowRight className="ms-2" size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative bg-gray-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl scrollbar-thin"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-white/10 px-6 py-4 flex items-start justify-between z-10">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-white">
                  {getJobTitle(selectedJob)}
                </h2>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-2">
                  {selectedJob.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {t(`career.locations.${selectedJob.location}`, selectedJob.location)}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {t(`career.employmentType.${selectedJob.employment_type}`, selectedJob.employment_type)}
                  </span>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors p-1 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
                  {t('career.description')}
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm">
                  {getJobDescription(selectedJob)}
                </p>
              </div>

              {/* Requirements */}
              {getJobRequirements(selectedJob) && (
                <div>
                  <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
                    {t('career.requirements')}
                  </h3>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm">
                    {getJobRequirements(selectedJob)}
                  </p>
                </div>
              )}

              {/* Application form */}
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FileUp size={20} className="text-primary" />
                  {t('career.applyFor')} {getJobTitle(selectedJob)}
                </h3>

                {submitted ? (
                  <div className="bg-green-950/30 border border-green-500/20 rounded-lg p-6 text-center">
                    <CheckCircle size={40} className="mx-auto text-green-400 mb-3" />
                    <h4 className="text-lg font-medium text-green-300 mb-1">
                      {t('career.form.successTitle')}
                    </h4>
                    <p className="text-green-400/80 text-sm">{t('career.form.successMessage')}</p>
                  </div>
                ) : (
                  <ApplicationForm
                    formRef={formRef}
                    formError={formError}
                    processing={processing}
                    defaultJobTitle={getJobTitle(selectedJob)}
                    onSubmit={(e) => handleSubmit(e, selectedJob.slug)}
                    t={t}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Open Application Modal */}
      {showOpenApplication && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeOpenApplication}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative bg-gray-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl scrollbar-thin"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-white/10 px-6 py-4 flex items-start justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {content?.open_application?.title || t('career.openApplication.title')}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {content?.open_application?.description || t('career.openApplication.description')}
                </p>
              </div>
              <button
                onClick={closeOpenApplication}
                className="text-gray-400 hover:text-white transition-colors p-1 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-6">
              {submitted ? (
                <div className="bg-green-950/30 border border-green-500/20 rounded-lg p-6 text-center">
                  <CheckCircle size={40} className="mx-auto text-green-400 mb-3" />
                  <h4 className="text-lg font-medium text-green-300 mb-1">
                    {t('career.form.successTitle')}
                  </h4>
                  <p className="text-green-400/80 text-sm">{t('career.form.successMessage')}</p>
                </div>
              ) : (
                <ApplicationForm
                  formRef={formRef}
                  formError={formError}
                  processing={processing}
                  onSubmit={(e) => handleSubmit(e)}
                  t={t}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}

/* ── Reusable Application Form ── */

interface ApplicationFormProps {
  formRef: React.RefObject<HTMLFormElement | null>;
  formError: string;
  processing: boolean;
  defaultJobTitle?: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  t: (key: string) => string;
}

function ApplicationForm({ formRef, formError, processing, defaultJobTitle, onSubmit, t }: ApplicationFormProps) {
  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
      {formError && (
        <div className="p-3 bg-red-950/30 border border-red-500/20 rounded-lg text-sm text-red-300">
          {formError}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {t('career.form.name')} *
        </label>
        <input
          type="text"
          name="name"
          required
          maxLength={255}
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {t('career.form.email')} *
        </label>
        <input
          type="email"
          name="email"
          required
          maxLength={255}
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {t('career.form.phone')} *
        </label>
        <input
          type="tel"
          name="phone"
          required
          maxLength={50}
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {t('career.form.jobTitle')} *
        </label>
        <input
          type="text"
          name="job_title"
          required
          maxLength={255}
          defaultValue={defaultJobTitle}
          readOnly={!!defaultJobTitle}
          className={`w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 ${defaultJobTitle ? 'opacity-60 cursor-not-allowed' : ''}`}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {t('career.form.cv')} *
        </label>
        <input
          type="file"
          name="cv"
          required
          accept=".pdf,application/pdf"
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-primary/20 file:text-primary file:text-xs file:font-medium file:cursor-pointer focus:outline-none focus:border-primary/50"
        />
        <p className="text-xs text-gray-500 mt-1">{t('career.form.cvHint')}</p>
      </div>
      <button
        type="submit"
        disabled={processing}
        className="w-full inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/40 text-white rounded-lg font-medium transition-colors cursor-pointer"
      >
        {processing ? t('career.form.submitting') : t('career.form.submit')}
        <Send className="ms-2" size={16} />
      </button>
    </form>
  );
}
