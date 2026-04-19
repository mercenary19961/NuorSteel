import { useEffect, useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: TurnstileOptions) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

interface TurnstileOptions {
  sitekey: string;
  callback?: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: (errorCode?: string) => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact' | 'flexible';
  appearance?: 'always' | 'execute' | 'interaction-only';
}

interface Props {
  onVerify?: (token: string) => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact' | 'flexible';
  appearance?: 'always' | 'execute' | 'interaction-only';
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit';
let scriptLoaded = false;
let scriptLoading = false;
const pendingLoadCallbacks: Array<() => void> = [];

function loadTurnstileScript(): Promise<void> {
  return new Promise((resolve) => {
    if (scriptLoaded || window.turnstile) {
      resolve();
      return;
    }

    pendingLoadCallbacks.push(resolve);

    if (scriptLoading) return;
    scriptLoading = true;

    window.onTurnstileLoad = () => {
      scriptLoaded = true;
      pendingLoadCallbacks.splice(0).forEach((cb) => cb());
    };

    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  });
}

export default function Turnstile({ onVerify, theme = 'auto', size = 'flexible', appearance = 'always' }: Props) {
  const { turnstileSiteKey } = usePage<PageProps>().props;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  useEffect(() => {
    if (!turnstileSiteKey || !containerRef.current || errorCode) return;

    let cancelled = false;
    const container = containerRef.current;

    loadTurnstileScript().then(() => {
      if (cancelled || !window.turnstile || !container) return;

      widgetIdRef.current = window.turnstile.render(container, {
        sitekey: turnstileSiteKey,
        callback: (token) => onVerify?.(token),
        theme,
        size,
        appearance,
        // Stop CF's internal retry loop on first failure — unmount and surface
        // the code instead of letting it spam siteverify.
        'error-callback': (code) => {
          setErrorCode(typeof code === 'string' ? code : 'unknown');
          if (widgetIdRef.current && window.turnstile) {
            try {
              window.turnstile.remove(widgetIdRef.current);
            } catch {
              // safe to ignore
            }
            widgetIdRef.current = null;
          }
        },
      });
    });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // widget may already be gone — safe to ignore
        }
        widgetIdRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnstileSiteKey, errorCode]);

  if (!turnstileSiteKey) return null;

  if (errorCode) {
    return (
      <p className="text-xs text-red-400">
        Verification unavailable (code {errorCode}). Please refresh or contact support.
      </p>
    );
  }

  return <div ref={containerRef} className="cf-turnstile" />;
}
