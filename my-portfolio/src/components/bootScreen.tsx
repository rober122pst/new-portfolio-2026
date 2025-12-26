import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import rbr from '../assets/logos/rbr_logo.webp';
import person from '../assets/pessoa_boot.webp';

// import loadingBar from '../assets/loading.webp';
// import logo from '../assets/logos/horizontal_96x.webp';

export default function BootScreen({ onBoot }: { onBoot: (state: boolean) => void }) {
    const { t, i18n } = useTranslation();

    console.log(navigator.mediaSession);

    // ! Remover depois
    const [language, setLanguage] = useState('pt-BR');

    // ! Remover depois
    useEffect(() => {
        i18n.changeLanguage(language);
    }, [i18n, language]);

    useEffect(() => {
        setTimeout(() => {
            onBoot(true);
        }, 5000);
    }, [onBoot]);

    return (
        <div className="flex flex-col justify-center gap-24 items-center w-full h-full bg-black">
            <div className="flex w-full h-full p-8 text-2xl">
                <div className="flex-1 text-neutral-400 select-none">
                    <div className="flex gap-2 mb-8">
                        <img className="w-10 h-auto" src={person} />
                        <div>
                            <p>{t('boot.bios.hero.title')}</p>
                            <p>{t('boot.bios.hero.subtitle', { year: new Date().getFullYear() })}</p>
                        </div>
                    </div>
                    <div className="mb-8">
                        <p>{t('boot.bios.version')}</p>
                    </div>
                    <div className="mb-8">
                        <p>{t('boot.bios.firstSection.plataform', { plataform: navigator.hardwareConcurrency })}</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <img className="w-100 h-auto" src={rbr} />
                </div>
            </div>
            {/* <img className="w-md h-auto" src={logo} />
            <img className="w-xs h-auto" src={loadingBar} /> */}
        </div>
    );
}
