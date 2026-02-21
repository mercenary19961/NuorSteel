import './i18n';

import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import type { ComponentType, ReactNode } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ToastProvider } from '@/contexts/ToastContext';

function Providers({ children }: { children: ReactNode }) {
    return (
        <LanguageProvider>
            <ToastProvider>
                {children}
            </ToastProvider>
        </LanguageProvider>
    );
}

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => title ? `Nuor Steel | ${title}` : 'Nuor Steel',
        resolve: (name) => resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob<{ default: ComponentType }>('./Pages/**/*.tsx'),
        ),
        setup({ App, props }) {
            return (
                <App {...props}>
                    {({ Component, props: pageProps, key }) => (
                        <Providers>
                            <Component key={key} {...pageProps} />
                        </Providers>
                    )}
                </App>
            );
        },
    }),
);
