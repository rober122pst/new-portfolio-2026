import { Button } from './buttons';
import { motion } from 'motion/react';
import { twMerge } from 'tailwind-merge';

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
    return (
        <motion.div
            drag
            dragConstraints={desktopRef ? desktopRef : undefined}
            dragElastic={0}
            dragMomentum={false}
            initial={false}
            transition={{ duration: 0 }}
            style={{ left: 150, top: 150 }}
            className={twMerge('absolute min-w-80 bg-zinc-800 border-2 border-elevated p-1.5', className)}
        >
            <div className="flex items-center justify-between h-8 flex-1 bg-linear-to-r from-berry-800 to-berry-700 py-0.5 px-2 box-border">
                <div className="flex items-center gap-1.5 text-white">
                    <program.icon className="pointer-events-none" size={16} />
                    <span className="">{program.name}</span>
                </div>
                <div className="flex items-center">
                    <Button className="bg-zinc-800 text-white size-6 text-center px-0">_</Button>
                    <Button className="bg-zinc-800 text-white size-6 text-center px-0">🗖</Button>
                    <Button className="bg-zinc-800 text-white ml-1.5 size-6 text-center px-0">X</Button>
                </div>
            </div>
            <div className="flex-1 h-96 bg-red-600"></div>
        </motion.div>
    );
}
