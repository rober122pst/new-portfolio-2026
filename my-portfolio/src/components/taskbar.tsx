import { useEffect, useState } from 'react';

import volumeIcon from '../assets/icons_taskbar/volume.ico';
import soLogo from '../assets/so_logo.ico';
import { appRegistry } from '../core/appRegistry';
import { useProcessStore } from '../store/processes';
import { useWindowStore } from '../store/windows';
import { Button } from './ui/buttons';

export function Taskbar() {
    const [now, setNow] = useState(new Date());
    const { processes, toggleActive } = useProcessStore();
    const { setFocusWindow, minimizeWindow, getWindow } = useWindowStore();

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="relative flex justify-between items-center w-full p-1 bg-zinc-800 text-white text-[12px] select-none z-50">
            {/* Botão iniciar */}
            <Button className="flex items-center gap-1">
                <img className="size-4" src={soLogo} alt="Logo do SO" />
                Iniciar
            </Button>

            {/* Programas e janelas abertas */}
            <div className="flex-1 flex gap-1 px-2 h-full">
                {processes.map((process) => {
                    const app = appRegistry[process.appId as keyof typeof appRegistry];
                    if (!app) return null;

                    const window = getWindow({ pid: process.pid });
                    if (!window) return null;

                    return (
                        <Button
                            data-process-id={process.pid}
                            onClick={() => {
                                if (process.isActive) {
                                    minimizeWindow(window.id);
                                    toggleActive('');
                                } else {
                                    setFocusWindow(process.pid, true);
                                }
                            }}
                            active={process.isActive}
                            key={process.pid}
                            className="flex items-center gap-1 h-full"
                        >
                            <app.icon className="pointer-events-none" size={16} />
                            <span className="pointer-events-none">{app.name}</span>
                        </Button>
                    );
                })}
            </div>

            {/* Área de horario e processos */}
            <div className="border-2 px-3 py-0.5 border-sunk bg-zinc-900/30 flex items-center">
                <div className="mr-2 p-1.5">
                    <img src={volumeIcon} alt="volume" />
                </div>
                <div className="flex flex-col justify-center h-full text-right pointer-events-none">
                    <p>
                        {now.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </p>
                    <p>{now.toLocaleDateString()}</p>
                </div>
            </div>
        </footer>
    );
}
