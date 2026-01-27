import { useCallback, useState } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import startupAudio from './assets/audios/button_startup.mp3';
import BlueScreen from './components/blue-screen';
import OSKernel from './components/kernel';
import RetroMonitor from './components/retro-monitor';
import { useKeydown } from './hooks/useKeydown';
import { playAudio } from './utils/playAudio';

// import Desktop from './components/desktop';

// import Taskbar from './components/taskbar';

function App() {
    const { t } = useTranslation();

    // Verifica se é o boot inicial (primeira vez que abre o site no navegador)
    const [initialBoot, setInitialBoot] = useState(() => {
        if (!sessionStorage.getItem('ligado')) {
            return true;
        } else {
            return false;
        }
    });

    // Ta ligando o sistema
    const [startupSystem, setStartupSystem] = useState(false);

    const wakeUp = !initialBoot && !startupSystem;

    const handleKeyPress = useCallback(
        (key: string) => {
            if (startupSystem || wakeUp) return;
            if (key) {
                setInitialBoot(false);
                setStartupSystem(true);
                playAudio(startupAudio, 0.2);
                sessionStorage.setItem('ligado', 'true');
            }
        },
        [startupSystem, wakeUp]
    );

    useKeydown({ onKeyPressed: handleKeyPress });

    if (initialBoot) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <h1 className="font-serif text-2xl text-white">{t('pressAnyKey')}</h1>
            </div>
        );
    }

    return (
        <RetroMonitor>
            <ErrorBoundary
                fallbackRender={({ error }) => {
                    const errorName = error instanceof Error ? error.name : 'Unknown Error';
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    return <BlueScreen message={`${errorName}: ${errorMessage}`} />;
                }}
            >
                <OSKernel />
            </ErrorBoundary>
        </RetroMonitor>
    );
}

export default App;
