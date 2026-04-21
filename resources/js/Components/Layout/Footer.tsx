import { useState, useEffect, useRef } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import Turnstile, { type TurnstileHandle } from '@/Components/Public/Turnstile';
import type { PageProps } from '@/types';

export default function Footer() {
  const { t } = useTranslation();
  const { siteSettings } = usePage<PageProps>().props;
  const currentYear = new Date().getFullYear();
  const [highlightContact, setHighlightContact] = useState(false);
  const turnstileRef = useRef<TurnstileHandle>(null);
  const { data, setData, post, processing, reset, wasSuccessful } = useForm({
    email: '',
    'cf-turnstile-response': '',
  });

  // Listen for highlight-contact event from hero "Contact Us" click
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => {
      setHighlightContact(true);
      setTimeout(() => setHighlightContact(false), 10000);
    };
    window.addEventListener('highlight-contact', handler);
    return () => window.removeEventListener('highlight-contact', handler);
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/newsletter/subscribe', {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: () => turnstileRef.current?.reset(),
    });
  };

  return (
    <footer id="site-footer" className="bg-surface-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('company.name')}</h3>
            <p className="text-gray-400 text-sm mb-4">
              {t('footer.description')}
            </p>
            {siteSettings.linkedin_url && (
              <a
                href={siteSettings.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin size={20} className="mr-2" />
                {t('footer.followLinkedIn')}
              </a>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.contactUs')}</h4>
            <div className="grid grid-cols-2 gap-3 items-start">
              <ul className="space-y-3 min-w-0">
                <li className="flex items-start text-sm text-gray-400">
                  <MapPin size={16} className="mr-2 mt-0.5 shrink-0" />
                  <span>{siteSettings.address || t('footer.address')}</span>
                </li>
                {siteSettings.phone && (
                  <li
                    className={`flex items-start text-sm transition-all duration-700 ${
                      highlightContact
                        ? 'text-white [text-shadow:0_0_12px_rgba(255,122,0,0.8),0_0_24px_rgba(255,122,0,0.4)]'
                        : 'text-gray-400'
                    }`}
                  >
                    <Phone size={16} className="mr-2 mt-0.5 shrink-0" />
                    <span className="flex flex-col gap-0.5">
                      {siteSettings.phone.split(',').map((p) => (
                        <a key={p} href={`tel:${p.trim().replace(/\s/g, '')}`} className="hover:text-white transition-colors">
                          {p.trim()}
                        </a>
                      ))}
                    </span>
                  </li>
                )}
                {siteSettings.email && (
                  <li
                    className={`flex items-start text-sm transition-all duration-700 ${
                      highlightContact
                        ? 'text-white [text-shadow:0_0_12px_rgba(255,122,0,0.8),0_0_24px_rgba(255,122,0,0.4)]'
                        : 'text-gray-400'
                    }`}
                  >
                    <Mail size={16} className="mr-2 mt-0.5 shrink-0" />
                    <span className="flex flex-col gap-0.5">
                      {siteSettings.email.split(',').map((e) => (
                        <a key={e} href={`mailto:${e.trim()}`} className="hover:text-white transition-colors">
                          {e.trim()}
                        </a>
                      ))}
                    </span>
                  </li>
                )}
              </ul>
              {siteSettings.google_maps_embed_url && (
                <a
                  href={siteSettings.google_maps_place_url || siteSettings.google_maps_embed_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('footer.viewOnMaps', { defaultValue: 'View location on Google Maps' })}
                  className="block aspect-square w-full overflow-hidden rounded-md border border-white/10 hover:border-primary/60 transition-colors"
                >
                  <iframe
                    src={siteSettings.google_maps_embed_url}
                    title="Nuor Steel factory location"
                    className="w-full h-full"
                    style={{ border: 0, display: 'block', pointerEvents: 'none' }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </a>
              )}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.newsletter')}</h4>
            <p className="text-gray-400 text-sm mb-4">
              {t('footer.newsletterDescription')}
            </p>
            {wasSuccessful ? (
              <p className="text-green-400 text-sm">Thank you for subscribing!</p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col space-y-2">
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder={t('footer.emailPlaceholder')}
                  required
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-md text-sm focus:outline-none focus:border-primary"
                />
                <div className={data['cf-turnstile-response'] ? 'hidden' : ''}>
                  <Turnstile ref={turnstileRef} theme="dark" size="compact" onVerify={(token) => setData('cf-turnstile-response', token)} />
                </div>
                {data['cf-turnstile-response'] && (
                  <div className="flex items-center gap-1.5 text-xs text-green-400">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    Verified
                  </div>
                )}
                <button
                  type="submit"
                  disabled={processing || !data['cf-turnstile-response']}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {processing ? '...' : t('footer.subscribe')}
                </button>
              </form>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t('nav.products')}
                </Link>
              </li>
              <li>
                <Link href="/quality" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t('nav.quality')}
                </Link>
              </li>
              <li>
                <Link href="/career" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t('nav.career')}
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t('nav.certificates')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-8 pt-4 pb-0 text-center text-sm text-gray-400">
          <p>
            &copy; {currentYear} {t('company.name')}. {t('footer.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}
