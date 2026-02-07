import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, Recycle } from 'lucide-react';
import { useRecyclingPage } from '../../hooks/usePublicData';

export default function RecyclingPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useRecyclingPage();

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link to="/about" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700">
            <ArrowLeft size={16} className="mr-1" />
            {t('recycling.backToAbout')}
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-linear-to-br from-green-900 to-green-800 text-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">
              <Recycle size={28} />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold">
              {t('recycling.hero.title')}
            </h1>
          </div>
          <p className="text-xl text-green-200">
            {t('recycling.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            ) : data?.content ? (
              <div className="prose prose-lg prose-gray max-w-none">
                {Object.entries(data.content).map(([section, keys]) => (
                  <div key={section} className="mb-8">
                    {Object.entries(keys).map(([key, value]) => {
                      if (key.includes('title')) {
                        return <h2 key={key} className="text-2xl font-bold text-gray-900 mb-4">{value}</h2>;
                      }
                      return <p key={key} className="text-gray-600 leading-relaxed">{value}</p>;
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Recycle size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">{t('recycling.comingSoon')}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
