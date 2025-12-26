import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import enUSTranslation from './locales/en-US.json';
import ptBRTranslation from './locales/pt-BR.json';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            'pt-BR': { ...ptBRTranslation },
            'en-US': { ...enUSTranslation },
        },
        fallbackLng: 'en-US',
        interpolation: { escapeValue: false },
    });

export default i18n;
