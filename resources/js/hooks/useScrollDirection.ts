import { useState, useEffect, useRef } from 'react';

interface ScrollDirectionState {
    scrollDirection: 'up' | 'down';
    scrollY: number;
    isAtTop: boolean;
    isAtBottom: boolean;
    isIdle: boolean;
}

export function useScrollDirection(threshold = 10, idleTimeout = 3000): ScrollDirectionState {
    const [state, setState] = useState<ScrollDirectionState>({
        scrollDirection: 'up',
        scrollY: 0,
        isAtTop: true,
        isAtBottom: false,
        isIdle: false,
    });

    const lastScrollY = useRef(0);
    const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        lastScrollY.current = window.scrollY;

        const startIdleTimer = (atTop: boolean) => {
            if (idleTimer.current) clearTimeout(idleTimer.current);
            if (atTop) return; // Don't auto-hide at top
            idleTimer.current = setTimeout(() => {
                setState((prev) => ({ ...prev, isIdle: true }));
            }, idleTimeout);
        };

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const atTop = currentScrollY <= 100;
            const atBottom = (window.innerHeight + currentScrollY) >= (document.documentElement.scrollHeight - 100);
            const diff = currentScrollY - lastScrollY.current;

            // Always update when at top or bottom (so header reappears reliably)
            if (!atTop && !atBottom && Math.abs(diff) < threshold) return;

            setState({
                scrollDirection: diff > 0 ? 'down' : 'up',
                scrollY: currentScrollY,
                isAtTop: atTop,
                isAtBottom: atBottom,
                isIdle: false,
            });

            lastScrollY.current = currentScrollY;

            startIdleTimer(atTop);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (idleTimer.current) clearTimeout(idleTimer.current);
        };
    }, [threshold, idleTimeout]);

    return state;
}
