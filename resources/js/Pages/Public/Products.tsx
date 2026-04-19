import { useTranslation } from 'react-i18next';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, ArrowLeft, LayoutGrid, Ruler, Shield, Package, Zap, Flame, Box, Microscope, Target, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicLayout from '@/Layouts/PublicLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { MagicCard, MagicCardGrid } from '@/Components/ui/magic-card';

// --- Types ---
interface ProductImage {
  id: number;
  url: string;
  alt: string;
}

interface ProductSpec {
  property_en: string;
  property_ar: string;
  value: string;
}

interface ProductData {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
  short_description_en: string | null;
  short_description_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  category: string | null;
  image: string | null;
  images: ProductImage[];
  specifications: {
    chemical: ProductSpec[];
    mechanical: ProductSpec[];
    dimensional: ProductSpec[];
  };
}

interface Props {
  products: ProductData[];
}

type TabKey = 'overview' | 'specifications' | 'features' | 'quote';

// --- Feature Icons Map ---
const featureIcons: Record<string, React.ElementType> = {
  thermoMechanical: Flame,
  ductility: Zap,
  weldability: Target,
  corrosionResistance: Shield,
  eafSteelmaking: Flame,
  continuousCasting: Box,
  chemicalControl: Microscope,
  dimensionalConsistency: Ruler,
};

