import { twMerge } from 'tailwind-merge';

interface WindowProps {
    className?: string;
}

export function Window({ className }: WindowProps) {
    return <div className={twMerge('fixed top-1/2 left-1/2 -translate-2/3 size-96 bg-zinc-800', className)}></div>;
}
