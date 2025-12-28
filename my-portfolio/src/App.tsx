import { Activity, useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import startupAudio from './assets/audios/button_startup.mp3';
import BootScreen from './components/bootScreen';
import Desktop from './components/desktop';
import RetroMonitor from './components/retroMonitor';
import Taskbar from './components/taskbar';
import { useKeydown } from './hooks/useKeydown';

function App() {
    const { t } = useTranslation();

    const [initialBoot, setInitialBoot] = useState(() => {
        if (!sessionStorage.getItem('ligado')) {
            sessionStorage.setItem('ligado', 'true');
            console.log('PC ligando...');
            return true;
        } else {
            console.log('PC ligado');
            return true;
        }
    });

    const [startupSystem, setStartupSystem] = useState(false);
    const wakeUp = !initialBoot && !startupSystem;

    const handleKeyPress = useCallback(
        (key: string) => {
            if (startupSystem || wakeUp) return;
            if (key) {
                setInitialBoot(false);
                setStartupSystem(true);
                const audio = new Audio(startupAudio);
                audio.volume = 0.2;
                audio.play();
            }
        },
        [startupSystem, wakeUp]
    );

    const bootSystem = () => {
        setStartupSystem(false);
        setInitialBoot(false);
    };

    useKeydown({ onKeyPressed: handleKeyPress });

    if (initialBoot) {
        return (
            <div className="flex justify-center items-center w-full h-full">
                <h1 className="text-2xl text-white">{t('pressAnyKey')}</h1>
            </div>
        );
    }

    return (
        <RetroMonitor>
            <Activity mode={startupSystem ? 'visible' : 'hidden'}>
                <BootScreen onBoot={bootSystem} />
            </Activity>
            <Activity mode={wakeUp ? 'visible' : 'hidden'}>
                <Desktop />
                <Taskbar />
            </Activity>
        </RetroMonitor>
    );
}

export default App;
