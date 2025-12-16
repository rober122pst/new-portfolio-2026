import { motion, useDragControls } from 'motion/react';
import { useEffect, useState } from 'react';

import { twMerge } from 'tailwind-merge';
import { Button } from './buttons';

interface Program {
    id: string;
    name: string;
    icon: React.ComponentType<{ className?: string; size?: number }>;
    action: () => void;
}

interface WindowProps {
    className?: string;
    program: Program;
    desktopRef?: React.RefObject<HTMLElement>;
}

export function Window({ className, program, desktopRef }: WindowProps) {
    const dragControls = useDragControls();
    const [isFocused, setIsFocused] = useState<boolean>(true);

    useEffect(() => {
        function handleClickOutside() {
            setIsFocused(false);
        }

        window.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        };
    });

    return (
        <motion.div
            drag
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={desktopRef ? desktopRef : undefined}
            dragElastic={0}
            dragMomentum={false}
            initial={false}
            transition={{ duration: 0 }}
            style={{ left: 150, top: 150, width: '75%', height: '75%' }}
            onMouseDown={(e) => {
                e.stopPropagation();
                setIsFocused(true);
            }}
            className={twMerge(
                'absolute flex flex-col min-w-80 min-h-11.5 max-w-full max-h-full bg-zinc-800 border-2 border-elevated p-1.5 resize overflow-hidden',
                className
            )}
        >
            <div
                onPointerDown={(e) => dragControls.start(e)}
                className={`flex items-center justify-between w-full h-8 bg-linear-to-r ${isFocused ? 'from-berry-800 to-berry-700' : 'from-zinc-600 to-zinc-500'} py-0.5 px-2`}
            >
                <div className="flex items-center gap-1.5 text-white">
                    <program.icon className="pointer-events-none" size={16} />
                    <span className={isFocused ? 'text-white' : 'text-zinc-400'}>{program.name}</span>
                </div>
                <div className="flex items-center">
                    <Button
                        onPointerDown={(e) => e.stopPropagation()}
                        className="bg-zinc-800 text-white size-6 text-center px-0"
                    >
                        _
                    </Button>
                    <Button
                        onPointerDown={(e) => e.stopPropagation()}
                        className="bg-zinc-800 text-white size-6 text-center px-0"
                    >
                        🗖
                    </Button>
                    <Button
                        onPointerDown={(e) => e.stopPropagation()}
                        className="bg-zinc-800 text-white ml-1.5 size-6 text-center px-0"
                    >
                        X
                    </Button>
                </div>
            </div>
            <div className="mt-1.5 flex-1 h-96 bg-red-600 border-2 border-b-zinc-700 border-r-zinc-700 border-l-zinc-900 border-t-zinc-900 shadow-[inset_2px_2px_0px_oklch(14.1%_0.005_285.823),inset_-2px_-2px_0px_oklch(27.4%_0.006_286.033)]"></div>
        </motion.div>
    );
}
