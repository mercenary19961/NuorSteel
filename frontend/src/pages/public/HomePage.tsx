import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Recycle, Award } from 'lucide-react';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {t('home.hero.subtitle')}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors"
            >
              {t('home.hero.cta')}
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              {t('home.about.title')}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {t('home.about.description')}
            </p>
            <Link
              to="/about"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              {t('home.about.learnMore')}
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12">
            {t('home.features.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.features.quality.title')}</h3>
              <p className="text-gray-600">{t('home.features.quality.description')}</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.features.sustainability.title')}</h3>
              <p className="text-gray-600">{t('home.features.sustainability.description')}</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-yellow-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.features.certified.title')}</h3>
              <p className="text-gray-600">{t('home.features.certified.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('home.products.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('home.products.subtitle')}
            </p>
          </div>
          <div className="text-center">
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-md font-medium transition-colors"
            >
              {t('home.products.viewAll')}
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('home.cta.description')}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 rounded-md font-medium transition-colors"
          >
            {t('home.cta.button')}
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
