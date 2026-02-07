import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Head, router } from '@inertiajs/react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';

const requestTypes = [
  { value: 'vendor', labelKey: 'contact.types.vendor' },
  { value: 'partnership', labelKey: 'contact.types.partnership' },
  { value: 'careers', labelKey: 'contact.types.careers' },
  { value: 'sustainability', labelKey: 'contact.types.sustainability' },
  { value: 'general', labelKey: 'contact.types.general' },
  { value: 'quotation', labelKey: 'contact.types.quotation' },
];

interface Props {
  settings: { phone: string | null; email: string | null; address: string | null };
}

export default function Contact({ settings }: Props) {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [processing, setProcessing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    const file = formData.get('file') as File;
    if (file && file.size > 0) {
      if (file.type !== 'application/pdf') {
        setFormError(t('contact.form.filePdfOnly'));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFormError(t('contact.form.fileTooLarge'));
        return;
      }
    }

    setProcessing(true);
    router.post('/contact', formData as unknown as Record<string, unknown>, {
      forceFormData: true,
      onSuccess: () => setSubmitted(true),
      onError: () => setFormError(t('contact.form.submitError')),
      onFinish: () => setProcessing(false),
    });
  };

  return (
    <PublicLayout>
      <Head title="Contact" />

      {/* Hero Section */}
      <section className="bg-linear-to-br from-gray-900 to-gray-800 text-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {t('contact.hero.title')}
          </h1>
          <p className="text-xl text-gray-300">
            {t('contact.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('contact.info.title')}
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="text-blue-600" size={20} />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">{t('contact.info.address')}</h3>
                    <p className="text-gray-600">{settings?.address || 'Riyadh, Saudi Arabia'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="text-blue-600" size={20} />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">{t('contact.info.phone')}</h3>
                    <p className="text-gray-600">{settings?.phone || ''}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="text-blue-600" size={20} />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">{t('contact.info.email')}</h3>
                    <p className="text-gray-600">{settings?.email || 'info@nuorsteel.com'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('contact.form.title')}
              </h2>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle size={48} className="mx-auto text-green-600 mb-4" />
                  <h3 className="text-lg font-medium text-green-800 mb-2">
                    {t('contact.form.successTitle')}
                  </h3>
                  <p className="text-green-600">
                    {t('contact.form.successMessage')}
                  </p>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  {formError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                      {formError}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('contact.form.name')} *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        maxLength={255}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('contact.form.company')} *
                      </label>
                      <input
                        type="text"
                        name="company"
                        required
                        maxLength={255}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('contact.form.email')} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        maxLength={255}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('contact.form.phone')} *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        maxLength={50}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('contact.form.country')} *
                      </label>
                      <input
                        type="text"
                        name="country"
                        required
                        maxLength={100}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('contact.form.requestType')} *
                      </label>
                      <select
                        name="request_type"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">{t('contact.form.selectType')}</option>
                        {requestTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {t(type.labelKey)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.form.subject')} *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      maxLength={255}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.form.message')} *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      maxLength={2000}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.form.file')}
                    </label>
                    <input
                      type="file"
                      name="file"
                      accept=".pdf,application/pdf"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t('contact.form.fileHint')}
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md font-medium transition-colors"
                  >
                    {processing ? t('contact.form.sending') : t('contact.form.submit')}
                    <Send className="ml-2" size={18} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
