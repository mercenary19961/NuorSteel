import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
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
    const { locale } = usePage<PageProps>().props;

    const [language, setLanguageState] = useState<Language>(() => {
        // Initialize from Inertia shared props or localStorage
        const stored = localStorage.getItem('language');
        return (stored === 'ar' ? 'ar' : locale || 'en') as Language;
    });

    const isRTL = language === 'ar';

    useEffect(() => {
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
        i18n.changeLanguage(language);
        localStorage.setItem('language', language);
    }, [language, isRTL, i18n]);

    const toggleLanguage = () => {
        const newLang: Language = language === 'en' ? 'ar' : 'en';
        setLanguageState(newLang);
        // Update server-side locale via POST
        router.post(`/locale/${newLang}`, {}, { preserveState: true, preserveScroll: true });
    };

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        router.post(`/locale/${lang}`, {}, { preserveState: true, preserveScroll: true });
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
