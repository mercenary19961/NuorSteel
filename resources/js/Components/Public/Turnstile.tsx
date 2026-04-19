import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';

export interface TurnstileHandle {
  reset: () => void;
}

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

const Turnstile = forwardRef<TurnstileHandle, Props>(function Turnstile(
  { onVerify, theme = 'auto', size = 'flexible', appearance = 'always' },
  ref,
) {
  const { turnstileSiteKey } = usePage<PageProps>().props;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onVerifyRef = useRef(onVerify);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  // Keep callback ref current without retriggering the render effect.
  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.reset(widgetIdRef.current);
          onVerifyRef.current?.('');
        } catch {
          // widget may have been removed — safe to ignore
        }
      }
    },
  }), []);

  useEffect(() => {
    if (!turnstileSiteKey || !containerRef.current || errorCode) return;

    let cancelled = false;
    const container = containerRef.current;

    loadTurnstileScript().then(() => {
      if (cancelled || !window.turnstile || !container) return;

      widgetIdRef.current = window.turnstile.render(container, {
        sitekey: turnstileSiteKey,
        callback: (token) => onVerifyRef.current?.(token),
        theme,
        size,
        appearance,
        // Token expires after ~5 min — clear parent state and reissue so the
        // submit button re-disables until the user re-verifies.
        'expired-callback': () => {
          onVerifyRef.current?.('');
          if (widgetIdRef.current && window.turnstile) {
            try {
              window.turnstile.reset(widgetIdRef.current);
            } catch {
              // safe to ignore
            }
          }
        },
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
});

export default Turnstile;
