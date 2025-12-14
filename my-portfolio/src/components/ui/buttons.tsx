import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
    children: ReactNode;
    className?: string;
}

export function TaskbarButton({ children, className = '' }: ButtonProps) {
    return (
        <button
            className={twMerge(
                'border-3 border-t-zinc-700 border-l-zinc-700 border-r-zinc-900 border-b-zinc-900 active:border-b-zinc-700 active:border-r-zinc-700 active:border-l-zinc-900 active:border-t-zinc-900 active:bg-zinc-900/30 h-full px-2 cursor-pointer text-sm',
                className
            )}
        >
            {children}
        </button>
    );
}
