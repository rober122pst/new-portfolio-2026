import { useEffect, useRef, useState } from 'react';

import { appRegistry, type AppId } from '../core/appRegistry';
import { useDesktopStore } from '../store/desktop';
import { useProcessStore } from '../store/processes';
import { useWindowStore } from '../store/windows';
import { WindowManager } from './windowManager';

export function Desktop() {
    const [selected, setSelected] = useState<string[]>([]);
    const desktopRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

    const { setSize } = useDesktopStore();

    const handleDesktopClick = () => {
        setSelected([]);
    };

    const handleSelected = (e: React.MouseEvent<HTMLButtonElement>, id: AppId) => {
        e.stopPropagation();

        setSelected([id]);
    };

    const handleExecProgram = (e: React.MouseEvent<HTMLButtonElement>, id: AppId) => {
        e.stopPropagation();
        const pid = useProcessStore.getState().openProcess(id);
        useWindowStore.getState().openWindow(pid);
        setSelected([]);
    };

    useEffect(() => {
        if (!desktopRef.current) return;

        const resize = () => {
            const rect = desktopRef.current?.getBoundingClientRect();
            if (!rect) return;

            setSize(rect.width, rect.height);
        };

        resize();
        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <main
            ref={desktopRef}
            className="
                relative 
                h-full w-full grid 
                grid-flow-col 
                grid-rows-[repeat(auto-fill,96px)] 
                auto-cols-[96px] 
                gap-2 
                p-4
                content-start
                select-none
                bg-teal-700
                bg-center bg-auto
            "
            onClick={handleDesktopClick}
        >
            <WindowManager desktopRef={desktopRef} />
            {Object.entries(appRegistry).map(([appId, app]) => {
                const isSelected = selected.includes(appId);

                return (
                    <button
                        key={appId}
                        data-selected={isSelected}
                        className="
                            w-24 h-fit
                            flex flex-col items-center justify-center
                            cursor-pointer
                            text-white
                            select-none 
                            py-1.5
                            hover:bg-white/20
                            data-[selected=true]:bg-white/40
                        "
                        onClick={(e) => handleSelected(e, appId as AppId)}
                        onDoubleClick={(e) => handleExecProgram(e, appId as AppId)}
                    >
                        <app.icon size={40} />
                        <span className="text-xs mt-1 text-center">{app.name}</span>
                    </button>
                );
            })}
        </main>
    );
}
