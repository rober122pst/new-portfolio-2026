import { motion, useDragControls } from 'motion/react';

import { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { appRegistry } from '../../core/appRegistry';
import { useFileSystemStore } from '../../store/filesystem';
import { useProcessStore } from '../../store/processes';
import { useWindowStore, type Window } from '../../store/windows';
import { Button } from './buttons';

interface WindowProps {
    className?: string;
    myWindow: Window;
    desktopRef?: React.RefObject<HTMLElement>;
    children?: React.ReactNode;
}

export function Window({ className, myWindow, desktopRef, children }: WindowProps) {
    const windowRef = useRef<HTMLDivElement>(null);

    const dragControls = useDragControls();
    const { getProcess, closeProcess, toggleActive } = useProcessStore();

    const process = getProcess(myWindow.pid);

    const { setFocusWindow, closeWindow, toggleMaximizeWindow, minimizeWindow, setPosition, setSize } =
        useWindowStore();

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            const target = e.target as HTMLElement;

            if (target.closest(`[data-process-id="${myWindow.pid}"]`)) {
                return;
            }
            setFocusWindow(myWindow.pid, false);
        }
        window.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, [windowRef, myWindow.pid, setFocusWindow]);

    useEffect(() => {
        if (!windowRef.current) return;

        const element = windowRef.current;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            const { width, height } = entry.contentRect;

            if (width === 0 || height === 0) return;

            if (width !== myWindow.size.width || height !== myWindow.size.height) {
                setSize(myWindow.id, {
                    width: width + 8 * 2, // Ajuste para bordas/padding
                    height: height + 8 * 2,
                });
            }
        });

        observer.observe(element);

        return () => observer.disconnect();
    }, [myWindow.id, setSize, myWindow.size.width, myWindow.size.height, myWindow.isMinimized]);

    // "Colisão" com bordas para não arrastar a janela para fora da área visível
    useEffect(() => {
        if (!desktopRef?.current || !windowRef.current) return;

        const rect = desktopRef.current.getBoundingClientRect();
        const win = windowRef.current.getBoundingClientRect();

        if (win.left + 100 > rect.right) {
            console.log('Colidindo na direita');
            setPosition(myWindow.id, { x: rect.right - 101, y: myWindow.position.y });
            windowRef.current.style.translate = `translateX(${rect.right - 101}px)`;
        }
        if (rect.top < 0) {
            setPosition(myWindow.id, { x: myWindow.position.x, y: 0 });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [windowRef?.current?.getBoundingClientRect().right]);

    // Debug logs
    useEffect(() => {
        console.log('Window size changed:', myWindow.size);
    }, [myWindow.size]);

    useEffect(() => {
        console.log('Window position:', myWindow.position);
    }, [myWindow.position]);

    if (!process) return; // Checagem segura caso o processo não seja encontrado

    const app = appRegistry[process.appId];

    const fileId =
        (process.data as { fileId: string })?.fileId || (process.data as { currentFolderId: string })?.currentFolderId;
    const fileName = useFileSystemStore.getState().getItem(fileId)?.name;

    if (myWindow.isMinimized) return;

    return (
        <motion.div
            ref={windowRef}
            data-window-id={myWindow.id}
            drag={!myWindow.isMaximized}
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={
                desktopRef
                    ? {
                          top: 0,
                          left: 0 - myWindow.size.width + 60,
                          right: desktopRef.current ? desktopRef.current.clientWidth - 40 : 0,
                          bottom: desktopRef.current ? desktopRef.current.clientHeight - 40 : 0,
                      }
                    : undefined
            }
            dragElastic={0}
            dragMomentum={false}
            initial={false}
            transition={{ duration: 0 }}
            animate={{
                y: myWindow.position.y,
                x: myWindow.position.x,
                width: myWindow.size.width,
                height: myWindow.size.height,
            }}
            onDragEnd={() => {
                const win = windowRef?.current?.getBoundingClientRect();
                setPosition(myWindow.id, {
                    x: win ? win.left - (desktopRef?.current?.getBoundingClientRect().left || 0) : myWindow.position.x,
                    y: win ? win.top - (desktopRef?.current?.getBoundingClientRect().top || 0) : myWindow.position.y,
                });
            }}
            style={{
                zIndex: myWindow.zIndex,
            }}
            onMouseDown={(e) => {
                e.stopPropagation();
                if (!myWindow.isFocused) {
                    setFocusWindow(myWindow.pid, true);
                }
            }}
            className={twMerge(
                `absolute flex flex-col min-w-80 min-h-11.5 max-w-full max-h-full bg-zinc-800 border-2 border-elevated p-1.5 ${myWindow.isMaximized ? 'resize-none' : 'resize'} overflow-hidden`,
                className
            )}
        >
            <div
                onPointerDown={(e) => dragControls.start(e)}
                className={`flex items-center justify-between w-full h-8 bg-linear-to-r ${myWindow.isFocused ? 'from-berry-800 to-berry-700' : 'from-zinc-600 to-zinc-500'} py-0.5 px-2`}
            >
                <div className="flex items-center gap-1.5 text-white flex-1 min-w-0">
                    <app.icon className="pointer-events-none" size={16} />
                    <span
                        className={`${myWindow.isFocused ? 'text-white' : 'text-zinc-400'} whitespace-nowrap w-full overflow-hidden truncate pr-1`}
                    >
                        {fileName} - {app.name}
                    </span>
                </div>
                <div className="flex items-center">
                    <Button
                        onPointerDown={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => {
                            minimizeWindow(myWindow.id);
                            toggleActive('');
                        }}
                        className="bg-zinc-800 text-white size-6 text-center px-0"
                    >
                        _
                    </Button>
                    <Button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => toggleMaximizeWindow(myWindow.id)}
                        className="bg-zinc-800 text-white size-6 text-center px-0"
                    >
                        {myWindow.isMaximized ? '🗗' : '🗖'}
                    </Button>
                    <Button
                        onPointerDown={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => {
                            closeWindow(myWindow.id);
                            closeProcess(myWindow.pid);
                        }}
                        className="bg-zinc-800 text-white ml-1.5 size-6 text-center px-0"
                    >
                        X
                    </Button>
                </div>
            </div>
            <div className="mt-1.5 flex-1 border-b-zinc-700 border-r-zinc-700 border-l-zinc-900 border-t-zinc-900 shadow-[inset_2px_2px_0px_oklch(14.1%_0.005_285.823),inset_-2px_-2px_0px_oklch(27.4%_0.006_286.033)]">
                {children}
            </div>
        </motion.div>
    );
}
