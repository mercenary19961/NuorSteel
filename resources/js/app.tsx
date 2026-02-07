import '../css/app.css';
import './bootstrap';
import './i18n';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import type { ComponentType } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ToastProvider } from '@/contexts/ToastContext';
import FlashMessages from '@/Components/FlashMessages';

createInertiaApp({
    title: (title) => title ? `Nuor Steel | ${title}` : 'Nuor Steel',
    resolve: (name) => {
        const pages = import.meta.glob<{ default: ComponentType }>('./Pages/**/*.tsx', { eager: true });
        const page = pages[`./Pages/${name}.tsx`];
        if (!page) {
            throw new Error(`Page not found: ${name}`);
        }
        return page;
    },
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
