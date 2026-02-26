import { useState, useEffect, useRef } from 'react';

interface ScrollDirectionState {
    scrollDirection: 'up' | 'down';
    scrollY: number;
    isAtTop: boolean;
}

export function useScrollDirection(threshold = 10): ScrollDirectionState {
    const [state, setState] = useState<ScrollDirectionState>({
        scrollDirection: 'up',
        scrollY: 0,
        isAtTop: true,
    });

    const lastScrollY = useRef(0);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        lastScrollY.current = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const atTop = currentScrollY <= 100;
            const diff = currentScrollY - lastScrollY.current;

            // Always update when at top (so header reappears reliably)
            if (!atTop && Math.abs(diff) < threshold) return;

            setState({
                scrollDirection: diff > 0 ? 'down' : 'up',
                scrollY: currentScrollY,
                isAtTop: atTop,
            });

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    return state;
}
