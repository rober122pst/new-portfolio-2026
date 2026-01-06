import { useCallback, useEffect, useState } from 'react';

import BiosStartupScreen from './biosStartupScreen';
import LoadingStartupScreen from './loadingStartupScreen';
import beep from '../assets/audios/beep.mp3';
import pcFans from '../assets/audios/pc_fans.mp3';
import { useKernelStore } from '../store/kernel';
import { useUserStore } from '../store/user';

export default function BootScreen() {
    const setScreen = useKernelStore((s) => s.setScreen);
    const user = useUserStore((s) => s.user);

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
            if (user) {
                setScreen('DESKTOP');
            } else {
                setScreen('LOOK');
            }
            sessionStorage.setItem('ligado', 'true');
        }, 9000);
    }, [setScreen, user]);

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
