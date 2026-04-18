import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { MagicCard } from "@/Components/ui/magic-card";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  image?: string;
  imageBg?: boolean;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
  centerImage?: string;
  scrollStep?: number; // 0 = idle/auto-rotate, 1–N = show Nth value
}

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function RadialOrbitalTimeline({
  timelineData,
  centerImage,
  scrollStep,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [orbitRadius, setOrbitRadius] = useState<number>(250);
  const [containerHeight, setContainerHeight] = useState<string>('37.5rem');
  const [nodeSize, setNodeSize] = useState<number>(40);
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Auto-cycle & traveling dot state
  const [travelDot, setTravelDot] = useState<{
    fromIndex: number;
    toIndex: number;
    progress: number;
  } | null>(null);
  const cyclePausedRef = useRef(false);
  const [detailHovered, setDetailHovered] = useState(false);
  const pauseOffsetRef = useRef(0);
  const travelAnimRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateSizes = () => {
      const w = window.innerWidth;
      setOrbitRadius(w < 640 ? 140 : w < 1024 ? 200 : w < 1280 ? 180 : w <= 1536 ? 240 : 320);
      setContainerHeight(w < 1024 ? '37.5rem' : w <= 1536 ? '40rem' : '50rem');
      setNodeSize(w < 640 ? 40 : w < 1024 ? 40 : 72);
      setIsLargeScreen(w >= 1024);
    };
    updateSizes();
    window.addEventListener('resize', updateSizes);
    return () => window.removeEventListener('resize', updateSizes);
  }, []);

  const isDetailView = activeNodeId !== null && isLargeScreen;
  const activeItem = activeNodeId !== null
    ? timelineData.find((item) => item.id === activeNodeId) ?? null
    : null;

  // Shrink orbit when in detail view
  const effectiveRadius = isDetailView ? 220 : orbitRadius;
  const effectiveNodeSize = isDetailView ? 48 : nodeSize;

  // Cancel any in-flight traveling dot animation
  const cancelTravelDot = useCallback(() => {
    if (travelAnimRef.current) {
      cancelAnimationFrame(travelAnimRef.current);
      travelAnimRef.current = null;
    }
    setTravelDot(null);
  }, []);

  // Self-chaining dot cycle (ref avoids useEffect chain and double-trigger)
  const startCycleRef = useRef<(fromIdx: number, toIdx: number) => void>(undefined);
  startCycleRef.current = (fromIdx: number, toIdx: number) => {
    cancelTravelDot();
    cyclePausedRef.current = false;
    pauseOffsetRef.current = 0;
    const duration = 8000;
    let startTime = performance.now();

    const animate = (now: number) => {
      if (cyclePausedRef.current) {
        if (pauseOffsetRef.current === 0) pauseOffsetRef.current = now;
        travelAnimRef.current = requestAnimationFrame(animate);
        return;
      }
      if (pauseOffsetRef.current > 0) {
        startTime += now - pauseOffsetRef.current;
        pauseOffsetRef.current = 0;
      }
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setTravelDot({ fromIndex: fromIdx, toIndex: toIdx, progress });

      if (progress < 1) {
        travelAnimRef.current = requestAnimationFrame(animate);
      } else {
        travelAnimRef.current = null;
        setTravelDot(null);

        // Select the target node inline (avoids useEffect → double cycle)
        const targetId = timelineData[toIdx].id;
        const newExpanded: Record<number, boolean> = {};
        timelineData.forEach((item) => { newExpanded[item.id] = item.id === targetId; });
        setExpandedItems(newExpanded);
        setActiveNodeId(targetId);
        setAutoRotate(false);

        const relatedItems = timelineData.find((item) => item.id === targetId)?.relatedIds ?? [];
        const newPulse: Record<number, boolean> = {};
        relatedItems.forEach((relId) => { newPulse[relId] = true; });
        setPulseEffect(newPulse);
        centerViewOnNode(targetId);

        // Chain to next node
        const nextIdx = (toIdx + 1) % timelineData.length;
        startCycleRef.current?.(toIdx, nextIdx);
      }
    };

    travelAnimRef.current = requestAnimationFrame(animate);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (travelAnimRef.current) {
        cancelAnimationFrame(travelAnimRef.current);
      }
    };
  }, []);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      cancelTravelDot();

      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    cancelTravelDot();

    const isExpanding = !expandedItems[id];
    const newState: Record<number, boolean> = {};
    timelineData.forEach((item) => {
      newState[item.id] = item.id === id ? isExpanding : false;
    });
    setExpandedItems(newState);

    if (isExpanding) {
      setActiveNodeId(id);
      setAutoRotate(false);

      const relatedItems = getRelatedItems(id);
      const newPulseEffect: Record<number, boolean> = {};
      relatedItems.forEach((relId) => {
        newPulseEffect[relId] = true;
      });
      setPulseEffect(newPulseEffect);

      centerViewOnNode(id);

      // Start auto-cycle dot
      const currentIdx = timelineData.findIndex((item) => item.id === id);
      if (currentIdx !== -1) {
        const nextIdx = (currentIdx + 1) % timelineData.length;
        startCycleRef.current?.(currentIdx, nextIdx);
      }
    } else {
      setActiveNodeId(null);
      setAutoRotate(true);
      setPulseEffect({});
    }
  };

  const rotationRef = useRef(rotationAngle);
  const rotationRafRef = useRef<number | null>(null);
  const lastRotationTimeRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (autoRotate) {
      lastRotationTimeRef.current = performance.now();

      const animate = (now: number) => {
        const delta = now - lastRotationTimeRef.current;
        lastRotationTimeRef.current = now;
        // 0.3 degrees per 50ms = 6 degrees per second
        rotationRef.current = (rotationRef.current + (delta * 6) / 1000) % 360;
        setRotationAngle(rotationRef.current);
        rotationRafRef.current = requestAnimationFrame(animate);
      };

      rotationRafRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (rotationRafRef.current) {
        cancelAnimationFrame(rotationRafRef.current);
        rotationRafRef.current = null;
      }
    };
  }, [autoRotate]);

  // Scroll-driven step control
  const prevScrollStepRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (scrollStep === undefined) return;
    if (scrollStep === prevScrollStepRef.current) return;
    prevScrollStepRef.current = scrollStep;

    if (scrollStep === 0) {
      cancelTravelDot();
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    } else {
      const idx = scrollStep - 1;
      if (idx < 0 || idx >= timelineData.length) return;
      const targetItem = timelineData[idx];

      cancelTravelDot();
      setAutoRotate(false);

      const newState: Record<number, boolean> = {};
      timelineData.forEach((item) => {
        newState[item.id] = item.id === targetItem.id;
      });
      setExpandedItems(newState);
      setActiveNodeId(targetItem.id);

      const related = targetItem.relatedIds ?? [];
      const newPulse: Record<number, boolean> = {};
      related.forEach((relId) => { newPulse[relId] = true; });
      setPulseEffect(newPulse);

      centerViewOnNode(targetItem.id);

      // Start auto-cycle from this node (scroll will cancel & restart on next step)
      const nextIdx = (idx + 1) % timelineData.length;
      startCycleRef.current?.(idx, nextIdx);
    }
  }, [scrollStep]);

  const centerViewOnNode = (nodeId: number) => {
    if (!nodeRefs.current[nodeId]) return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    const newAngle = 270 - targetAngle;
    rotationRef.current = newAngle;
    setRotationAngle(newAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = effectiveRadius;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.4,
      Math.min(1, 0.4 + 0.6 * ((1 - Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const getTopNodeId = (): number => {
    const total = timelineData.length;
    let closestId = timelineData[0].id;
    let closestDist = Infinity;
    for (let i = 0; i < total; i++) {
      const angle = ((i / total) * 360 + rotationAngle) % 360;
      // Distance to 270° (top), wrapping around 360
      const dist = Math.min(Math.abs(angle - 270), 360 - Math.abs(angle - 270));
      if (dist < closestDist) {
        closestDist = dist;
        closestId = timelineData[i].id;
      }
    }
    return closestId;
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  return (
    <div
      className="w-full overflow-hidden relative flex flex-col lg:flex-row items-center"
      style={{ height: containerHeight }}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      {/* Orbit side */}
      <div
        className="relative h-full flex items-center justify-center transition-all duration-700 ease-in-out"
        style={{ width: isDetailView ? '50%' : '100%' }}
      >
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
          }}
        >
          <div
            className={`absolute w-32 h-32 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
              centerImage
                ? ''
                : 'bg-linear-to-br from-primary via-danger to-primary animate-pulse'
            } ${
              isDetailView ? 'cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-primary/40' : 'cursor-pointer hover:scale-105'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (isDetailView) {
                cancelTravelDot();
          
                setExpandedItems({});
                setActiveNodeId(null);
                setPulseEffect({});
                setAutoRotate(true);
              } else {
                toggleItem(getTopNodeId());
              }
            }}
          >
            <div className="absolute w-36 h-36 rounded-full border-2 border-primary/30 animate-ping opacity-60"></div>
            <div
              className="absolute w-44 h-44 rounded-full border border-primary/15 animate-ping opacity-40"
              style={{ animationDelay: "0.7s", animationDuration: "1.5s" }}
            ></div>
            <div className="absolute w-36 h-36 rounded-full bg-primary/5 animate-pulse"></div>
            {centerImage ? (
              <img src={centerImage} alt="" className="w-32 h-32 object-contain" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md"></div>
            )}
          </div>

          <div
            className="absolute rounded-full border border-white/10 transition-all duration-700"
            style={{ width: effectiveRadius * 2, height: effectiveRadius * 2 }}
          ></div>

          {/* Traveling dot */}
          {travelDot && (() => {
            const total = timelineData.length;
            const fromAngle = ((travelDot.fromIndex / total) * 360 + rotationAngle) % 360;
            let toAngle = ((travelDot.toIndex / total) * 360 + rotationAngle) % 360;
            // Ensure clockwise: toAngle should be greater than fromAngle
            let angleDiff = toAngle - fromAngle;
            if (angleDiff <= 0) angleDiff += 360;
            const currentAngle = fromAngle + angleDiff * easeInOutCubic(travelDot.progress);
            const radian = (currentAngle * Math.PI) / 180;
            const dotX = effectiveRadius * Math.cos(radian);
            const dotY = effectiveRadius * Math.sin(radian);

            // Fade in during first 1.5s (0–0.1875), fade out during last 3s (0.625–1.0)
            const p = travelDot.progress;
            const dotOpacity = p < 0.1875 ? p / 0.1875 : p > 0.625 ? (1 - p) / 0.375 : 1;

            return (
              <div
                className={`absolute rounded-full bg-primary z-150 pointer-events-none ${detailHovered ? 'animate-pulse' : ''}`}
                style={{
                  width: detailHovered ? '1rem' : '0.75rem',
                  height: detailHovered ? '1rem' : '0.75rem',
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${dotX}px), calc(-50% + ${dotY}px))`,
                  opacity: dotOpacity,
                  transition: 'width 300ms ease, height 300ms ease, box-shadow 300ms ease',
                  boxShadow: detailHovered
                    ? '0 0 14px 5px rgba(255,122,0,0.8), 0 0 28px 10px rgba(255,122,0,0.4)'
                    : '0 0 10px 3px rgba(255,122,0,0.6), 0 0 20px 6px rgba(255,122,0,0.3)',
                }}
              />
            );
          })()}

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => { nodeRefs.current[item.id] = el; }}
                className={`absolute cursor-pointer ${autoRotate ? '' : 'transition-all duration-700'}`}
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                <div
                  className={`absolute rounded-full -inset-1 ${
                    isPulsing ? "animate-pulse duration-1000" : ""
                  }`}
                  style={{
                    background: `radial-gradient(circle, rgba(255,122,0,0.2) 0%, rgba(255,122,0,0) 70%)`,
                    width: `${item.energy * 0.5 + effectiveNodeSize}px`,
                    height: `${item.energy * 0.5 + effectiveNodeSize}px`,
                    left: `-${(item.energy * 0.5) / 2}px`,
                    top: `-${(item.energy * 0.5) / 2}px`,
                  }}
                ></div>

                <div
                  className={`
                  rounded-full flex items-center justify-center overflow-hidden
                  ${item.image
                    ? `${item.imageBg ? 'bg-primary' : ''} ${
                        isExpanded
                          ? "shadow-lg shadow-primary/30"
                          : ""
                      }`
                    : `${
                        isExpanded
                          ? "bg-primary text-white"
                          : isRelated
                          ? "bg-primary/50 text-white"
                          : "bg-surface-dark text-white"
                      }
                      border-2
                      ${
                        isExpanded
                          ? "border-primary shadow-lg shadow-primary/30"
                          : isRelated
                          ? "border-primary animate-pulse"
                          : "border-white/40"
                      }`
                  }
                  transition-all duration-300 transform
                  ${isExpanded ? "scale-150" : ""}
                `}
                  style={{ width: effectiveNodeSize, height: effectiveNodeSize }}
                >
                  {item.image ? (
                    <img src={item.image} alt={item.title} className={`object-cover ${item.imageBg ? 'w-3/4 h-3/4' : 'w-full h-full'}`} />
                  ) : (
                    <Icon size={effectiveNodeSize < 56 ? 16 : 22} />
                  )}
                </div>

                <div
                  className={`
                  absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center
                  font-semibold tracking-wider
                  transition-all duration-300
                  ${isExpanded ? "text-white scale-125" : "text-white/70"}
                `}
                  style={{ top: effectiveNodeSize + 16, fontSize: effectiveNodeSize < 56 ? 12 : 13 }}
                >
                  {item.title}
                </div>

                {/* Small card below node — mobile/tablet only (detail panel replaces it on lg+) */}
                {isExpanded && !isDetailView && (
                  <div className="absolute left-1/2 -translate-x-1/2" style={{ top: effectiveNodeSize + 72 }}>
                    <Card className="magic-card w-48 sm:w-64 bg-surface-dark/90 backdrop-blur-lg border-white/10 shadow-xl shadow-primary/10 overflow-visible">
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-px h-10 bg-white/50 z-10"></div>
                      <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm text-white">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs text-white/80 relative z-10">
                        <p>{item.content}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail panel — lg+ only */}
      <div
        className="hidden lg:flex items-center overflow-hidden"
        style={{
          width: isDetailView ? '50%' : '0%',
          opacity: isDetailView ? 1 : 0,
          paddingLeft: isDetailView ? '2rem' : '0',
          paddingRight: isDetailView ? '3rem' : '0',
          transition: isDetailView
            ? 'width 700ms ease-in-out, padding 700ms ease-in-out, opacity 500ms ease-in 200ms'
            : 'opacity 300ms ease-out, width 700ms ease-in-out 100ms, padding 700ms ease-in-out 100ms',
        }}
        onMouseEnter={() => { cyclePausedRef.current = true; setDetailHovered(true); }}
        onMouseLeave={() => { cyclePausedRef.current = false; setDetailHovered(false); }}
      >
        {activeItem && (
          <div
            key={activeItem.id}
            style={{ animation: 'detailSlideUp 500ms ease-out both' }}
          >
          <MagicCard
            className="max-w-lg w-full rounded-2xl bg-surface-dark border border-white/10 shadow-2xl shadow-black/40 p-8 xl:p-10"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl xl:text-3xl font-bold text-white">
                  {activeItem.title}
                </h3>
                <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center overflow-hidden shrink-0">
                  {activeItem.image ? (
                    <img src={activeItem.image} alt={activeItem.title} className="w-full h-full object-cover" />
                  ) : (
                    <activeItem.icon size={20} className="text-primary" />
                  )}
                </div>
              </div>
              <div className="w-12 h-0.5 bg-primary/40 rounded-full mb-4" />
              <p className="text-base xl:text-lg text-white/70 leading-relaxed">
                {activeItem.content}
              </p>
            </div>
          </MagicCard>
          </div>
        )}
      </div>
    </div>
  );
}
