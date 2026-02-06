import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('company.name')}</h3>
            <p className="text-gray-400 text-sm mb-4">
              {t('footer.description')}
            </p>
            <a
              href="https://linkedin.com/company/nuorsteel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin size={20} className="mr-2" />
              {t('footer.followLinkedIn')}
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t('nav.products')}
                </Link>
              </li>
              <li>
                <Link to="/quality" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t('nav.quality')}
                </Link>
              </li>
              <li>
                <Link to="/career" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t('nav.career')}
                </Link>
              </li>
              <li>
                <Link to="/certificates" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t('nav.certificates')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.contactUs')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start text-sm text-gray-400">
                <MapPin size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>{t('footer.address')}</span>
              </li>
              <li className="flex items-center text-sm text-gray-400">
                <Phone size={16} className="mr-2 flex-shrink-0" />
                <a href="tel:+966XXXXXXXX" className="hover:text-white transition-colors">
                  +966 XX XXX XXXX
                </a>
              </li>
              <li className="flex items-center text-sm text-gray-400">
                <Mail size={16} className="mr-2 flex-shrink-0" />
                <a href="mailto:info@nuorsteel.com" className="hover:text-white transition-colors">
                  info@nuorsteel.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.newsletter')}</h4>
            <p className="text-gray-400 text-sm mb-4">
              {t('footer.newsletterDescription')}
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors"
              >
                {t('footer.subscribe')}
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; {currentYear} {t('company.name')}. {t('footer.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}
