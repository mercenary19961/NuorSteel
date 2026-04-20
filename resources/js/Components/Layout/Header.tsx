import { useRef, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { Menu, X, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type NavChild = {
  label: string;
  href: string;
  description?: string;
  image?: string;
};

type NavItem = {
  path: string;
  labelKey: string;
  dropdown?: {
    type: 'simple' | 'mega';
    children: NavChild[];
  };
};

// Bilingual labels for the new dropdown rows — inline rather than in i18n files
// so we can iterate on copy without another seeder/translation round-trip.
const L = {
  about: {
    vision: { en: 'Vision & Mission', ar: 'الرؤية والرسالة' },
    journey: { en: 'Our Journey', ar: 'مسيرتنا' },
    capabilities: { en: 'Capabilities', ar: 'إمكانياتنا' },
  },
  products: {
    tmtDesc: { en: 'Thermo-mechanically treated reinforcement bars', ar: 'قضبان تسليح معالجة حراريًا وميكانيكيًا' },
    billetsDesc: { en: 'Semi-finished steel for rolling mills', ar: 'فولاذ نصف مصنّع لمصانع الدرفلة' },
    viewAll: { en: 'View all products', ar: 'عرض جميع المنتجات' },
  },
  certificates: {
    esg: { en: 'ESG & Sustainability', ar: 'الاستدامة والحوكمة البيئية' },
    quality: { en: 'Quality', ar: 'الجودة' },
    governance: { en: 'Governance', ar: 'الحوكمة' },
  },
};

function buildNavItems(t: (k: string) => string, lang: 'en' | 'ar'): NavItem[] {
  return [
    {
      path: '/about',
      labelKey: 'nav.about',
      dropdown: {
        type: 'simple',
        children: [
          { label: L.about.vision[lang], href: '/about#vision-mission' },
          { label: L.about.journey[lang], href: '/about#journey' },
          { label: L.about.capabilities[lang], href: '/about#capabilities' },
        ],
      },
    },
    {
      path: '/products',
      labelKey: 'nav.products',
      dropdown: {
        type: 'mega',
        children: [
          {
            label: t('home.products.tmtBars.title'),
            href: '/products?product=tmt-bars',
            description: L.products.tmtDesc[lang],
            image: `/images/products/renders/tmt-bars-${lang}.webp`,
          },
          {
            label: t('home.products.billets.title'),
            href: '/products?product=billets',
            description: L.products.billetsDesc[lang],
            image: `/images/products/renders/billets-${lang}.webp`,
          },
        ],
      },
    },
    { path: '/quality', labelKey: 'nav.quality' },
    { path: '/career', labelKey: 'nav.career' },
    {
      path: '/certificates',
      labelKey: 'nav.certificates',
      dropdown: {
        type: 'simple',
        children: [
          { label: L.certificates.esg[lang], href: '/certificates?category=esg' },
          { label: L.certificates.quality[lang], href: '/certificates?category=quality' },
          { label: L.certificates.governance[lang], href: '/certificates?category=governance' },
        ],
      },
    },
  ];
}

export default function Header() {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const { url } = usePage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { isAtTop, isAtBottom, isIdle } = useScrollDirection();

  const navItems = buildNavItems(t, language);

  const isActive = (path: string) => {
    if (path === '/') return url === '/';
    return url.startsWith(path);
  };

  const isProductsPage = url.startsWith('/products');
  const isHidden = !mobileMenuOpen && !isAtBottom && isIdle && (isProductsPage || !isAtTop);
  const isHomepage = url === '/';
  const showContactCta = !(isHomepage && isAtTop);

  const handleDropdownEnter = (path: string) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setOpenDropdown(path);
  };

  // 150ms close delay lets the mouse cross the gap from the trigger to the panel
  // without the dropdown flickering closed.
  const handleDropdownLeave = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  const closeAll = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setOpenDropdown(null);
  };

  const toggleMobileExpand = (path: string) => {
    setMobileExpanded((prev) => (prev === path ? null : path));
  };

  const closeMobile = () => {
    setMobileMenuOpen(false);
    setMobileExpanded(null);
  };

  // Transparent at top; blurred glass when scrolled (or mobile drawer open).
  const bgClass = mobileMenuOpen
    ? 'bg-surface/95 backdrop-blur-md border-b border-white/10'
    : isAtTop
      ? 'bg-transparent'
      : 'bg-surface/70 backdrop-blur-md border-b border-white/10';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass} ${
        isHidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between transition-all duration-300 ${isAtTop ? 'h-16 lg:h-20' : 'h-12 lg:h-14'}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center" onClick={closeMobile}>
            <picture>
              <source
                srcSet={isAtTop ? '/images/shared/logo/logo-lg.webp' : '/images/shared/logo/logo-sm.webp'}
                type="image/webp"
              />
              <img
                src={isAtTop ? '/images/shared/logo/logo-lg.png' : '/images/shared/logo/logo-sm.png'}
                alt={t('company.name')}
                className={`transition-all duration-300 ${isAtTop ? 'h-10 lg:h-12' : 'h-7 lg:h-9'}`}
              />
            </picture>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const isOpen = openDropdown === item.path;
              const showUnderline = active || isOpen;

              return (
                <div
                  key={item.path}
                  className="relative"
                  onMouseEnter={() => item.dropdown && handleDropdownEnter(item.path)}
                  onMouseLeave={() => item.dropdown && handleDropdownLeave()}
                >
                  <Link
                    href={item.path}
                    className={`group relative inline-flex items-center gap-1 py-2 text-xs uppercase tracking-[0.14em] font-medium transition-colors duration-200 ${
                      active ? 'text-white' : 'text-white/75 hover:text-white'
                    }`}
                    style={{ textShadow: isAtTop ? '0 1px 2px rgba(0,0,0,0.35)' : undefined }}
                  >
                    <span>{t(item.labelKey)}</span>
                    {item.dropdown && (
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    )}
                    {/* Center-growing underline */}
                    <span
                      className={`pointer-events-none absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 bg-primary transition-all duration-300 ${
                        showUnderline ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </Link>

                  {/* Dropdown panel */}
                  {item.dropdown && (
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className={`absolute top-full pt-4 ${
                            item.dropdown.type === 'mega' ? 'left-1/2 -translate-x-1/2' : 'left-0'
                          }`}
                        >
                          {item.dropdown.type === 'mega' ? (
                            <MegaPanel children={item.dropdown.children} onNavigate={closeAll} />
                          ) : (
                            <SimplePanel children={item.dropdown.children} onNavigate={closeAll} />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Contact CTA + Language Toggle + Mobile Menu */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className={`hidden lg:inline-flex items-center px-4 py-1.5 text-xs uppercase tracking-[0.14em] font-medium rounded-md transition-all duration-300 ${
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
                <div className="flex flex-col gap-0.5">
                  {navItems.map((item) => {
                    const expanded = mobileExpanded === item.path;
                    const active = isActive(item.path);
                    return (
                      <div key={item.path} className="flex flex-col">
                        <div className="flex items-center">
                          <Link
                            href={item.path}
                            onClick={closeMobile}
                            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                              active ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            {t(item.labelKey)}
                          </Link>
                          {item.dropdown && (
                            <button
                              onClick={() => toggleMobileExpand(item.path)}
                              aria-label="Toggle submenu"
                              aria-expanded={expanded}
                              className="p-3 text-white/70 hover:text-white"
                            >
                              <ChevronDown
                                size={16}
                                className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                              />
                            </button>
                          )}
                        </div>
                        <AnimatePresence>
                          {expanded && item.dropdown && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="flex flex-col ps-6 pb-1">
                                {item.dropdown.children.map((child) => (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    onClick={closeMobile}
                                    className="px-4 py-2 text-sm text-white/60 hover:text-white rounded-md"
                                  >
                                    {child.label}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                  <Link
                    href="/contact"
                    onClick={closeMobile}
                    className={`mx-4 mt-2 px-4 py-2.5 text-sm font-semibold rounded-md text-center transition-colors ${
                      isActive('/contact') ? 'bg-primary text-white' : 'bg-primary/90 text-white hover:bg-primary'
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

function SimplePanel({ children, onNavigate }: { children: NavChild[]; onNavigate: () => void }) {
  return (
    <div className="min-w-56 rounded-lg bg-surface/95 backdrop-blur-md border border-white/10 shadow-xl shadow-black/30 p-2">
      {children.map((child) => (
        <Link
          key={child.href}
          href={child.href}
          onClick={onNavigate}
          className="block px-3 py-2 text-sm text-white/75 hover:text-white hover:bg-white/5 rounded-md transition-colors"
        >
          {child.label}
        </Link>
      ))}
    </div>
  );
}

function MegaPanel({ children, onNavigate }: { children: NavChild[]; onNavigate: () => void }) {
  const { language } = useLanguage();
  return (
    <div className="w-152 rounded-xl bg-surface/95 backdrop-blur-md border border-white/10 shadow-2xl shadow-black/40 p-4">
      <div className="grid grid-cols-2 gap-3">
        {children.map((child) => (
          <Link
            key={child.href}
            href={child.href}
            onClick={onNavigate}
            className="group flex items-center gap-3 rounded-lg p-3 hover:bg-white/5 transition-colors"
          >
            {child.image && (
              <div className="shrink-0 w-20 h-20 rounded-md bg-black/20 overflow-hidden flex items-center justify-center">
                <img
                  src={child.image}
                  alt={child.label}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm font-semibold uppercase tracking-wider text-white group-hover:text-primary transition-colors">
                {child.label}
              </div>
              {child.description && (
                <div className="mt-1 text-xs text-white/60 leading-snug">{child.description}</div>
              )}
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/products"
        onClick={onNavigate}
        className="mt-2 flex items-center justify-center gap-1 text-xs uppercase tracking-[0.14em] font-medium text-primary hover:text-white py-2 rounded-md hover:bg-white/5 transition-colors"
      >
        {L.products.viewAll[language]}
        <span aria-hidden className="rtl:rotate-180">→</span>
      </Link>
    </div>
  );
}
