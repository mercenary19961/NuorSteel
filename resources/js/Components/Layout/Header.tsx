import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const navItems = [
  { path: '/about', labelKey: 'nav.about' },
  { path: '/products', labelKey: 'nav.products' },
  { path: '/quality', labelKey: 'nav.quality' },
  { path: '/career', labelKey: 'nav.career' },
  { path: '/certificates', labelKey: 'nav.certificates' },
];

interface HeaderProps {
  transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const { url } = usePage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollDirection, isAtTop } = useScrollDirection();

  const isActive = (path: string) => {
    if (path === '/') return url === '/';
    return url.startsWith(path);
  };

  // Visual state
  const showSolidBg = !transparent || !isAtTop;
  const isHidden = !isAtTop && scrollDirection === 'down' && !mobileMenuOpen;

  // Color classes based on mode
  const bgClass = !showSolidBg
    ? 'bg-transparent border-b border-white/20'
    : transparent
      ? 'bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-white/10'
      : 'bg-white shadow-sm border-b border-gray-200';

  const textColor = transparent ? 'text-white' : 'text-gray-900';
  const navLinkBase = transparent
    ? 'text-white/70 hover:text-white'
    : 'text-gray-700 hover:text-primary';
  const navLinkActive = transparent ? 'text-white' : 'text-primary';
  const langBtnClass = transparent
    ? 'border-white/30 text-white hover:bg-white/10'
    : 'border-gray-300 text-gray-700 hover:bg-gray-50';
  const iconColor = transparent ? 'text-white' : 'text-gray-900';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass} ${
        isHidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className={`text-xl lg:text-2xl font-bold ${textColor} transition-colors duration-300`}>
              {t('company.name')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path) ? navLinkActive : navLinkBase
                }`}
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className={`px-3 py-1.5 text-sm font-medium border rounded-md transition-colors duration-200 ${langBtnClass}`}
            >
              {language === 'en' ? 'عربي' : 'EN'}
            </button>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 ${iconColor}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden"
            >
              <div className={`py-4 border-t ${transparent ? 'border-white/10' : 'border-gray-100'}`}>
                <div className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                        isActive(item.path)
                          ? transparent
                            ? 'bg-white/10 text-white'
                            : 'bg-primary/10 text-primary'
                          : transparent
                            ? 'text-white/70 hover:bg-white/5 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {t(item.labelKey)}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
