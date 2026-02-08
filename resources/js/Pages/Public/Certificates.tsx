import { useTranslation } from 'react-i18next';
import { Head } from '@inertiajs/react';
import { FileText, Download } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';

interface CertificateItem {
  id: number;
  title: string;
  description: string | null;
  file_url: string;
  thumbnail: string | null;
}

interface Props {
  esg: CertificateItem[];
  quality: CertificateItem[];
  governance: CertificateItem[];
}

function CertificateCard({ cert }: { cert: CertificateItem }) {
  return (
    <a
      href={cert.file_url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow flex items-start justify-between"
    >
      <div className="flex items-start">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
          {cert.thumbnail ? (
            <img src={cert.thumbnail} alt={cert.title} className="w-12 h-12 object-cover rounded-lg" />
          ) : (
            <FileText className="text-blue-600" size={24} />
          )}
        </div>
        <div className="ml-4">
          <h3 className="font-semibold text-gray-900">{cert.title}</h3>
          {cert.description && (
            <p className="text-sm text-gray-600 mt-1">{cert.description}</p>
          )}
        </div>
      </div>
      <Download size={20} className="text-gray-400 hover:text-blue-600 transition-colors shrink-0 ml-4" />
    </a>
  );
}

export default function Certificates({ esg, quality, governance }: Props) {
  const { t } = useTranslation();

  return (
    <PublicLayout>
      <Head title="Certificates" />

      {/* Hero Section */}
      <section className="bg-linear-to-br from-gray-900 to-gray-800 text-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {t('certificates.hero.title')}
          </h1>
          <p className="text-xl text-gray-300">
            {t('certificates.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* ESG Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {t('certificates.esg.title')}
          </h2>
          {esg.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {esg.map((cert) => (
                <CertificateCard key={cert.id} cert={cert} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">{t('certificates.empty')}</p>
          )}
        </div>
      </section>

      {/* Quality Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {t('certificates.quality.title')}
          </h2>
          {quality.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quality.map((cert) => (
                <CertificateCard key={cert.id} cert={cert} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">{t('certificates.empty')}</p>
          )}
        </div>
      </section>

      {/* Governance Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {t('certificates.governance.title')}
          </h2>
          {governance.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {governance.map((cert) => (
                <CertificateCard key={cert.id} cert={cert} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">{t('certificates.empty')}</p>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
