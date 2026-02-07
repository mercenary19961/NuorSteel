import '../css/app.css';
import './bootstrap';
import './i18n';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import type { ComponentType } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ToastProvider } from '@/contexts/ToastContext';
import FlashMessages from '@/Components/FlashMessages';

createInertiaApp({
    title: (title) => title ? `Nuor Steel | ${title}` : 'Nuor Steel',
    resolve: (name) => resolvePageComponent(
        `./Pages/${name}.tsx`,
        import.meta.glob<{ default: ComponentType }>('./Pages/**/*.tsx'),
    ),
    setup({ el, App, props }) {
        createRoot(el).render(
            <LanguageProvider>
                <ToastProvider>
                    <FlashMessages />
                    <App {...props} />
                </ToastProvider>
            </LanguageProvider>
        );
    },
});
