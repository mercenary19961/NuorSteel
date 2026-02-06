import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MapPin, Clock, Calendar, Send, CheckCircle } from 'lucide-react';
import { usePublicCareer, useSubmitApplication } from '../../hooks/usePublicData';

export default function JobDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { data: job, isLoading, error } = usePublicCareer(slug);
  const submitApplication = useSubmitApplication();

  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    try {
      await submitApplication.mutateAsync({ slug, formData });
      setSubmitted(true);
    } catch {
      setFormError(t('career.form.submitError'));
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-6 max-w-3xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('career.notFound')}</h1>
        <Link to="/career" className="text-blue-600 hover:text-blue-700">
          {t('career.backToCareers')}
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link to="/career" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700">
            <ArrowLeft size={16} className="mr-1" />
            {t('career.backToCareers')}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Job Header */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{job.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-8">
            {job.location && (
              <span className="flex items-center">
                <MapPin size={16} className="mr-1" />
                {job.location}
              </span>
            )}
            <span className="flex items-center">
              <Clock size={16} className="mr-1" />
              {job.employment_type}
            </span>
            <span className="flex items-center">
              <Calendar size={16} className="mr-1" />
              {t('career.posted')} {new Date(job.created_at).toLocaleDateString()}
            </span>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('career.description')}</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('career.requirements')}</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.requirements}</p>
            </div>
          )}

          {/* Apply Section */}
          <div className="border-t border-gray-200 pt-8 mt-8">
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle size={48} className="mx-auto text-green-600 mb-4" />
                <h3 className="text-lg font-medium text-green-800 mb-2">{t('career.form.successTitle')}</h3>
                <p className="text-green-600">{t('career.form.successMessage')}</p>
              </div>
            ) : !showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
              >
                {t('career.applyNow')}
                <Send className="ml-2" size={18} />
              </button>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">{t('career.applyFor')} {job.title}</h3>
                {formError && (
                  <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {formError}
                  </div>
                )}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('career.form.name')} *</label>
                    <input type="text" name="name" required maxLength={255} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('career.form.email')} *</label>
                    <input type="email" name="email" required maxLength={255} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('career.form.phone')} *</label>
                    <input type="tel" name="phone" required maxLength={50} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('career.form.jobTitle')} *</label>
                    <input type="text" name="job_title" required maxLength={255} defaultValue={job.title} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('career.form.cv')} *</label>
                    <input type="file" name="cv" required accept=".pdf,application/pdf" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    <p className="text-xs text-gray-500 mt-1">{t('career.form.cvHint')}</p>
                  </div>
                  <button
                    type="submit"
                    disabled={submitApplication.isPending}
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md font-medium transition-colors"
                  >
                    {submitApplication.isPending ? t('career.form.submitting') : t('career.form.submit')}
                    <Send className="ml-2" size={18} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
