import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [orbitRadius, setOrbitRadius] = useState<number>(250);
  const [nodeSize, setNodeSize] = useState<number>(40);
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateSizes = () => {
      const w = window.innerWidth;
      setOrbitRadius(w < 640 ? 140 : w < 1024 ? 200 : w < 1280 ? 280 : 320);
      setNodeSize(w < 640 ? 40 : w < 1024 ? 40 : 56);
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

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);

        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let rotationTimer: ReturnType<typeof setInterval>;

    if (autoRotate) {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.3) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }

    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
      }
    };
  }, [autoRotate]);

  const centerViewOnNode = (nodeId: number) => {
    if (!nodeRefs.current[nodeId]) return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    setRotationAngle(270 - targetAngle);
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
      Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
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
      className={`w-full h-150 lg:h-185 xl:h-200 overflow-hidden relative ${
        isDetailView
          ? 'flex flex-row items-center'
          : 'flex flex-col items-center justify-start lg:pt-8'
      }`}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      {/* Orbit side */}
      <div
        className={`relative h-full flex items-center justify-center transition-all duration-700 ${
          isDetailView ? 'w-1/2 shrink-0' : 'w-full max-w-4xl'
        }`}
      >
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
          }}
        >
          <div
            className={`absolute w-16 h-16 rounded-full bg-linear-to-br from-primary via-danger to-primary animate-pulse flex items-center justify-center z-10 transition-all duration-300 ${
              isDetailView ? 'cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-primary/40' : 'cursor-pointer hover:scale-105'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (isDetailView) {
                setExpandedItems({});
                setActiveNodeId(null);
                setPulseEffect({});
                setAutoRotate(true);
              } else {
                toggleItem(getTopNodeId());
              }
            }}
          >
            <div className="absolute w-20 h-20 rounded-full border border-white/20 animate-ping opacity-70"></div>
            <div
              className="absolute w-24 h-24 rounded-full border border-white/10 animate-ping opacity-50"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md"></div>
          </div>

          <div
            className="absolute rounded-full border border-white/10 transition-all duration-700"
            style={{ width: effectiveRadius * 2, height: effectiveRadius * 2 }}
          ></div>

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
                  rounded-full flex items-center justify-center
                  ${
                    isExpanded
                      ? "bg-primary text-white"
                      : isRelated
                      ? "bg-primary/50 text-white"
                      : "bg-black text-white"
                  }
                  border-2
                  ${
                    isExpanded
                      ? "border-primary shadow-lg shadow-primary/30"
                      : isRelated
                      ? "border-primary animate-pulse"
                      : "border-white/40"
                  }
                  transition-all duration-300 transform
                  ${isExpanded ? "scale-150" : ""}
                `}
                  style={{ width: effectiveNodeSize, height: effectiveNodeSize }}
                >
                  <Icon size={effectiveNodeSize < 56 ? 16 : 22} />
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
                    <Card className="magic-card w-48 sm:w-64 bg-black/90 backdrop-blur-lg border-white/10 shadow-xl shadow-primary/10 overflow-visible">
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
        className={`hidden lg:flex items-center transition-all duration-700 overflow-hidden ${
          isDetailView ? 'w-1/2 opacity-100 px-8 xl:px-12' : 'w-0 opacity-0'
        }`}
      >
        {activeItem && (
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                <activeItem.icon size={20} className="text-white" />
              </div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                {activeItem.category}
              </span>
            </div>
            <h3 className="text-2xl xl:text-3xl font-bold text-white mb-4">
              {activeItem.title}
            </h3>
            <p className="text-base xl:text-lg text-white/70 leading-relaxed">
              {activeItem.content}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
