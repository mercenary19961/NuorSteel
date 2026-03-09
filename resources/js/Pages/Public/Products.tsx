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
      <h3 className="text-lg font-semibold text-white mb-4">{tableData.title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white/10">
              {tableData.headers.map((header: string, i: number) => (
                <th
                  key={i}
                  className="text-start py-3 px-4 text-sm font-semibold text-primary border-b border-white/10 max-w-32 relative cursor-pointer select-none"
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
              <tr key={rowIndex} className="border-b border-white/5 hover:bg-white/5 transition-colors">
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
function ProductTabs({ activeTab, onTabChange }: { activeTab: TabKey; onTabChange: (tab: TabKey) => void }) {
  const { t } = useTranslation();
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: t('products.tabs.overview') },
    { key: 'specifications', label: t('products.tabs.specifications') },
    { key: 'features', label: t('products.tabs.features') },
    { key: 'quote', label: t('products.tabs.requestQuote') },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
            activeTab === tab.key
              ? 'bg-white text-gray-900'
              : 'border border-white/30 text-white/80 hover:border-white/60 hover:text-white'
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
    const timer = setTimeout(() => setShowAttention(true), 10000);
    return () => clearTimeout(timer);
  }, [expanded]);

  // Delayed attention glow on "Explore More" button (10s on hero view)
  const [showExploreAttention, setShowExploreAttention] = useState(false);
  useEffect(() => {
    if (expanded) { setShowExploreAttention(false); return; }
    const timer = setTimeout(() => setShowExploreAttention(true), 10000);
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
        ? 'polygon(25rem 0, 100% 0, 100% 100%, 0 100%)'
        : 'polygon(0 0, 100% 0, calc(100% - 25rem) 100%, 0 100%)';
    }
    const D = Math.sqrt(DIAG_PX * DIAG_PX + H * H); // diagonal length
    const R = CURVE_R;
    // Unit vector along diagonal
    const dx = DIAG_PX / D;
    const dy = H / D;

    if (language === 'ar') {
      // RTL: corners at (DIAG_PX, 0) top and (0, H) bottom
      const tStartX = DIAG_PX + R;
      const tEndX = DIAG_PX - dx * R;
      const tEndY = dy * R;
      const bStartX = dx * R;
      const bStartY = H - dy * R;
      const bEndX = R;
      return `path('M ${tStartX} 0 L ${W} 0 L ${W} ${H} L ${bEndX} ${H} Q 0 ${H} ${bStartX} ${bStartY} L ${tEndX} ${tEndY} Q ${DIAG_PX} 0 ${tStartX} 0 Z')`;
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
                  <div className="w-14 h-14 mx-auto mb-3 border border-white/20 rounded-lg flex items-center justify-center">
                    {key === 'diameterRange' || key === 'crossSection' ? <Ruler className="text-white/70" size={24} /> :
                     key === 'standards' || key === 'chemicalControl' ? <Shield className="text-white/70" size={24} /> :
                     <Package className="text-white/70" size={24} />}
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1">{icon.title}</h4>
                  <p className="text-white/60 text-xs">{icon.value}</p>
                </div>
              ))}
            </div>

            {/* Key Highlights */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">{t('products.overview.keyHighlights')}</h3>
              <ul className="space-y-2">
                {(t(`products.${productKey}.highlights`, { returnObjects: true }) as string[]).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-white/80 text-sm">
                    <CheckCircle className="text-primary shrink-0 mt-0.5" size={16} />
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
            <p className="text-white/50 text-sm italic mt-4">{t('products.specNote')}</p>
          </div>
        );

      case 'features':
        return (
          <MagicCardGrid className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.entries(t(`products.${productKey}.features`, { returnObjects: true }) as Record<string, { title: string; description: string }>).map(([key, feature]) => {
              const Icon = featureIcons[key] ?? Zap;
              return (
                <MagicCard key={key} className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="text-primary" size={20} />
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
              className="inline-flex items-center px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-full font-medium transition-colors"
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
      <section className="relative flex flex-col lg:flex-row min-h-screen overflow-hidden bg-linear-to-r from-gray-900 to-gray-800">
        {/* LEFT PANEL — Featured Product (wrapper for drop-shadow along diagonal) */}
        <div
          className="relative z-10"
          style={{
            flex: leftFlex,
            transition: 'flex 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: isLg ? `drop-shadow(${language === 'ar' ? '-4px' : '4px'} 0px 6px rgba(0, 0, 0, 0.4))` : undefined,
          }}
        >
        <div
          ref={leftPanelRef}
          className="h-full overflow-hidden lg:bg-linear-to-r lg:from-gray-900 lg:to-gray-800"
          style={{
            clipPath: leftClipPath,
            backgroundSize: isLg ? '100vw 100%' : undefined,
          }}
        >
          <div className={`h-full flex flex-col lg:flex-row ${expanded ? 'lg:overflow-hidden' : ''}`}>
            {/* Text Content — left side of the left panel */}
            <div className={`flex-1 flex flex-col p-8 lg:p-12 xl:ps-16 xl:pe-8 ${expanded ? 'lg:overflow-y-auto scrollbar-thin justify-start pt-28!' : 'justify-center pt-24 lg:pt-0'}`}>
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
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 uppercase tracking-wide">
                      {getName(selectedProduct)}
                    </h2>
                    <p className="text-white/70 leading-relaxed mb-8 text-sm lg:text-base">
                      {getShortDesc(selectedProduct)}
                    </p>
                    <button
                      onClick={handleExplore}
                      className={`inline-flex items-center px-8 py-3 rounded-full border text-white transition-all cursor-pointer group ${
                        showExploreAttention
                          ? 'border-primary/60 bg-white/10 animate-ring-pulse'
                          : 'border-white/30 hover:bg-white/10'
                      }`}
                    >
                      {t('products.exploreMore')}
                      <ArrowRight className="ms-2 rtl:rotate-180 group-hover:translate-x-1 transition-transform" size={18} />
                    </button>
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
                    <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-6 uppercase tracking-wide">
                      {getName(selectedProduct)}
                    </h2>

                    <ProductTabs activeTab={activeTab} onTabChange={setActiveTab} />

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

                    {/* Mobile: Image + Back button (only visible below lg) */}
                    <div className="lg:hidden flex items-end justify-between mt-12 pb-4">
                      <button
                        onClick={handleBack}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 hover:bg-white/10 text-xs font-medium transition-all cursor-pointer group"
                      >
                        <LayoutGrid size={12} className="text-white/50 group-hover:text-white/70" />
                        {t('products.backToProducts')}
                        <ArrowRight className="-rotate-90 group-hover:-translate-y-0.5 transition-transform" size={12} />
                      </button>
                      <div className="flex items-end justify-end">
                        {selectedProduct.image ? (
                          <img
                            src={selectedProduct.image}
                            alt={getName(selectedProduct)}
                            className="max-h-28 w-auto object-contain drop-shadow-2xl"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                            <Package className="text-white/20" size={24} />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Large Product Image — absolutely positioned over both panels, near the diagonal */}
        {!expanded && (
          <div className="hidden lg:flex absolute z-20 bottom-16 items-end justify-center pointer-events-none max-w-[30%] -translate-x-1/2 left-[35%] xl:left-[40%] 2xl:left-[45%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`img-${selectedSlug}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                {selectedProduct.image ? (
                  <img
                    src={selectedProduct.image}
                    alt={getName(selectedProduct)}
                    className="max-h-36 xl:max-h-44 2xl:max-h-56 w-auto object-contain drop-shadow-2xl"
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
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all cursor-pointer group ${
                showAttention
                  ? 'border-primary/60 text-white bg-white/10 animate-ring-pulse'
                  : 'border-white/20 text-white/70 hover:text-white hover:border-white/40 hover:bg-white/10'
              }`}
            >
              <LayoutGrid size={15} className={showAttention ? 'text-primary' : 'text-white/50 group-hover:text-white/70'} />
              {t('products.backToProducts')}
              <ArrowLeft className="rtl:rotate-180 group-hover:-translate-x-1 transition-transform" size={15} />
            </motion.button>
          </div>
        )}

        {/* Expanded Product Image — absolutely positioned, bottom-right, floats above the panel */}
        {expanded && (
          <div className="hidden lg:flex absolute z-20 bottom-8 end-[15%] min-[1280px]:end-[12%] min-[1536px]:end-[8%] min-[1800px]:end-[5%] pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={`expanded-img-${selectedSlug}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                {selectedProduct.image ? (
                  <img
                    src={selectedProduct.image}
                    alt={getName(selectedProduct)}
                    className="max-h-48 xl:max-h-60 w-auto object-contain drop-shadow-2xl"
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
          className={`relative overflow-hidden lg:bg-linear-to-br lg:from-gray-800 lg:to-gray-700 lg:-ms-120 ${expanded ? 'hidden lg:block' : ''}`}
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
                {/* Mobile: Featured product image filling the space */}
                <div className="flex-1 flex items-center justify-center pb-20 lg:hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`mobile-img-${selectedSlug}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                    >
                      {selectedProduct.image ? (
                        <img
                          src={selectedProduct.image}
                          alt={getName(selectedProduct)}
                          className="max-h-52 w-auto object-contain drop-shadow-2xl"
                        />
                      ) : (
                        <div className="w-40 h-40 rounded-full bg-white/5 flex items-center justify-center">
                          <Package className="text-white/20" size={56} />
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Mobile navigation — next product button */}
                <div className="flex lg:hidden items-center justify-center mb-3">
                  <button
                    onClick={() => {
                      const idx = products.findIndex(p => p.slug === selectedSlug);
                      const next = (idx + 1) % products.length;
                      handleSelectProduct(products[next].slug);
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-2 rounded-full border border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-colors cursor-pointer text-sm uppercase tracking-wider"
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

                {/* Mobile: Product thumbnails — horizontal at bottom */}
                <div className="flex lg:hidden items-center justify-center gap-4 pb-4 w-full max-w-full px-2">
                  {products.map((product) => (
                    <button
                      key={product.slug}
                      onClick={() => handleSelectProduct(product.slug)}
                      className={`group relative flex-1 min-w-0 max-w-52 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
                        product.slug === selectedSlug
                          ? 'ring-2 ring-white/40 shadow-2xl shadow-black/30 scale-105'
                          : 'opacity-40 hover:opacity-70 hover:scale-102'
                      }`}
                    >
                      <div className="aspect-4/3 bg-gray-800/50 flex items-center justify-center">
                        {product.image ? (
                          <img src={product.image} alt={getName(product)} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-gray-600 to-gray-500 flex items-center justify-center">
                            <Package className="text-white/30" size={36} />
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 to-transparent px-3 py-2">
                        <h3 className="text-white font-bold text-xs uppercase tracking-wider">
                          {getName(product)}
                        </h3>
                      </div>
                      {product.slug === selectedSlug && (
                        <div className="absolute top-0 inset-x-0 h-0.5 bg-primary hidden lg:block" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Desktop: Product thumbnails — stacked vertically, far right, centered */}
                <div className="hidden lg:flex flex-col items-end justify-center h-full w-full pe-0 lg:pe-10 xl:pe-30 2xl:pe-30 3xl:pe-40 gap-4">
                  {products.map((product) => (
                    <button
                      key={product.slug}
                      onClick={() => handleSelectProduct(product.slug)}
                      className={`group relative w-24 xl:w-40 2xl:w-56 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
                        product.slug === selectedSlug
                          ? 'ring-2 ring-white/40 shadow-2xl shadow-black/30 scale-105'
                          : 'opacity-40 hover:opacity-70 hover:scale-102'
                      }`}
                    >
                      <div className="aspect-4/3 bg-gray-800/50 flex items-center justify-center">
                        {product.image ? (
                          <img src={product.image} alt={getName(product)} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-gray-600 to-gray-500 flex items-center justify-center">
                            <Package className="text-white/30" size={36} />
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 to-transparent px-3 py-2">
                        <h3 className="text-white font-bold text-xs uppercase tracking-wider text-center">
                          {getName(product)}
                        </h3>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Navigation button — positioned at bottom-right, independent of thumbnails */}
                <div className="hidden lg:flex absolute bottom-8 end-0 pe-10 xl:pe-30 2xl:pe-30 3xl:pe-40">
                  <button
                    onClick={() => {
                      const idx = products.findIndex(p => p.slug === selectedSlug);
                      const next = (idx + 1) % products.length;
                      handleSelectProduct(products[next].slug);
                    }}
                    className="w-44 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-colors cursor-pointer text-sm uppercase tracking-wider"
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
