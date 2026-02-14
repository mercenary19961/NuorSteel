import { useTranslation } from 'react-i18next';
import { Head } from '@inertiajs/react';
import { Shield, CheckCircle, Award, Download } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';

interface CertificateItem {
  id: number;
  title: string;
  description: string | null;
  file_url: string;
  thumbnail: string | null;
  issue_date: string | null;
  expiry_date: string | null;
}

interface Props {
  certificates: CertificateItem[];
  content: Record<string, Record<string, string>>;
}

export default function Quality({ certificates, content }: Props) {
  const { t } = useTranslation();

  return (
    <PublicLayout>
      <Head title="Quality" />

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
              {content?.overview?.title || t('quality.overview.title')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {content?.overview?.description || t('quality.overview.description')}
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
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              {content?.certifications?.title || t('quality.certifications.title')}
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12">
              {content?.certifications?.description || t('quality.certifications.description')}
            </p>
            {certificates.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <a
                    key={cert.id}
                    href={cert.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {cert.thumbnail ? (
                      <img src={cert.thumbnail} alt={cert.title} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center shrink-0">
                        <Download className="text-primary" size={20} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{cert.title}</h3>
                      {cert.description && (
                        <p className="text-sm text-gray-500 truncate">{cert.description}</p>
                      )}
                    </div>
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
