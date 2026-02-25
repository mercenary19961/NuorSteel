import { motion, useInView, type Variants } from 'framer-motion';
import { type ReactNode, type RefObject } from 'react';

type SupportedTag = 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'button';

const motionMap = {
  div: motion.div,
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  button: motion.button,
} as const;

interface TimelineContentProps {
  as?: SupportedTag;
  animationNum: number;
  timelineRef: RefObject<HTMLElement | null>;
  customVariants?: Variants;
  className?: string;
  children: ReactNode;
}

export function TimelineContent({
  as = 'div',
  animationNum,
  timelineRef,
  customVariants,
  className,
  children,
}: TimelineContentProps) {
  const isInView = useInView(timelineRef, { once: true, margin: '-10%' });
  const MotionComponent = motionMap[as];

  return (
    <MotionComponent
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={customVariants}
      custom={animationNum}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}
