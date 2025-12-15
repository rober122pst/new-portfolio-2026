import { twMerge } from 'tailwind-merge';

interface WindowProps {
    className?: string;
}

export function Window({ className }: WindowProps) {
    return <div className={twMerge('fixed top-20 left-20 size-56 bg-red-500', className)}></div>;
}
