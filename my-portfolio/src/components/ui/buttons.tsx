import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
    children: ReactNode;
    className?: string;
}

export function Button({ children, className = '' }: ButtonProps) {
    return (
        <motion.button
            whileTap={{ y: 1 }}
            className={twMerge(
                'border-2 border-button bg-zinc-800 active:bg-zinc-900 h-full px-2 cursor-pointer text-sm',
                className
            )}
        >
            {children}
        </motion.button>
    );
}
