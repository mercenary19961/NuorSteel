import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';

type Language = 'en' | 'ar';

interface LanguageContextType {
    language: Language;
    isRTL: boolean;
    toggleLanguage: () => void;
    setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const { i18n } = useTranslation();
    // Seed from the server-shared session locale so hard reloads preserve the user's
    // language choice (Option A — session cookie is the single source of truth).
    const serverLocale = (usePage<PageProps>().props.locale ?? 'en') as Language;

    const [language, setLanguageState] = useState<Language>(serverLocale);

    const isRTL = language === 'ar';

    useEffect(() => {
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
        i18n.changeLanguage(language);
    }, [language, isRTL, i18n]);

    const syncLocale = (lang: Language) => {
        // Update server session without triggering an Inertia page visit.
        // Laravel reads the XSRF-TOKEN cookie automatically via VerifyCsrfToken middleware.
        const xsrf = document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1];
        fetch(`/locale/${lang}`, {
            method: 'POST',
            headers: {
                'X-XSRF-TOKEN': xsrf ? decodeURIComponent(xsrf) : '',
                'Accept': 'application/json',
            },
            credentials: 'same-origin',
        }).catch(() => {});
    };

    const toggleLanguage = () => {
        const newLang: Language = language === 'en' ? 'ar' : 'en';
        setLanguageState(newLang);
        syncLocale(newLang);
    };

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        syncLocale(lang);
    };

    return (
        <LanguageContext.Provider value={{ language, isRTL, toggleLanguage, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
