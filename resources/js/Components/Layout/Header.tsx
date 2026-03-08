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

export default function Header() {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const { url } = usePage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollDirection, isAtTop, isAtBottom, isIdle } = useScrollDirection();

  const isActive = (path: string) => {
    if (path === '/') return url === '/';
    return url.startsWith(path);
  };

  // Hide header when scrolling down or idle for 3s (unless mobile menu is open, at top, or at bottom)
  const isHidden = !mobileMenuOpen && !isAtTop && !isAtBottom && (scrollDirection === 'down' || isIdle);

  // Hide Contact CTA when on homepage hero (at top of page)
  const isHomepage = url === '/';
  const showContactCta = !(isHomepage && isAtTop);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/20 ${
        mobileMenuOpen
          ? 'bg-gray-900'
          : isAtTop
            ? 'bg-transparent'
            : 'bg-linear-to-b from-gray-900 to-gray-900/70'
      } ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between transition-all duration-300 ${isAtTop ? 'h-16 lg:h-20' : 'h-12 lg:h-14'}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <picture>
              <source
                srcSet={isAtTop ? '/images/logo/logo-lg.webp' : '/images/logo/logo-sm.webp'}
                type="image/webp"
              />
              <img
                src={isAtTop ? '/images/logo/logo-lg.png' : '/images/logo/logo-sm.png'}
                alt={t('company.name')}
                className={`transition-all duration-300 ${isAtTop ? 'h-10 lg:h-12' : 'h-7 lg:h-9'}`}
              />
            </picture>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path) ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          {/* Contact CTA + Language Toggle + Mobile Menu */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className={`hidden lg:inline-flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ${
                isActive('/contact')
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-primary/90 text-white hover:bg-primary hover:shadow-lg hover:shadow-primary/25'
              } ${showContactCta ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
            >
              {t('nav.contact')}
            </Link>
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-sm font-medium border border-white/30 text-white hover:bg-white/10 rounded-md transition-colors duration-200"
            >
              {language === 'en' ? 'عربي' : 'EN'}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-white"
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
              <div className="py-4 border-t border-white/10">
                <div className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                        isActive(item.path)
                          ? 'bg-white/10 text-white'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {t(item.labelKey)}
                    </Link>
                  ))}
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`mx-4 mt-2 px-4 py-2.5 text-sm font-semibold rounded-md text-center transition-colors ${
                      isActive('/contact')
                        ? 'bg-primary text-white'
                        : 'bg-primary/90 text-white hover:bg-primary'
                    }`}
                  >
                    {t('nav.contact')}
                  </Link>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
