import { useEffect, useState } from 'react';
import { useProcessActions, useProcesses } from '../store/processes';

import volumeIcon from '../assets/icons_taskbar/volume.ico';
import soLogo from '../assets/logos/logo_16x.webp';
import { appRegistry } from '../core/appRegistry';
import { useFileSystemStore } from '../store/filesystem';
import { useWindowActions } from '../store/windows';
import { Button } from './ui/buttons';

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
            <p>{now.toLocaleDateString()}</p>
        </>
    );
}

export default function Taskbar() {
    const processes = useProcesses();
    const { toggleActive } = useProcessActions();
    const { setFocusWindow, minimizeWindow, getWindow } = useWindowActions();

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
                    const fileId =
                        (process.data as { fileId: string })?.fileId ||
                        (process.data as { currentFolderId: string })?.currentFolderId;
                    const file = useFileSystemStore.getState().actions.getItem(fileId);

                    const AppIcon = appRegistry[process.appId].icon;

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
                            <AppIcon className="pointer-events-none" size={16} />
                            <span className="pointer-events-none">
                                {file?.name || (process.data as { name: string }).name}
                                {file?.type === 'file' ? `.${file.extension}` : ''}
                            </span>
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
                    <Clock />
                </div>
            </div>
        </footer>
    );
}
