import { AnimatePresence, motion } from 'motion/react';

import { memo, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { twMerge } from 'tailwind-merge';
import { appRegistry } from '../../core/appRegistry';
import { useDesktopPosition, useDesktopScale } from '../../store/desktop';
import { useFileSystemItem } from '../../store/filesystem';
import { useScale } from '../../store/monitor';
import { useProcess, useProcessActions } from '../../store/processes';
import { useWindowActions, type Window as WindowType } from '../../store/windows';
import { Button } from './buttons';

interface WindowProps {
    className?: string;
    myWindow: WindowType;
    children?: React.ReactNode;
}

export const Window = memo(
    ({ className, myWindow, children }: WindowProps) => {
        const windowRef = useRef<HTMLDivElement>(null);
        const scale = useScale();
        const desktop = { size: useDesktopScale(), pos: useDesktopPosition() };

        const { closeProcess, toggleActive } = useProcessActions();

        const process = useProcess(myWindow.pid);
        const fileId =
            (process?.data as { fileId: string })?.fileId ||
            (process?.data as { currentFolderId: string })?.currentFolderId;
        const fileName = useFileSystemItem(fileId).name || (process?.data as { name: string }).name;

        const { setFocusWindow, closeWindow, toggleMaximizeWindow, minimizeWindow, setPosition, setSize } =
            useWindowActions();

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

        // ! Debug logs

        // useEffect(() => {
        //     console.log('Window size changed:', myWindow.size);
        //     console.log(myWindow.isMaximized);
        // }, [myWindow.size]);

        // useEffect(() => {
        //     console.log('Window position:', myWindow.position);
        // }, [myWindow.position]);

        if (!process) return; // Checagem segura caso o processo não seja encontrado
        const app = appRegistry[process.appId];

        return (
            <AnimatePresence mode="wait">
                {!myWindow.isMinimized && (
                    <>
                        {!myWindow.isMaximized && (
                            <div
                                id={`window-bounds-${myWindow.id}`}
                                className="pointer-events-none invisible absolute -z-10"
                                style={{
                                    top: desktop.pos.y,
                                    left: 60 - myWindow.size.width,
                                    width: desktop.size.width - 60 + myWindow.size.width * 2 - 40,
                                    height: desktop.size.height + myWindow.size.height - 40,
                                }}
                            />
                        )}
                        <Rnd
                            className="window-container"
                            cancel=".no-drag"
                            dragHandleClassName="window-header"
                            scale={scale}
                            position={{ x: myWindow.position.x, y: myWindow.position.y }}
                            size={{
                                width: myWindow.size.width,
                                height: myWindow.size.height,
                            }}
                            bounds={`#window-bounds-${myWindow.id}`}
                            onDragStop={(_, d) => {
                                setPosition(myWindow.id, { x: d.x, y: d.y });
                            }}
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                if (!myWindow.isFocused) {
                                    setFocusWindow(myWindow.pid, true);
                                }
                            }}
                            onResizeStop={(_, __, ref, ___, position) => {
                                setSize(myWindow.id, {
                                    width: parseInt(ref.style.width),
                                    height: parseInt(ref.style.height),
                                });

                                setPosition(myWindow.id, position);
                            }}
                            resizeHandleStyles={{
                                top: { cursor: 'ns-resize' },
                                bottom: { cursor: 'ns-resize' },
                                left: { cursor: 'ew-resize' },
                                right: { cursor: 'ew-resize' },
                            }}
                            style={{ zIndex: myWindow.zIndex }}
                            maxWidth={desktop.size.width}
                            maxHeight={desktop.size.height}
                            minWidth={320}
                            minHeight={42}
                            enableResizing={!myWindow.isMaximized}
                            disableDragging={myWindow.isMaximized}
                        >
                            <motion.div
                                ref={windowRef}
                                data-window-id={myWindow.id}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ ease: 'easeIn', type: 'tween', duration: 0.25 }}
                                className={twMerge(
                                    'border-elevated absolute flex h-full w-full origin-bottom flex-col overflow-hidden border bg-zinc-800 p-1.5',
                                    className
                                )}
                            >
                                <div
                                    className={`window-header flex h-8 w-full items-center justify-between bg-linear-to-r ${myWindow.isFocused ? 'from-berry-800 to-berry-700' : 'from-zinc-600 to-zinc-500'} px-2 py-0.5`}
                                >
                                    <div className="flex min-w-0 flex-1 items-center gap-1.5 text-white">
                                        <app.icon className="pointer-events-none" size={16} />
                                        <span
                                            className={`${myWindow.isFocused ? 'text-white' : 'text-zinc-400'} w-full truncate overflow-hidden pr-1 whitespace-nowrap`}
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
                                            className="no-drag size-6 bg-zinc-800 px-0 text-center text-white"
                                        >
                                            _
                                        </Button>
                                        <Button
                                            onPointerDown={(e) => e.stopPropagation()}
                                            onClick={() => toggleMaximizeWindow(myWindow.id)}
                                            className="no-drag size-6 bg-zinc-800 px-0 text-center text-white"
                                        >
                                            {myWindow.isMaximized ? '🗗' : '🗖'}
                                        </Button>
                                        <Button
                                            onPointerDown={(e) => e.stopPropagation()}
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onClick={() => {
                                                closeWindow(myWindow.pid);
                                                closeProcess(myWindow.pid);
                                            }}
                                            className="no-drag ml-1.5 size-6 bg-zinc-800 px-0 text-center text-white"
                                        >
                                            X
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-1.5 flex h-full w-full flex-col border-t-zinc-900 border-r-zinc-700 border-b-zinc-700 border-l-zinc-900 shadow-[inset_2px_2px_0px_oklch(14.1%_0.005_285.823),inset_-2px_-2px_0px_oklch(27.4%_0.006_286.033)]">
                                    {children}
                                </div>
                            </motion.div>
                        </Rnd>
                    </>
                )}
            </AnimatePresence>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.myWindow.position.x === nextProps.myWindow.position.x &&
            prevProps.myWindow.position.y === nextProps.myWindow.position.y &&
            prevProps.myWindow.size.width === nextProps.myWindow.size.width &&
            prevProps.myWindow.size.height === nextProps.myWindow.size.height &&
            prevProps.myWindow.isMinimized === nextProps.myWindow.isMinimized &&
            prevProps.myWindow.isMaximized === nextProps.myWindow.isMaximized &&
            prevProps.myWindow.isFocused === nextProps.myWindow.isFocused &&
            prevProps.myWindow.zIndex === nextProps.myWindow.zIndex
        );
    }
);
