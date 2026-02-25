import { useLayoutEffect, useEffect, useRef, useCallback, type ReactNode } from 'react';
import Lenis from 'lenis';
import { cn } from '@/lib/utils';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface ScrollStackItemProps {
  children: ReactNode;
  className?: string;
}

export function ScrollStackItem({ children, className }: ScrollStackItemProps) {
  return (
    <div className={cn('scroll-stack-card', className)}>
      {children}
    </div>
  );
}

export interface ScrollStackProps {
  children: ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  /** How much scroll distance (in vh units) each card gets. Default 80. */
  scrollPerCard?: number;
  onStackComplete?: () => void;
}

export default function ScrollStack({
  children,
  className,
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  scrollPerCard = 80,
  onStackComplete,
}: ScrollStackProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const lastTransformsRef = useRef(new Map<number, { translateY: number; scale: number; rotation: number; blur: number }>());
  const isUpdatingRef = useRef(false);
  const cachedSectionTopRef = useRef<number>(0);

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(String(value));
  }, []);

  // ──────────────────────────────────────────────────
  // Container-scroll helpers
  // ──────────────────────────────────────────────────
  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  // ──────────────────────────────────────────────────
  // Window-scroll mode: sticky viewport + progress-based animation
  // ──────────────────────────────────────────────────
  const updateWindowScrollCards = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    const scroller = scrollerRef.current;
    if (!scroller) { isUpdatingRef.current = false; return; }

    const scrollTop = window.scrollY;
    const vh = window.innerHeight;
    const sectionTop = cachedSectionTopRef.current;
    const sectionHeight = scroller.offsetHeight;
    const scrollRange = sectionHeight - vh;

    if (scrollRange <= 0) { isUpdatingRef.current = false; return; }

    const progress = Math.max(0, Math.min(1, (scrollTop - sectionTop) / scrollRange));

    const cardCount = cardsRef.current.length;
    const segmentSize = 1 / cardCount;
    const stackPx = parsePercentage(stackPosition, vh);

    let allStacked = true;

    cardsRef.current.forEach((card, i) => {
      const cardStart = i * segmentSize;
      const rawLocal = (progress - cardStart) / segmentSize;
      const enterProgress = Math.max(0, Math.min(1, rawLocal));

      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - enterProgress, 3);

      // Target Y when fully entered: stack position + offset for stacking
      const targetY = stackPx + itemStackDistance * i;
      // Start Y: below viewport
      const startY = vh;
      // Interpolate
      const currentY = startY + (targetY - startY) * eased;

      // Scale: cards on top push this card's scale down
      let scale = 1;
      for (let j = i + 1; j < cardCount; j++) {
        const jStart = j * segmentSize;
        const jLocal = (progress - jStart) / segmentSize;
        const jEnter = Math.max(0, Math.min(1, jLocal));
        if (jEnter > 0) {
          scale -= jEnter * itemScale;
        }
      }
      scale = Math.max(baseScale, scale);

      const rotation = rotationAmount && enterProgress >= 1
        ? i * rotationAmount
        : 0;

      let blur = 0;
      if (blurAmount && enterProgress >= 1) {
        let cardsOnTop = 0;
        for (let j = i + 1; j < cardCount; j++) {
          const jStart = j * segmentSize;
          const jLocal = (progress - jStart) / segmentSize;
          if (jLocal > 0) cardsOnTop++;
        }
        blur = cardsOnTop * blurAmount;
      }

      const newTransform = {
        translateY: Math.round(currentY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

        card.style.transform = transform;
        card.style.filter = filter;
        lastTransformsRef.current.set(i, newTransform);
      }

      if (enterProgress < 1) allStacked = false;
    });

    if (allStacked && !stackCompletedRef.current) {
      stackCompletedRef.current = true;
      onStackComplete?.();
    } else if (!allStacked && stackCompletedRef.current) {
      stackCompletedRef.current = false;
    }

    isUpdatingRef.current = false;
  }, [
    stackPosition,
    itemStackDistance,
    itemScale,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
    parsePercentage,
  ]);

  // ──────────────────────────────────────────────────
  // Container-scroll mode: original pinning logic with Lenis
  // ──────────────────────────────────────────────────
  const updateContainerScrollCards = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    const scroller = scrollerRef.current;
    if (!scroller) { isUpdatingRef.current = false; return; }

    const scrollTop = scroller.scrollTop;
    const containerHeight = scroller.clientHeight;
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    const endElement = scroller.querySelector('.scroll-stack-end') as HTMLElement | null;
    const endElementTop = endElement ? endElement.offsetTop : 0;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = card.offsetTop;
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCardTop = cardsRef.current[j].offsetTop;
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) topCardIndex = j;
        }
        if (i < topCardIndex) {
          blur = Math.max(0, (topCardIndex - i) * blurAmount);
        }
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';
        card.style.transform = transform;
        card.style.filter = filter;
        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
    calculateProgress,
    parsePercentage,
  ]);

  // ──────────────────────────────────────────────────
  // Setup effect
  // ──────────────────────────────────────────────────
  useIsomorphicLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(
      scroller.querySelectorAll<HTMLElement>('.scroll-stack-card'),
    );
    cardsRef.current = cards;

    if (useWindowScroll) {
      // ── Window scroll: sticky viewport mode ──
      const vh = window.innerHeight;

      // Set section height to create scroll distance
      const totalHeight = vh + cards.length * vh * (scrollPerCard / 100);
      scroller.style.height = `${totalHeight}px`;

      // Cache section's absolute offset
      cachedSectionTopRef.current = scroller.getBoundingClientRect().top + window.scrollY;

      // Position cards absolutely within the sticky viewport
      cards.forEach((card, i) => {
        card.style.position = 'absolute';
        card.style.top = '0';
        card.style.left = '0';
        card.style.right = '0';
        card.style.zIndex = String(i + 1);
        card.style.transform = `translate3d(0, ${vh}px, 0)`;
      });

      updateWindowScrollCards();

      const onScroll = () => {
        if (animationFrameRef.current) return;
        animationFrameRef.current = requestAnimationFrame(() => {
          updateWindowScrollCards();
          animationFrameRef.current = null;
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });

      const onResize = () => {
        cachedSectionTopRef.current = scroller.getBoundingClientRect().top + window.scrollY;
        const newVh = window.innerHeight;
        const newTotalHeight = newVh + cards.length * newVh * (scrollPerCard / 100);
        scroller.style.height = `${newTotalHeight}px`;
        updateWindowScrollCards();
      };
      window.addEventListener('resize', onResize, { passive: true });

      return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        scroller.style.height = '';
        cards.forEach((card) => {
          card.style.position = '';
          card.style.left = '';
          card.style.right = '';
          card.style.zIndex = '';
          card.style.transform = '';
          card.style.filter = '';
        });
        stackCompletedRef.current = false;
        cardsRef.current = [];
        lastTransformsRef.current.clear();
        isUpdatingRef.current = false;
      };
    } else {
      // ── Container scroll: Lenis-based pinning ──
      cards.forEach((card, i) => {
        if (i < cards.length - 1) {
          card.style.marginBottom = `${itemDistance}px`;
        }
        card.style.zIndex = String(i + 1);
      });

      const lenis = new Lenis({
        wrapper: scroller,
        content: scroller.querySelector('.scroll-stack-inner') as HTMLElement,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
      });

      lenis.on('scroll', () => updateContainerScrollCards());

      const raf = (time: number) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);
      lenisRef.current = lenis;

      updateContainerScrollCards();

      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        lenis.destroy();
        lenisRef.current = null;
        stackCompletedRef.current = false;
        cardsRef.current = [];
        lastTransformsRef.current.clear();
        isUpdatingRef.current = false;
      };
    }
  }, [itemDistance, useWindowScroll, scrollPerCard, updateWindowScrollCards, updateContainerScrollCards]);

  // ──────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────
  if (useWindowScroll) {
    return (
      <div ref={scrollerRef} className={cn('relative', className)}>
        <div className="sticky top-0 h-screen overflow-hidden">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'scroll-stack-scroller relative w-full h-full overflow-y-auto overflow-x-visible',
        className,
      )}
      ref={scrollerRef}
    >
      <div className="scroll-stack-inner pt-[20vh] px-20 pb-200">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
}
