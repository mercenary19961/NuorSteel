import { useEffect, useState, useRef } from 'react';

interface HeroTypewriterProps {
  lines: string[];
  cycleWords: string[];
  speed?: number;
  deleteSpeed?: number;
  cycleDelay?: number;
  cursorChar?: string;
  cycleClassName?: string;
  onTypingComplete?: () => void;
}

export function HeroTypewriter({
  lines,
  cycleWords,
  speed = 60,
  deleteSpeed = 40,
  cycleDelay = 4000,
  cursorChar = '|',
  cycleClassName,
  onTypingComplete,
}: HeroTypewriterProps) {
  const allTexts = [...lines, cycleWords[0]];

  const [charIndices, setCharIndices] = useState<number[]>(() => allTexts.map(() => 0));
  const [phase, setPhase] = useState<'typing' | 'waiting' | 'deleting' | 'retyping'>('typing');
  const [cycleWordIndex, setCycleWordIndex] = useState(0);
  const [cycleCharIndex, setCycleCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const completedRef = useRef(false);

  // Phase: typing — all lines advance one character per tick simultaneously
  useEffect(() => {
    if (typeof window === 'undefined' || phase !== 'typing') return;

    const allDone = allTexts.every((text, i) => charIndices[i] >= text.length);
    if (allDone) {
      if (!completedRef.current) {
        completedRef.current = true;
        onTypingComplete?.();
      }
      setCycleCharIndex(cycleWords[0].length);
      setPhase('waiting');
      return;
    }

    const timer = setTimeout(() => {
      setCharIndices((prev) =>
        prev.map((ci, i) => (ci < allTexts[i].length ? ci + 1 : ci))
      );
    }, speed);

    return () => clearTimeout(timer);
  }, [phase, charIndices, speed]);

  // Phase: waiting — pause before next cycle
  useEffect(() => {
    if (typeof window === 'undefined' || phase !== 'waiting') return;
    if (cycleWords.length <= 1) return;

    const timer = setTimeout(() => setPhase('deleting'), cycleDelay);
    return () => clearTimeout(timer);
  }, [phase, cycleDelay, cycleWords.length]);

  // Phase: deleting — remove characters one by one from the cycle word
  useEffect(() => {
    if (typeof window === 'undefined' || phase !== 'deleting') return;

    if (cycleCharIndex > 0) {
      const timer = setTimeout(() => setCycleCharIndex((c) => c - 1), deleteSpeed);
      return () => clearTimeout(timer);
    }

    // Word fully deleted → advance to next word and start retyping
    setCycleWordIndex((prev) => (prev + 1) % cycleWords.length);
    setPhase('retyping');
  }, [phase, cycleCharIndex, deleteSpeed, cycleWords.length]);

  // Phase: retyping — type the new cycle word character by character
  useEffect(() => {
    if (typeof window === 'undefined' || phase !== 'retyping') return;

    const currentWord = cycleWords[cycleWordIndex];
    if (cycleCharIndex < currentWord.length) {
      const timer = setTimeout(() => setCycleCharIndex((c) => c + 1), speed);
      return () => clearTimeout(timer);
    }

    setPhase('waiting');
  }, [phase, cycleCharIndex, speed, cycleWords, cycleWordIndex]);

  // Cursor blink
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const interval = setInterval(() => setShowCursor((prev) => !prev), 530);
    return () => clearInterval(interval);
  }, []);

  const cursor = (
    <span
      className="transition-opacity duration-75"
      style={{ opacity: showCursor ? 1 : 0 }}
      aria-hidden="true"
    >
      {cursorChar}
    </span>
  );

  const isInitialTyping = phase === 'typing';

  return (
    <>
      {/* Full text for SEO / screen readers */}
      <span className="sr-only">
        {lines.join(' ')} {cycleWords[0]}
      </span>

      <span aria-hidden="true">
        {lines.map((line, i) => {
          const chars = isInitialTyping ? charIndices[i] : line.length;
          const text = line.substring(0, chars);
          const lineComplete = chars >= line.length;
          const showLineCursor = isInitialTyping && !lineComplete;

          return (
            <span key={i} className="block">
              {text}
              {showLineCursor && cursor}
            </span>
          );
        })}

        {/* Cycle word line — cursor always visible */}
        <span className={`block ${cycleClassName || ''}`}>
          {isInitialTyping
            ? cycleWords[0].substring(0, charIndices[lines.length])
            : cycleWords[cycleWordIndex].substring(0, cycleCharIndex)}
          {cursor}
        </span>
      </span>
    </>
  );
}
