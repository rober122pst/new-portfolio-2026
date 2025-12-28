import { useCallback, useEffect, useState } from 'react';

import beep from '../assets/audios/beep.mp3';
import pcFans from '../assets/audios/pc_fans.mp3';
import BiosStartupScreen from './biosStartupScreen';
import LoadingStartupScreen from './loadingStartupScreen';

export default function BootScreen({ onBoot }: { onBoot: () => void }) {
    const [biosScreen, setBiosScreen] = useState(true);
    const playBeep = () => {
        const audio = new Audio(beep);
        audio.volume = 0.5;
        audio.play();
    };

    const playFansLoop = () => {
        const audio = new Audio(pcFans);
        audio.volume = 0.02;
        audio.loop = true;
        audio.play();
    };

    useEffect(() => {
        playFansLoop();
    }, []);

    const handlerOnBoot = useCallback(() => {
        setTimeout(() => {
            onBoot();
        }, 9000);
    }, [onBoot]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setBiosScreen(false);
            playBeep();
            handlerOnBoot();
        }, 5550);

        return () => clearTimeout(timer);
    }, [handlerOnBoot]);

    if (biosScreen) {
        return <BiosStartupScreen />;
    }

    return <LoadingStartupScreen />;
}
