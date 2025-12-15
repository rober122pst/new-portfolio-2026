import { twMerge } from 'tailwind-merge';
import { Button } from './buttons';

interface Program {
    id: string;
    name: string;
    icon: React.ComponentType<{ size?: number }>;
    action: () => void;
}

interface WindowProps {
    className?: string;
    program: Program;
}

export function Window({ className, program }: WindowProps) {
    return (
        <div
            className={twMerge(
                'fixed top-1/2 left-1/2 -translate-2/3 min-w-80 bg-zinc-800 border-2 border-elevated p-1.5',
                className
            )}
        >
            <div className="flex items-center justify-between h-8 flex-1 bg-linear-to-r from-berry-800 to-berry-700 py-0.5 px-2 box-border">
                <div className="flex items-center gap-1.5 text-white">
                    <program.icon size={16} />
                    <span className="">{program.name}</span>
                </div>
                <div>
                    <Button className="bg-zinc-800 text-white size-6 text-center px-0">_</Button>
                    <Button className="bg-zinc-800 text-white size-6 text-center px-0">🗖</Button>
                    <Button className="bg-zinc-800 text-white ml-1.5 size-6 text-center px-0">X</Button>
                </div>
            </div>
        </div>
    );
}
