import { useTranslation } from 'react-i18next';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-linear-to-br from-gray-900 to-gray-800 text-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {t('about.hero.title')}
          </h1>
          <p className="text-xl text-gray-300">
            {t('about.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('about.overview.title')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('about.overview.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('about.vision.title')}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t('about.vision.description')}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('about.mission.title')}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t('about.mission.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {t('about.timeline.title')}
          </h2>
          <div className="max-w-3xl mx-auto">
            {/* Timeline items will be loaded from API */}
            <p className="text-center text-gray-500">
              {t('about.timeline.loading')}
            </p>
          </div>
        </div>
      </section>

      {/* Governance */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('about.governance.title')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('about.governance.description')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