// --- Spec Data Table Component ---
function SpecDataTable({ tableData }: { tableData: { title: string; headers: string[]; rows: string[][] } }) {
  const [expandedHeader, setExpandedHeader] = useState<number | null>(null);
  const [truncatedHeaders, setTruncatedHeaders] = useState<Set<number>>(new Set());
  const headerRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (expandedHeader === null) return;
    const close = () => setExpandedHeader(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [expandedHeader]);

  // Detect which headers are truncated
  useEffect(() => {
    const truncated = new Set<number>();
    headerRefs.current.forEach((span, i) => {
      if (span && span.scrollHeight > span.clientHeight + 1) {
        truncated.add(i);
      }
    });
    setTruncatedHeaders(truncated);
  }, [tableData.headers]);

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-white mb-4">{tableData.title}</h3>
      <div className="overflow-x-auto overflow-y-auto max-h-72 scrollbar-thin">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-white/20 backdrop-blur-sm">
              {tableData.headers.map((header: string, i: number) => (
                <th
                  key={i}
                  className="text-start py-3 px-4 text-sm font-semibold text-white border-b border-white/20 max-w-32 relative cursor-pointer select-none"
                  title={header}
                  onClick={(e) => { e.stopPropagation(); setExpandedHeader(expandedHeader === i ? null : i); }}
                >
                  <span
                    ref={(el) => { headerRefs.current[i] = el; }}
                    className={`line-clamp-2 ${truncatedHeaders.has(i) ? 'animate-pulse-subtle' : ''}`}
                  >{header}</span>
                  {expandedHeader === i && (
                    <div className="fixed z-50 px-3 py-2 bg-gray-700 rounded-lg shadow-lg text-white text-xs font-normal whitespace-normal max-w-60 border border-white/10"
                      style={{ top: 'var(--tooltip-top)', left: 'var(--tooltip-left)' }}
                      ref={(el) => {
                        if (!el) return;
                        const th = el.parentElement;
                        if (!th) return;
                        const rect = th.getBoundingClientRect();
                        const tooltipWidth = el.offsetWidth;
                        let left = rect.left;
                        // Keep tooltip within viewport
                        if (left + tooltipWidth > window.innerWidth - 8) {
                          left = window.innerWidth - tooltipWidth - 8;
                        }
                        el.style.top = `${rect.bottom + 4}px`;
                        el.style.left = `${Math.max(8, left)}px`;
                      }}
                    >
                      {header}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.rows.map((row: string[], rowIndex: number) => (
              <tr key={rowIndex} className="border-b border-white/15 hover:bg-white/10 transition-colors">
                {row.map((cell: string, cellIndex: number) => (
                  <td key={cellIndex} className={`py-3 px-4 text-sm ${cellIndex === 0 ? 'font-medium text-white' : 'text-white/70'}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Tab Navigation Component ---
function ProductTabs({ activeTab, onTabChange, showQuote = true }: { activeTab: TabKey; onTabChange: (tab: TabKey) => void; showQuote?: boolean }) {
  const { t } = useTranslation();
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: t('products.tabs.overview') },
    { key: 'specifications', label: t('products.tabs.specifications') },
    { key: 'features', label: t('products.tabs.features') },
    ...(showQuote ? [{ key: 'quote' as TabKey, label: t('products.tabs.requestQuote') }] : []),
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer outline-none border ${
            activeTab === tab.key
              ? 'bg-white text-gray-900 border-transparent'
              : 'border-white/30 text-white/80 hover:border-white/60 hover:text-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// --- Main Component ---
export default function Products({ products }: Props) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialSlug = (urlParams?.get('product') && products.find(p => p.slug === urlParams.get('product'))?.slug) || products[0]?.slug || '';
  const initialExpanded = urlParams?.get('expanded') === 'true';

  const [selectedSlug, setSelectedSlug] = useState(initialSlug);
  const [expanded, setExpanded] = useState(initialExpanded);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [isLg, setIsLg] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const [panelSize, setPanelSize] = useState({ w: 0, h: 0 });

  const selectedProduct = products.find((p) => p.slug === selectedSlug) ?? products[0];

  // Empty state — no products in the database
  if (!products.length || !selectedProduct) {
    return (
      <PublicLayout>
        <Head title={t('nav.products')} />
        <section className="bg-linear-to-r from-gray-900 to-gray-800 text-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Package size={48} className="text-white/10 mx-auto mb-4" />
            <p className="text-gray-500">{t('products.noProducts', 'No products available.')}</p>
          </div>
        </section>
      </PublicLayout>
    );
  }

  // Detect lg breakpoint for clip-path
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const check = () => setIsLg(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Quote tab is hidden for billets — snap back to overview if a user had it open
  // on TMT bars and then switched to billets.
  useEffect(() => {
    if (selectedSlug === 'billets' && activeTab === 'quote') {
      setActiveTab('overview');
    }
  }, [selectedSlug, activeTab]);

  // Measure left panel for curved clip-path (useLayoutEffect to avoid flash)
  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
  useIsomorphicLayoutEffect(() => {
    if (!leftPanelRef.current) return;
    const el = leftPanelRef.current;
    const update = () => setPanelSize({ w: el.offsetWidth, h: el.offsetHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Delayed attention glow on "Back to Products" button (10s after expanding)
  const [showAttention, setShowAttention] = useState(false);
  useEffect(() => {
    if (!expanded) { setShowAttention(false); return; }
    const timer = setTimeout(() => setShowAttention(true), 2000);
    return () => clearTimeout(timer);
  }, [expanded]);

  // Delayed attention glow on "Explore More" button (10s on hero view)
  const [showExploreAttention, setShowExploreAttention] = useState(false);
  useEffect(() => {
    if (expanded) { setShowExploreAttention(false); return; }
    const timer = setTimeout(() => setShowExploreAttention(true), 2000);
    return () => clearTimeout(timer);
  }, [expanded, selectedSlug]);

  // Reset tab when switching product
  useEffect(() => {
    setActiveTab('overview');
  }, [selectedSlug]);

  // Helpers
  const getName = (p: ProductData) => language === 'ar' ? p.name_ar : p.name_en;
  const getShortDesc = (p: ProductData) => language === 'ar' ? p.short_description_ar : p.short_description_en;
  const getDesc = (p: ProductData) => language === 'ar' ? p.description_ar : p.description_en;
  // Bilingual 3D renders for known products; falls back to DB-stored image.
  const localRenderSlugs = new Set(['tmt-bars', 'billets']);
  const getProductImage = (p: ProductData) =>
    localRenderSlugs.has(p.slug)
      ? `/images/products/renders/${p.slug}-${language}.webp`
      : p.image;

  // Warm opposite-language background + product renders during idle time.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const other = language === 'ar' ? 'en' : 'ar';
    const urls = [
      `/images/products/renders/tmt-bars-${other}.webp`,
      `/images/products/renders/billets-${other}.webp`,
    ];
    const preload = () => urls.forEach((src) => { const img = new Image(); img.src = src; });
    const hasIdle = 'requestIdleCallback' in window;
    const handle = hasIdle
      ? window.requestIdleCallback(preload, { timeout: 2000 })
      : window.setTimeout(preload, 1500);
    return () => {
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, [language]);

  // Slug-based i18n key map
  const slugToKey: Record<string, string> = {
    'tmt-bars': 'tmtBars',
    'billets': 'billets',
  };
  const productKey = slugToKey[selectedProduct?.slug] ?? 'tmtBars';

  const handleExplore = () => {
    setExpanded(true);
    // Scroll to detail area on mobile
    if (!isLg) {
      setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  };

  const handleBack = () => {
    setExpanded(false);
    setActiveTab('overview');
  };

  const handleSelectProduct = (slug: string) => {
    if (slug === selectedSlug) return;
    setSelectedSlug(slug);
    setExpanded(false);
  };

  // Flex values
  const leftFlex = expanded ? 4 : 1.8;
  const rightFlex = 1;

  // Clip-path for left panel — curved diagonal like ISL reference
  const DIAG_PX = 400; // 25rem in px
  const CURVE_R = 40;  // curve radius at diagonal endpoints (px) — tweak to adjust
  const leftClipPath = (() => {
    if (!isLg) return undefined;
    const { w: W, h: H } = panelSize;
    if (W === 0 || H === 0) {
      // Fallback before measurements
      return language === 'ar'
        ? 'polygon(0 0, 100% 0, 100% 100%, 25rem 100%)'
        : 'polygon(0 0, 100% 0, calc(100% - 25rem) 100%, 0 100%)';
    }
    const D = Math.sqrt(DIAG_PX * DIAG_PX + H * H); // diagonal length
    const R = CURVE_R;
    // Unit vector along diagonal
    const dx = DIAG_PX / D;
    const dy = H / D;

    if (language === 'ar') {
      // RTL: mirror of LTR — diagonal from top-left (0,0) to bottom (DIAG_PX, H)
      const tStartX = R;                    // top edge, just right of curve
      const tEndX = dx * R;                 // start of diagonal (near 0,0)
      const tEndY = dy * R;
      const bStartX = DIAG_PX - dx * R;    // end of diagonal (near DIAG_PX, H)
      const bStartY = H - dy * R;
      const bEndX = DIAG_PX + R;           // bottom edge, just right of curve
      return `path('M ${tStartX} 0 L ${W} 0 L ${W} ${H} L ${bEndX} ${H} Q ${DIAG_PX} ${H} ${bStartX} ${bStartY} L ${tEndX} ${tEndY} Q 0 0 ${tStartX} 0 Z')`;
    } else {
      // LTR: corners at (W, 0) top and (W - DIAG_PX, H) bottom
      const tStartX = W - R;
      const tEndX = W - dx * R;
      const tEndY = dy * R;
      const bStartX = W - DIAG_PX + dx * R;
      const bStartY = H - dy * R;
      const bEndX = W - DIAG_PX - R;
      return `path('M 0 0 L ${tStartX} 0 Q ${W} 0 ${tEndX} ${tEndY} L ${bStartX} ${bStartY} Q ${W - DIAG_PX} ${H} ${bEndX} ${H} L 0 ${H} Z')`;
    }
  })();

  // --- Render Tab Content ---
  const renderTabContent = () => {
    if (!selectedProduct) return null;

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Description */}
            <div className="space-y-4">
              {getDesc(selectedProduct)?.split('\n').filter(Boolean).map((paragraph, i) => (
                <p key={i} className="text-white/80 leading-relaxed">{paragraph}</p>
              ))}
            </div>

            {/* Spec Highlight Icons */}
            <div className="grid grid-cols-3 gap-6 mt-8">
              {Object.entries(t(`products.${productKey}.specIcons`, { returnObjects: true }) as Record<string, { title: string; value: string }>).map(([key, icon]) => (
                <div key={key} className="text-center">
                  <div className="w-14 h-14 mx-auto mb-3 border border-white/40 rounded-lg flex items-center justify-center">
                    {key === 'diameterRange' || key === 'crossSection' ? <Ruler className="text-white" size={24} /> :
                     key === 'standards' || key === 'chemicalControl' ? <Shield className="text-white" size={24} /> :
                     <Package className="text-white" size={24} />}
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1">{icon.title}</h4>
                  <p className="text-white/60 text-xs">{icon.value}</p>
                </div>
              ))}
            </div>

            {/* Key Highlights */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">{t('products.overview.keyHighlights')}</h3>
              <ul className="space-y-2">
                {(t(`products.${productKey}.highlights`, { returnObjects: true }) as string[]).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-white/80 text-sm">
                    <CheckCircle className="text-white shrink-0 mt-0.5" size={16} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'specifications':
        return (
          <div>
            <SpecDataTable
              tableData={t(`products.${productKey}.specTable`, { returnObjects: true }) as { title: string; headers: string[]; rows: string[][] }}
            />
            <p className="text-white/70 text-sm italic mt-4">{t('products.specNote')}</p>
          </div>
        );

      case 'features':
        return (
          <MagicCardGrid className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.entries(t(`products.${productKey}.features`, { returnObjects: true }) as Record<string, { title: string; description: string }>).map(([key, feature]) => {
              const Icon = featureIcons[key] ?? Zap;
              return (
                <MagicCard key={key} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mb-4">
                      <Icon className="text-white" size={20} />
                    </div>
                    <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                    <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </MagicCard>
              );
            })}
          </MagicCardGrid>
        );

      case 'quote':
        return (
          <div className="max-w-lg">
            <h3 className="text-2xl font-bold text-white mb-4">{t('products.requestQuote.title')}</h3>
            <p className="text-white/70 leading-relaxed mb-8">{t('products.requestQuote.description')}</p>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3 bg-white hover:bg-white/90 text-primary rounded-full font-semibold transition-colors"
            >
              {t('products.requestQuote.button')}
              <ArrowRight className="ms-2 rtl:rotate-180" size={18} />
            </Link>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <PublicLayout>
      <Head title="Products" />

      <h1 className="sr-only">{t('products.hero.title')}</h1>

      {/* Main Split Section */}
      <section className="relative flex flex-col lg:flex-row min-h-screen overflow-hidden bg-surface">
        {/* LEFT PANEL — Featured Product (wrapper for drop-shadow along diagonal) */}
        <div
          className="relative lg:z-10 bg-primary lg:bg-transparent"
          style={{
            flex: leftFlex,
            transition: 'flex 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: isLg ? `drop-shadow(${language === 'ar' ? '-4px' : '4px'} 0px 6px rgba(0, 0, 0, 0.4))` : undefined,
          }}
        >
        <div
          ref={leftPanelRef}
          className="relative h-full overflow-hidden bg-primary"
          style={{
            clipPath: leftClipPath,
            backgroundSize: isLg ? '100vw 100%' : undefined,
          }}
        >
          {/* Faint warehouse background overlay — only in expanded detail view */}
          {expanded && (
            <img
              key={`products-bg-overlay-${language}`}
              src={`/images/products/background/bg-desktop-${language}.webp`}
              alt=""
              aria-hidden="true"
              className="hidden lg:block absolute inset-0 w-full h-full object-cover pointer-events-none opacity-10"
            />
          )}
          <div className={`relative h-full flex flex-col lg:flex-row ${expanded ? 'lg:overflow-hidden' : ''}`}>
            {/* Text Content — left side of the left panel */}
            <div className={`flex-1 flex flex-col px-4 py-8 sm:px-[max(1rem,calc((100vw-640px)/2+1rem))] md:px-[max(1rem,calc((100vw-768px)/2+1rem))] lg:py-12 lg:ps-[max(2rem,calc((100vw-1800px)/2+1rem))] lg:pe-8 ${expanded ? 'lg:overflow-y-auto scrollbar-thin justify-start pt-28!' : 'justify-center pt-24 lg:justify-start lg:pt-56'}`}>
              <AnimatePresence mode="wait">
                {!expanded ? (
                  /* --- DEFAULT: Hero Content --- */
                  <motion.div
                    key={`hero-${selectedSlug}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-lg"
                  >
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 uppercase tracking-wide">
                      {getName(selectedProduct)}
                    </h2>
                    <p className="text-white/70 leading-relaxed mb-8 text-base lg:text-lg xl:text-xl">
                      {getShortDesc(selectedProduct)}
                    </p>
                    <button
                      onClick={handleExplore}
                      className={`inline-flex items-center px-8 py-3 rounded-full bg-white text-primary font-semibold hover:bg-white/90 transition-all cursor-pointer group ${
                        showExploreAttention ? 'animate-bounce-subtle' : ''
                      }`}
                    >
                      {t('products.exploreMore')}
                      <ArrowRight className="ms-2 rtl:rotate-180 group-hover:translate-x-1 transition-transform" size={18} />
                    </button>

                    {/* Mobile: Featured product image */}
                    <div className="lg:hidden flex items-center justify-center mt-32 pb-4">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`mobile-img-${selectedSlug}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.4 }}
                        >
                          {getProductImage(selectedProduct) ? (
                            <img
                              key={`mobile-hero-img-${selectedSlug}-${language}`}
                              src={getProductImage(selectedProduct)!}
                              alt={getName(selectedProduct)}
                              onClick={handleExplore}
                              className="max-h-52 w-auto object-contain cursor-pointer"
                            />
                          ) : (
                            <div className="w-40 h-40 rounded-full bg-white/5 flex items-center justify-center">
                              <Package className="text-white/20" size={56} />
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ) : (
                  /* --- EXPANDED: Detail Content with Tabs --- */
                  <motion.div
                    key={`detail-${selectedSlug}`}
                    ref={detailRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full lg:max-w-[70%] pb-8"
                  >
                    <div className="flex items-center justify-between gap-3 mb-6 lg:block">
                      <h2 className="text-4xl lg:text-3xl xl:text-4xl font-black text-white uppercase tracking-wide">
                        {getName(selectedProduct)}
                      </h2>
                      <button
                        onClick={handleBack}
                        className="lg:hidden shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-primary text-xs font-semibold hover:bg-white/90 transition-all cursor-pointer group"
                      >
                        <LayoutGrid size={12} />
                        {t('products.backToProducts')}
                        <ArrowRight className="-rotate-90 group-hover:-translate-y-0.5 transition-transform" size={12} />
                      </button>
                    </div>

                    <ProductTabs activeTab={activeTab} onTabChange={setActiveTab} showQuote={selectedSlug !== 'billets'} />

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {renderTabContent()}
                      </motion.div>
                    </AnimatePresence>

                    {/* Mobile: Product image (only visible below lg) */}
                    <div className="lg:hidden flex items-end justify-end mt-12 pb-4">
                      {getProductImage(selectedProduct) ? (
                        <img
                          key={`mobile-detail-img-${selectedSlug}-${language}`}
                          src={getProductImage(selectedProduct)!}
                          alt={getName(selectedProduct)}
                          className="max-h-28 w-auto object-contain"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                          <Package className="text-white/20" size={24} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Large Product Image — absolutely positioned over both panels, near the diagonal */}
        {!expanded && (
          <div className="hidden lg:flex absolute z-20 bottom-1/4 items-end justify-start pointer-events-none max-w-[60%] left-0 ps-[max(2rem,calc((100vw-1800px)/2+1rem))]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`img-${selectedSlug}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className={`relative ${selectedSlug === 'billets' ? 'translate-y-12' : ''}`}
              >
                {getProductImage(selectedProduct) ? (
                  <img
                    key={`hero-img-${selectedSlug}-${language}`}
                    src={getProductImage(selectedProduct)!}
                    alt={getName(selectedProduct)}
                    onClick={handleExplore}
                    className="w-auto object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)] max-h-64 xl:max-h-80 2xl:max-h-96 pointer-events-auto cursor-pointer"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-full bg-white/5 flex items-center justify-center">
                    <Package className="text-white/20" size={64} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Expanded: Back to Products — top-right */}
        {expanded && (
          <div className="hidden lg:flex absolute z-20 top-24 end-16 xl:end-24">
            <motion.button
              onClick={handleBack}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-primary text-sm font-semibold hover:bg-white/90 transition-all cursor-pointer group ${
                showAttention ? 'animate-bounce-subtle' : ''
              }`}
            >
              <LayoutGrid size={15} />
              {t('products.backToProducts')}
              <ArrowLeft className="rtl:rotate-180 group-hover:-translate-x-1 transition-transform" size={15} />
            </motion.button>
          </div>
        )}

        {/* Expanded Product Image — absolutely positioned, bottom-right, floats above the panel */}
        {expanded && (
          <div className="hidden lg:flex absolute z-20 bottom-24 end-[15%] min-[1280px]:end-[12%] min-[1536px]:end-[8%] min-[1800px]:end-[5%] pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={`expanded-img-${selectedSlug}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className={selectedSlug === 'billets' ? 'translate-y-10' : ''}
              >
                {getProductImage(selectedProduct) ? (
                  <img
                    key={`expanded-img-${selectedSlug}-${language}`}
                    src={getProductImage(selectedProduct)!}
                    alt={getName(selectedProduct)}
                    className={`object-contain drop-shadow-2xl ${selectedSlug === 'billets' ? 'max-h-32 xl:max-h-40 max-w-105 xl:max-w-130' : 'max-h-32 xl:max-h-48 2xl:max-h-60 w-auto'}`}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center">
                    <Package className="text-white/20" size={32} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
        </div>

        {/* RIGHT PANEL — Product Navigation / Image (hidden on mobile when expanded) */}
        <div
          className={`relative overflow-hidden lg:-ms-120 bg-surface ${expanded ? 'hidden lg:block' : ''}`}
          style={{
            flex: rightFlex,
            transition: 'flex 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <AnimatePresence mode="wait">
            {!expanded ? (
              /* --- DEFAULT: Product Thumbnails --- */
              <motion.div
                key="thumbnails"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col items-center p-4 sm:p-6 lg:p-0"
              >
                {/* Mobile: Product thumbnails — horizontal at top */}
                <div className="flex lg:hidden items-center justify-center gap-6 pb-4 w-full max-w-full px-2">
                  {products.map((product) => {
                    const isSelected = product.slug === selectedSlug;
                    return (
                      <button
                        key={product.slug}
                        onClick={() => handleSelectProduct(product.slug)}
                        className="group relative flex-1 min-w-0 max-w-44 transition-all duration-300 cursor-pointer"
                      >
                        <div className="w-full flex items-center justify-center">
                          {getProductImage(product) ? (
                            <img src={getProductImage(product)!} alt={getName(product)} className="w-full object-contain" />
                          ) : (
                            <div className="w-full h-24 flex items-center justify-center">
                              <Package className="text-white/30" size={36} />
                            </div>
                          )}
                        </div>
                        <h3
                          className={`mt-2 uppercase tracking-wider text-center transition-all text-xs ${
                            isSelected ? 'text-primary font-bold text-sm' : 'text-white font-normal'
                          }`}
                        >
                          {getName(product)}
                        </h3>
                      </button>
                    );
                  })}
                </div>

                {/* Mobile navigation — next product button (below thumbnails) */}
                <div className="flex lg:hidden items-center justify-center mt-3 pb-4">
                  <button
                    onClick={() => {
                      const idx = products.findIndex(p => p.slug === selectedSlug);
                      const next = (idx + 1) % products.length;
                      handleSelectProduct(products[next].slug);
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-white text-primary font-semibold hover:bg-white/90 transition-colors cursor-pointer text-sm uppercase tracking-wider"
                  >
                    {(() => {
                      const idx = products.findIndex(p => p.slug === selectedSlug);
                      const next = (idx + 1) % products.length;
                      const isWrapping = next < idx;
                      return (
                        <>
                          {getName(products[next])}
                          {isWrapping
                            ? <ArrowLeft className="rtl:rotate-180" size={14} />
                            : <ArrowRight className="rtl:rotate-180" size={14} />
                          }
                        </>
                      );
                    })()}
                  </button>
                </div>

                {/* Desktop: Product thumbnails — stacked vertically, far right, centered */}
                <div className="hidden lg:flex flex-col items-end justify-center h-full w-full lg:pe-4 xl:pe-[max(2rem,calc((100vw-1800px)/2+1rem))] gap-20">
                  {products.map((product) => {
                    const isSelected = product.slug === selectedSlug;
                    return (
                      <button
                        key={product.slug}
                        onClick={() => handleSelectProduct(product.slug)}
                        className="group relative w-48 xl:w-64 2xl:w-80 transition-all duration-300 cursor-pointer"
                      >
                        <div className="w-full flex items-center justify-center">
                          {getProductImage(product) ? (
                            <img src={getProductImage(product)!} alt={getName(product)} className="w-full object-contain" />
                          ) : (
                            <div className="w-full h-24 flex items-center justify-center">
                              <Package className="text-white/30" size={36} />
                            </div>
                          )}
                        </div>
                        <h3
                          className={`mt-6 uppercase tracking-wider text-center font-black transition-all ${
                            isSelected ? 'text-primary text-2xl xl:text-3xl 2xl:text-4xl' : 'text-white text-base xl:text-lg 2xl:text-xl'
                          }`}
                        >
                          {getName(product)}
                        </h3>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation button — positioned at bottom-right, independent of thumbnails */}
                <div className="hidden lg:flex absolute bottom-8 end-0 pe-20 xl:pe-40 2xl:pe-52 3xl:pe-64">
                  <button
                    onClick={() => {
                      const idx = products.findIndex(p => p.slug === selectedSlug);
                      const next = (idx + 1) % products.length;
                      handleSelectProduct(products[next].slug);
                    }}
                    className="w-44 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/50 text-white hover:border-white transition-colors cursor-pointer text-sm uppercase tracking-wider"
                  >
                    {(() => {
                      const idx = products.findIndex(p => p.slug === selectedSlug);
                      const next = (idx + 1) % products.length;
                      const isWrapping = next < idx;
                      return (
                        <>
                          {getName(products[next])}
                          <ArrowRight className={isWrapping ? '-rotate-90' : 'rotate-90'} size={16} />
                        </>
                      );
                    })()}
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </section>
    </PublicLayout>
  );
}
