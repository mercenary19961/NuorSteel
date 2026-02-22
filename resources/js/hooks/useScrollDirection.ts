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
            const diff = currentScrollY - lastScrollY.current;

            if (Math.abs(diff) < threshold) return;

            setState({
                scrollDirection: diff > 0 ? 'down' : 'up',
                scrollY: currentScrollY,
                isAtTop: currentScrollY <= 5,
            });

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    return state;
}
