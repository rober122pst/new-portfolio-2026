import { useWindow, useWindowActions } from '@/store/windows';

import { appRegistry } from '@/core/app-registry';
import { useFileSystemItem } from '@/store/filesystem';
import type { Process } from '@/store/processes';
import { useState } from 'react';
import { Button } from '../ui/buttons';
import { BaseIcon } from '../ui/icons';

function TaskbarItemsDebugTooltip({ process }: { process: Process }) {
    return (
        <div className="absolute bottom-full mb-1 w-max rounded bg-black/80 p-1 text-xs text-white">
            <p>PID: {process.pid}</p>
            <p>App ID: {process.appId}</p>
            <p>isActive: {process.isActive.toString()}</p>
        </div>
    );
}

export default function TaskbarItem({ process }: { process: Process }) {
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
