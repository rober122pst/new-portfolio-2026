import { useCallback, useEffect, useState } from 'react';

import beep from '@assets/audios/beep.mp3';
import pcFans from '@assets/audios/pc_fans.mp3';
import { useKernelStore } from '@store/kernel';
import { useUserStore } from '@store/user';
import { playAudio } from '@utils/playAudio';
import BiosStartupScreen from './bios-startup-screen';
import LoadingStartupScreen from './loading-startup-screen';

export default function BootScreen() {
    const setScreen = useKernelStore((s) => s.setScreen);
    const user = useUserStore((s) => s.user);

    const [biosScreen, setBiosScreen] = useState(true);
    const playBeep = () => {
        playAudio(beep, 0.5);
    };

    const playFansLoop = () => {
        playAudio(pcFans, 0.02, true);
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

    return (
        <div className="font-terminal">
            <LoadingStartupScreen />
        </div>
    );
}
