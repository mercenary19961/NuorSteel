import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight, Send } from 'lucide-react';

export default function CareerPage() {
  const { t } = useTranslation();
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  // Placeholder jobs - will be loaded from API
  const jobs = [
    {
      id: 1,
      slug: 'senior-engineer',
      title: 'Senior Mechanical Engineer',
      location: 'Riyadh',
      type: 'Full-time',
      postedAt: '2026-02-01',
    },
    {
      id: 2,
      slug: 'quality-inspector',
      title: 'Quality Control Inspector',
      location: 'Riyadh',
      type: 'Full-time',
      postedAt: '2026-01-28',
    },
  ];

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

          {jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
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
                        <span className="flex items-center">
                          <MapPin size={16} className="mr-1" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <Clock size={16} className="mr-1" />
                          {job.type}
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

            {!showApplicationForm ? (
              <button
                onClick={() => setShowApplicationForm(true)}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
              >
                {t('career.openApplication.button')}
                <ArrowRight className="ml-2" size={20} />
              </button>
            ) : (
              <form className="text-left bg-white p-8 rounded-lg shadow-sm">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('career.form.name')} *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('career.form.email')} *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('career.form.phone')} *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('career.form.jobTitle')} *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('career.form.cv')} *
                    </label>
                    <input
                      type="file"
                      required
                      accept=".pdf"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t('career.form.cvHint')}
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
                  >
                    {t('career.form.submit')}
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
