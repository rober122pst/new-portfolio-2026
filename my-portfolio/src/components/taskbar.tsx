import { useFileSystemItem } from '@store/filesystem';
import { useProcesses, type Process } from '@store/processes';
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

function TaskbarItemsDebugTooltip({ process }: { process: Process }) {
    return (
        <div className="absolute bottom-full mb-1 w-max rounded bg-black/80 p-1 text-xs text-white">
            <p>PID: {process.pid}</p>
            <p>App ID: {process.appId}</p>
            <p>isActive: {process.isActive.toString()}</p>
        </div>
    );
}

function TaskbarItems({ process }: { process: Process }) {
    const { setFocusWindow, minimizeWindow } = useWindowActions();
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    const fileId =
        (process.data as { fileId: string })?.fileId || (process.data as { currentFolderId: string })?.currentFolderId;
    const file = useFileSystemItem(fileId);

    const appIcon = appRegistry[process.appId].icon;

    const window = useWindow({ pid: process.pid });
    if (!window) return null;

    return (
        <>
            {isTooltipVisible && <TaskbarItemsDebugTooltip process={process} />}
            <Button
                data-process-id={process.pid}
                onClick={(e) => {
                    e.stopPropagation();
                    if (process.isActive && !window.isMinimized) {
                        minimizeWindow(window.id);
                    } else {
                        setFocusWindow(process.pid, true);
                    }
                }}
                onMouseEnter={() => setIsTooltipVisible(true)}
                onMouseLeave={() => setIsTooltipVisible(false)}
                active={process.isActive}
                className="flex h-full min-w-0 flex-[0_1_144px] items-center gap-1 overflow-hidden"
            >
                <BaseIcon src={appIcon} className="pointer-events-none min-w-0" size={16} />
                <span className="pointer-events-none min-w-0 truncate whitespace-nowrap">
                    {file?.name || (process.data as { name: string }).name}
                    {file?.type === 'file' ? `.${file.extension}` : ''}
                </span>
            </Button>
        </>
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
            <div className="flex h-full w-155.75 min-w-0 gap-1 px-2">
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
