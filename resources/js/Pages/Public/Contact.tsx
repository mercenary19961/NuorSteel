import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Head, router, usePage } from '@inertiajs/react';
import { Mail, Phone, MapPin, Send, CheckCircle, ChevronDown, Check } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import type { PageProps } from '@/types';

const requestTypes = [
  { value: 'vendor', labelKey: 'contact.types.vendor' },
  { value: 'partnership', labelKey: 'contact.types.partnership' },
  { value: 'careers', labelKey: 'contact.types.careers' },
  { value: 'sustainability', labelKey: 'contact.types.sustainability' },
  { value: 'general', labelKey: 'contact.types.general' },
  { value: 'quotation', labelKey: 'contact.types.quotation' },
];

interface Props {
  content_en: Record<string, Record<string, string>>;
  content_ar: Record<string, Record<string, string>>;
}

function RequestTypeSelect({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = requestTypes.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen((p) => !p);
    } else if (e.key === 'Escape') {
      setOpen(false);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) { setOpen(true); return; }
      const idx = requestTypes.findIndex((o) => o.value === value);
      const next = e.key === 'ArrowDown'
        ? Math.min(idx + 1, requestTypes.length - 1)
        : Math.max(idx - 1, 0);
      onChange(requestTypes[next].value);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        onKeyDown={handleKeyDown}
        className={`
          w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm rounded-lg transition-colors text-start cursor-pointer
          ${open
            ? 'bg-white/5 border border-primary/50 ring-1 ring-primary/30'
            : 'bg-white/5 border border-white/10 hover:border-white/20'
          }
        `}
      >
        <span className={selected ? 'text-white' : 'text-gray-500'}>
          {selected ? t(selected.labelKey) : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul className="absolute z-50 mt-1 w-full max-h-60 overflow-auto scrollbar-thin bg-black border border-primary/40 rounded-lg shadow-xl shadow-primary/10 py-1">
          {requestTypes.map((option) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                onClick={() => { onChange(option.value); setOpen(false); }}
                className={`
                  flex items-center justify-between gap-2 px-4 py-2.5 text-sm cursor-pointer transition-colors
                  ${isSelected
                    ? 'bg-primary/15 text-primary font-medium'
                    : 'text-gray-300 hover:bg-primary/10 hover:text-white'
                  }
                `}
              >
                <span>{t(option.labelKey)}</span>
                {isSelected && <Check size={14} className="shrink-0 text-primary" />}
              </li>
            );
          })}
        </ul>
      )}

      {/* Hidden input for form submission */}
      <input type="hidden" name="request_type" value={value} />
    </div>
  );
}

export default function Contact({ content_en, content_ar }: Props) {
  const { siteSettings } = usePage<PageProps>().props;
  const { language } = useLanguage();
  const { t } = useTranslation();
  const content = language === 'ar' ? content_ar : content_en;
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [requestType, setRequestType] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    if (!requestType) {
      setFormError(t('contact.form.selectTypeRequired', 'Please select a type of request.'));
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    const file = formData.get('file') as File;
    if (file && file.size > 0) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setFormError(t('contact.form.fileInvalidType'));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFormError(t('contact.form.fileTooLarge'));
        return;
      }
    }

    setProcessing(true);
    router.post('/contact', formData as any, {
      forceFormData: true,
      onSuccess: () => setSubmitted(true),
      onError: () => setFormError(t('contact.form.submitError')),
      onFinish: () => setProcessing(false),
    });
  };

  const inputClasses =
    'w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30';

  return (
    <PublicLayout>
      <Head title="Contact" />

      {/* Contact Content */}
      <section className="bg-surface text-white pt-24 lg:pt-32 pb-24 lg:pb-32 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Header + Contact Info */}
            <div className="lg:col-span-1">
              <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
                {t('contact.hero.title')}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black leading-tight mb-4">
                {content?.overview?.title || t('contact.hero.h1')}
              </h1>
              <p className="text-base text-gray-400 leading-relaxed mb-10">
                {content?.overview?.description || t('contact.hero.subtitle')}
              </p>
              <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
                {t('contact.info.title')}
              </p>
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-sm mb-1">{t('contact.info.address')}</h3>
                    <p className="text-gray-400 text-sm">{siteSettings.address || 'Riyadh, Saudi Arabia'}</p>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-sm mb-1">{t('contact.info.phone')}</h3>
                    <div className="flex flex-col gap-0.5">
                      {(siteSettings.phone || '+966543781868').split(',').map((p) => (
                        <a key={p} href={`tel:${p.trim().replace(/\s/g, '')}`} className="text-gray-400 text-sm hover:text-primary transition-colors">
                          {p.trim()}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-sm mb-1">{t('contact.info.email')}</h3>
                    <div className="flex flex-col gap-0.5">
                      {(siteSettings.email || 'info@nuorsteel.com').split(',').map((e) => (
                        <a key={e} href={`mailto:${e.trim()}`} className="text-gray-400 text-sm hover:text-primary transition-colors">
                          {e.trim()}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
                {t('contact.form.title')}
              </p>

              {submitted ? (
                <div className="bg-green-950/30 border border-green-500/20 rounded-xl p-8 text-center">
                  <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
                  <h3 className="text-lg font-medium text-green-300 mb-2">
                    {t('contact.form.successTitle')}
                  </h3>
                  <p className="text-green-400/80">
                    {content?.form?.success_message || t('contact.form.successMessage')}
                  </p>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                  {formError && (
                    <div className="p-3 bg-red-950/30 border border-red-500/20 rounded-lg text-sm text-red-300">
                      {formError}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        {t('contact.form.name')} *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        maxLength={255}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        {t('contact.form.company')}
                      </label>
                      <input
                        type="text"
                        name="company"
                        maxLength={255}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        {t('contact.form.email')} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        maxLength={255}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        {t('contact.form.phone')} *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        maxLength={50}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        {t('contact.form.country')} *
                      </label>
                      <input
                        type="text"
                        name="country"
                        required
                        maxLength={100}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        {t('contact.form.requestType')} *
                      </label>
                      <RequestTypeSelect
                        value={requestType}
                        onChange={setRequestType}
                        placeholder={t('contact.form.selectType')}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {t('contact.form.subject')} *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      maxLength={255}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {t('contact.form.message')} *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      maxLength={2000}
                      className={`${inputClasses} resize-none`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {t('contact.form.file')}
                    </label>
                    <input
                      type="file"
                      name="file"
                      accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-primary/20 file:text-primary file:text-xs file:font-medium file:cursor-pointer focus:outline-none focus:border-primary/50"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t('contact.form.fileHint')}
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/40 text-white rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    {processing ? t('contact.form.sending') : (content?.form?.submit_text || t('contact.form.submit'))}
                    <Send className="ms-2" size={18} />
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
