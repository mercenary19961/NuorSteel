# Core Values Section — V1 Implementation (Backup)

Saved before replacing with RadialOrbitalTimeline component.

## Data Definition (Home.tsx, inside component)

```tsx
const coreValues = [
  {
    key: 'quality',
    icon: ShieldCheck,
    title: content?.core_values?.quality_title || t('home.coreValues.quality.title'),
    description: content?.core_values?.quality_description || t('home.coreValues.quality.description'),
    position: 'top-[12%] right-[10%]',
  },
  {
    key: 'sustainability',
    icon: Leaf,
    title: content?.core_values?.sustainability_title || t('home.coreValues.sustainability.title'),
    description: content?.core_values?.sustainability_description || t('home.coreValues.sustainability.description'),
    position: 'top-[35%] left-[8%]',
  },
  {
    key: 'innovation',
    icon: Lightbulb,
    title: content?.core_values?.innovation_title || t('home.coreValues.innovation.title'),
    description: content?.core_values?.innovation_description || t('home.coreValues.innovation.description'),
    position: 'bottom-[25%] left-[30%]',
  },
  {
    key: 'strategicGrowth',
    icon: TrendingUp,
    title: content?.core_values?.strategic_growth_title || t('home.coreValues.strategicGrowth.title'),
    description: content?.core_values?.strategic_growth_description || t('home.coreValues.strategicGrowth.description'),
    position: 'bottom-[8%] right-[15%]',
  },
];
```

## State

```tsx
const [activeValue, setActiveValue] = useState(0);
```

## JSX Section

```tsx
{/* Core Values Section */}
<section id="section-core-values" className="py-16 lg:py-24 bg-gray-950">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left: Text Content */}
      <div>
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-10">
          {content?.core_values?.title || t('home.coreValues.title')}
        </h2>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeValue}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-semibold text-primary mb-4">
              {coreValues[activeValue].title}
            </h3>
            <p className="text-lg text-white/70 leading-relaxed">
              {coreValues[activeValue].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right: Image with Overlaid Buttons */}
      <div className="relative aspect-4/3 rounded-xl overflow-hidden">
        {/* Gradient Placeholder */}
        <div className="absolute inset-0 bg-linear-to-br from-gray-700 via-gray-600 to-gray-500" />

        {/* Overlay Buttons */}
        {coreValues.map((value, index) => (
          <button
            key={index}
            onClick={() => setActiveValue(index)}
            className={`absolute flex flex-col items-center gap-1.5 group transition-all duration-300 ${value.position}`}
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                activeValue === index
                  ? 'bg-primary ring-4 ring-primary/30 scale-110'
                  : 'bg-white/20 backdrop-blur-sm hover:bg-white/30'
              }`}
            >
              <value.icon
                size={24}
                className={activeValue === index ? 'text-white' : 'text-white/80'}
              />
            </div>
            <span
              className={`text-xs font-medium whitespace-nowrap transition-colors duration-300 ${
                activeValue === index ? 'text-primary' : 'text-white/60'
              }`}
            >
              {value.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  </div>
</section>
```

## Description

Two-column layout:
- **Left**: Section title + animated text (AnimatePresence crossfade) showing active value's title & description
- **Right**: Gradient placeholder image (aspect-4/3) with 4 circular icon buttons overlaid at absolute positions. Clicking a button switches the active value text on the left.

Uses: `useState(0)` for activeValue, `framer-motion` AnimatePresence for text transitions, Lucide icons (ShieldCheck, Leaf, Lightbulb, TrendingUp).
