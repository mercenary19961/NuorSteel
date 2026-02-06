import { useTranslation } from 'react-i18next';
import { Shield, CheckCircle, Award } from 'lucide-react';

export default function QualityPage() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-linear-to-br from-gray-900 to-gray-800 text-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {t('quality.hero.title')}
          </h1>
          <p className="text-xl text-gray-300">
            {t('quality.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('quality.overview.title')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('quality.overview.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {t('quality.standards.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('quality.standards.iso.title')}</h3>
              <p className="text-gray-600">{t('quality.standards.iso.description')}</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('quality.standards.testing.title')}</h3>
              <p className="text-gray-600">{t('quality.standards.testing.description')}</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-yellow-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('quality.standards.calibration.title')}</h3>
              <p className="text-gray-600">{t('quality.standards.calibration.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('quality.certifications.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('quality.certifications.description')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
