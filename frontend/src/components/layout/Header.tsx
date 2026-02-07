import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import { Menu, X } from 'lucide-react';

const navItems = [
  { path: '/about', labelKey: 'nav.about' },
  { path: '/products', labelKey: 'nav.products' },
  { path: '/quality', labelKey: 'nav.quality' },
  { path: '/career', labelKey: 'nav.career' },
  { path: '/certificates', labelKey: 'nav.certificates' },
  { path: '/contact', labelKey: 'nav.contact' },
];

export default function Header() {
  const { t } = useTranslation();
  const { language, toggleLanguage, isRTL } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl lg:text-2xl font-bold text-gray-900">
              {t('company.name')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-blue-600 ${
                    isActive ? 'text-blue-600' : 'text-gray-700'
                  }`
                }
              >
                {t(item.labelKey)}
              </NavLink>
            ))}
          </nav>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {language === 'en' ? 'عربي' : 'EN'}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  {t(item.labelKey)}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
