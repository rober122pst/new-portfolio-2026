import { useEffect, useState } from 'react';

import volumeIcon from '@assets/icons_taskbar/volume.webp';
import soLogo from '@assets/logos/logo_16x.webp';
import { useProcesses } from '@store/processes';
import { AnimatePresence } from 'motion/react';
import { Button } from '../ui/buttons';
import StartMenu from './start-menu';
import TaskbarItem from './taskbar-item';

function Clock() {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <p>
                {now.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                })}
            </p>
        </>
    );
}

export default function Taskbar() {
    const processes = useProcesses();
    const [startMenu, setStartMenu] = useState(false);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            const target = e.target as HTMLElement;
            if (!startMenu) return;
            if (target.closest('#start-menu')) return;
            setStartMenu(false);
        }

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [startMenu]);

    return (
        <footer className="relative z-50 flex w-full items-center justify-between bg-zinc-800 p-1 text-[12px] text-white select-none">
            {/* Botão iniciar */}
            <Button id="start-menu" onClick={() => setStartMenu(!startMenu)} className="flex items-center gap-1">
                <img className="size-4" src={soLogo} alt="Logo do SO" />
                Iniciar
            </Button>
            <AnimatePresence>{startMenu && <StartMenu />}</AnimatePresence>

            {/* Programas e janelas abertas */}
            <div className="flex h-full w-155.75 min-w-0 gap-1 px-2">
                {processes.map((process) => (
                    <TaskbarItem key={process.pid} process={process} />
                ))}
            </div>

            {/* Área de horario e processos */}
            <div className="border-sunk flex items-center border-2 bg-zinc-900/30 px-3 py-0.5">
                <div className="mr-2 px-1.5 py-0.5">
                    <img src={volumeIcon} alt="volume" />
                </div>
                <div className="pointer-events-none flex h-full flex-col justify-center text-right">
                    <Clock />
                </div>
            </div>
        </footer>
    );
}
