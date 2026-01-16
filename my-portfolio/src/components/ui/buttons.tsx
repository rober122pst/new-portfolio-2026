import type { ComponentProps, ReactNode } from 'react';

import { motion } from 'motion/react';
import { twMerge } from 'tailwind-merge';

type MotionButtonProps = Omit<ComponentProps<typeof motion.button>, 'ref'>;

interface ButtonProps extends MotionButtonProps {
    children: ReactNode;
    className?: string;
    active?: boolean;
}

export function Button({ children, className = '', active = false, ...props }: ButtonProps) {
    return (
        <motion.button
            whileTap={{ y: 1 }}
            className={twMerge(
                `border-button h-full cursor-pointer px-2 text-sm active:bg-zinc-900 ${active ? 'border-none bg-zinc-900 shadow-[inset_2px_2px_0px_oklch(14.1%_0.005_285.823),inset_-2px_-2px_0px_oklch(37%_0.013_285.805)]' : 'border-2 bg-zinc-800'}`,
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
}
