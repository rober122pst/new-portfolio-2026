import { useFileSystemItem } from '@store/filesystem';
import { useProcessActions, useProcesses, type Process } from '@store/processes';
import { useWindow, useWindowActions } from '@store/windows';
import { useEffect, useState } from 'react';

import { appRegistry } from '@/core/app-registry';
import volumeIcon from '@assets/icons_taskbar/volume.webp';
import soLogo from '@assets/logos/logo_16x.webp';
import { Button } from './ui/buttons';
import { BaseIcon } from './ui/icons';

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

function TaskbarItems({ process }: { process: Process }) {
    const { toggleActive } = useProcessActions();
    const { setFocusWindow, minimizeWindow } = useWindowActions();

    const fileId =
        (process.data as { fileId: string })?.fileId || (process.data as { currentFolderId: string })?.currentFolderId;
    const file = useFileSystemItem(fileId);

    const appIcon = appRegistry[process.appId].icon;

    const window = useWindow({ pid: process.pid });
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
            className="flex h-full items-center gap-1"
        >
            <BaseIcon src={appIcon} className="pointer-events-none" size={16} />
            <span className="pointer-events-none">
                {file?.name || (process.data as { name: string }).name}
                {file?.type === 'file' ? `.${file.extension}` : ''}
            </span>
        </Button>
    );
}

export default function Taskbar() {
    const processes = useProcesses();

    return (
        <footer className="relative z-50 flex w-full items-center justify-between bg-zinc-800 p-1 text-[12px] text-white select-none">
            {/* Botão iniciar */}
            <Button className="flex items-center gap-1">
                <img className="size-4" src={soLogo} alt="Logo do SO" />
                Iniciar
            </Button>

            {/* Programas e janelas abertas */}
            <div className="flex h-full flex-1 gap-1 px-2">
                {processes.map((process) => (
                    <TaskbarItems key={process.pid} process={process} />
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
