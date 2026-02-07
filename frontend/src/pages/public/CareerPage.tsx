import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight, Send, CheckCircle } from 'lucide-react';
import { useCareersPage, useSubmitApplication } from '../../hooks/usePublicData';

export default function CareerPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useCareersPage();
  const submitApplication = useSubmitApplication();

  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const listings = data?.listings ?? [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Client-side file validation for UX
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
      await submitApplication.mutateAsync({ formData });
      setSubmitted(true);
    } catch {
      setFormError(t('career.form.submitError'));
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-linear-to-br from-gray-900 to-gray-800 text-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {t('career.hero.title')}
          </h1>
          <p className="text-xl text-gray-300">
            {t('career.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {t('career.openPositions')}
          </h2>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="space-y-4">
              {listings.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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
                      </div>
                    </div>
                    <Link
                      to={`/career/${job.slug}`}
                      className="mt-4 md:mt-0 inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {t('career.viewDetails')}
                      <ArrowRight className="ml-2" size={18} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">{t('career.noPositions')}</p>
          )}
        </div>
      </section>

      {/* Open Application Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('career.openApplication.title')}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {t('career.openApplication.description')}
            </p>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <CheckCircle size={48} className="mx-auto text-green-600 mb-4" />
                <h3 className="text-lg font-medium text-green-800 mb-2">
                  {t('career.form.successTitle')}
                </h3>
                <p className="text-green-600">{t('career.form.successMessage')}</p>
              </div>
            ) : !showApplicationForm ? (
              <button
                onClick={() => setShowApplicationForm(true)}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
              >
                {t('career.openApplication.button')}
                <ArrowRight className="ml-2" size={20} />
              </button>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="text-left bg-white p-8 rounded-lg shadow-sm">
                {formError && (
                  <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {formError}
                  </div>
                )}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('career.form.name')} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      maxLength={255}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('career.form.email')} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      maxLength={255}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('career.form.phone')} *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      maxLength={50}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('career.form.jobTitle')} *
                    </label>
                    <input
                      type="text"
                      name="job_title"
                      required
                      maxLength={255}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('career.form.cv')} *
                    </label>
                    <input
                      type="file"
                      name="cv"
                      required
                      accept=".pdf,application/pdf"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t('career.form.cvHint')}
                    </p>
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
      </section>
    </div>
  );
}
