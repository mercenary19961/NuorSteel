import { useTranslation } from 'react-i18next';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Recycle } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';

interface PageContent {
  [section: string]: {
    [key: string]: string;
  };
}

interface Props {
  content: PageContent | null;
}

export default function RecyclingPage({ content }: Props) {
  const { t } = useTranslation();

  return (
    <PublicLayout>
      <Head title="Recycling" />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link href="/about" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700">
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
            {content ? (
              <div className="prose prose-lg prose-gray max-w-none">
                {Object.entries(content).map(([section, keys]) => (
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
    </PublicLayout>
  );
}
