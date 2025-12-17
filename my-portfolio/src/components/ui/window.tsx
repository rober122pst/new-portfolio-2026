import { motion, useDragControls } from 'motion/react';
import { useEffect } from 'react';

import { twMerge } from 'tailwind-merge';
import { appRegistry } from '../../core/appRegistry';
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
    const dragControls = useDragControls();
    const { getProcess, closeProcess } = useProcessStore();

    const process = getProcess(myWindow.pid);

    const { setFocusWindow, closeWindow, maximizeWindow, minimizeWindow, setPosition } = useWindowStore();

    useEffect(() => {
        function handleClickOutside() {
            setFocusWindow(myWindow.id, false);
        }

        window.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        };
    });

    if (!process) return null; // Checagem segura caso o processo não seja encontrado

    const app = appRegistry[process.appId];

    return (
        !myWindow.isMinimized && (
            <motion.div
                drag
                dragControls={dragControls}
                dragListener={false}
                dragConstraints={desktopRef ? desktopRef : undefined}
                dragElastic={0}
                dragMomentum={false}
                initial={false}
                transition={{ duration: 0 }}
                onDragEnd={(e, info) => {
                    setPosition(myWindow.id, { x: info.point.x, y: info.point.y });
                }}
                style={{ left: 150, top: 150, width: '75%', height: '75%', zIndex: myWindow.zIndex }}
                onMouseDown={(e) => {
                    e.stopPropagation();
                    if (!myWindow.isFocused) setFocusWindow(myWindow.id, true);
                }}
                className={twMerge(
                    'absolute flex flex-col min-w-80 min-h-11.5 max-w-full max-h-full bg-zinc-800 border-2 border-elevated p-1.5 resize overflow-hidden',
                    className
                )}
            >
                <div
                    onPointerDown={(e) => dragControls.start(e)}
                    className={`flex items-center justify-between w-full h-8 bg-linear-to-r ${myWindow.isFocused ? 'from-berry-800 to-berry-700' : 'from-zinc-600 to-zinc-500'} py-0.5 px-2`}
                >
                    <div className="flex items-center gap-1.5 text-white">
                        <app.icon className="pointer-events-none" size={16} />
                        <span className={myWindow.isFocused ? 'text-white' : 'text-zinc-400'}>{app.name}</span>
                    </div>
                    <div className="flex items-center">
                        <Button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() => minimizeWindow(myWindow.id)}
                            className="bg-zinc-800 text-white size-6 text-center px-0"
                        >
                            _
                        </Button>
                        <Button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() => maximizeWindow(myWindow.id)}
                            className="bg-zinc-800 text-white size-6 text-center px-0"
                        >
                            🗖
                        </Button>
                        <Button
                            onPointerDown={(e) => e.stopPropagation()}
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
        )
    );
}
