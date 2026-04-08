import '../css/app.css';
import './bootstrap';
import './i18n';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';
import type { ComponentType, ReactNode } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ToastProvider } from '@/contexts/ToastContext';
import FlashMessages from '@/Components/FlashMessages';

function Providers({ children }: { children: ReactNode }) {
    return (
        <LanguageProvider>
            <ToastProvider>
                <FlashMessages />
                {children}
            </ToastProvider>
        </LanguageProvider>
    );
}

// Handle expired session (419) and server error (500) — auto-reload the page
// so the user gets a fresh CSRF token instead of a cryptic error.
router.on('invalid', (event) => {
    const status = event.detail.response.status;
    if (status === 419) {
        event.preventDefault();
        window.location.reload();
    }
});

createInertiaApp({
    title: (title) => title ? `Nuor Steel | ${title}` : 'Nuor Steel',
    resolve: (name) => resolvePageComponent(
        `./Pages/${name}.tsx`,
        import.meta.glob<{ default: ComponentType }>('./Pages/**/*.tsx'),
    ),
    setup({ el, App, props }) {
        const appElement = (
            <App {...props}>
                {({ Component, props: pageProps, key }) => (
                    <Providers>
                        <Component key={key} {...pageProps} />
                    </Providers>
                )}
            </App>
        );

        if (el.hasChildNodes()) {
            hydrateRoot(el, appElement);
        } else {
            createRoot(el).render(appElement);
        }
    },
});
