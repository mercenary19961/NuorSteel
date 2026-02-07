import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';
import ar from './ar';

function getSavedLanguage(): string {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('language') || 'en';
    }
    return 'en';
}

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            ar: { translation: ar },
        },
        lng: getSavedLanguage(),
        fallbackLng: 'en',
        supportedLngs: ['en', 'ar'],
        interpolation: {
            escapeValue: false,
        },
    });

// Update document direction when language changes
i18n.on('languageChanged', (lng) => {
    document.documentElement.lang = lng;
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('language', lng);
});

export default i18n;
