import { useTranslation } from 'react-i18next';
import { FileText, Download } from 'lucide-react';

export default function CertificatesPage() {
  const { t } = useTranslation();

  // Placeholder certificates - will be loaded from API
  const certificateGroups = {
    esg: [
      { id: 1, title: 'EPD Certificate', description: 'Environmental Product Declaration' },
      { id: 2, title: 'HPD Certificate', description: 'Health Product Declaration' },
      { id: 3, title: 'ISO 14001', description: 'Environmental Management System' },
      { id: 4, title: 'ISO 45001', description: 'Occupational Health & Safety' },
    ],
    quality: [
      { id: 5, title: 'ISO 9001', description: 'Quality Management System' },
      { id: 6, title: 'MTC File', description: 'Mill Test Certificate' },
      { id: 7, title: 'SASO Test', description: 'Saudi Standards Compliance' },
    ],
    governance: [
      { id: 8, title: 'Integrated Policy', description: 'Company Integrated Policy Document' },
      { id: 9, title: 'Code of Conduct', description: 'Business Ethics Guidelines' },
    ],
  };

  const CertificateCard = ({ cert }: { cert: { id: number; title: string; description: string } }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="text-blue-600" size={24} />
          </div>
          <div className="ml-4">
            <h3 className="font-semibold text-gray-900">{cert.title}</h3>
            <p className="text-sm text-gray-600">{cert.description}</p>
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
          <Download size={20} />
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 lg:py-24">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificateGroups.esg.map((cert) => (
              <CertificateCard key={cert.id} cert={cert} />
            ))}
          </div>
        </div>
      </section>

      {/* Quality Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {t('certificates.quality.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificateGroups.quality.map((cert) => (
              <CertificateCard key={cert.id} cert={cert} />
            ))}
          </div>
        </div>
      </section>

      {/* Governance Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {t('certificates.governance.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificateGroups.governance.map((cert) => (
              <CertificateCard key={cert.id} cert={cert} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
