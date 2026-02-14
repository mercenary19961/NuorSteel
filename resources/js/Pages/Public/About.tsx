import { useTranslation } from 'react-i18next';
import { Head } from '@inertiajs/react';
import { Download } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';

interface Props {
  timeline: { id: number; year: string; title: string; description: string | null; image: string | null }[];
  governance: { id: number; title: string; file_url: string }[];
  content: Record<string, Record<string, string>>;
}

export default function About({ timeline, governance, content }: Props) {
  const { t } = useTranslation();

  return (
    <PublicLayout>
      <Head title="About Us" />

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
              {content?.overview?.title || t('about.overview.title')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {content?.overview?.description || t('about.overview.description')}
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
                {content?.vision?.title || t('about.vision.title')}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {content?.vision?.description || t('about.vision.description')}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {content?.mission?.title || t('about.mission.title')}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {content?.mission?.description || t('about.mission.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {content?.timeline?.title || t('about.timeline.title')}
          </h2>
          <div className="max-w-3xl mx-auto">
            {timeline.length > 0 ? (
              <div className="relative">
                <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-gray-200" />
                {timeline.map((event, index) => (
                  <div key={event.id} className={`relative flex items-center mb-12 last:mb-0 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                        {event.image && (
                          <img src={event.image} alt={event.title} className="w-full h-32 object-cover rounded mb-3" />
                        )}
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        {event.description && (
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold z-10">
                      {event.year}
                    </div>
                    <div className="w-5/12" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">{t('about.timeline.empty')}</p>
            )}
          </div>
        </div>
      </section>

      {/* Governance */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {content?.governance?.title || t('about.governance.title')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {content?.governance?.description || t('about.governance.description')}
            </p>
            {governance.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {governance.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <Download size={20} className="text-blue-600 shrink-0" />
                    <span className="font-medium text-gray-900">{doc.title}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
