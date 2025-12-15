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
                'border-3 border-elevated active:border-sunk active:bg-zinc-900/30 h-full px-2 cursor-pointer text-sm',
                className
            )}
        >
            {children}
        </button>
    );
}
