import type { ComponentProps, ReactNode } from 'react';

import { motion } from 'motion/react';
import { twMerge } from 'tailwind-merge';

type MotionButtonProps = Omit<ComponentProps<typeof motion.button>, 'ref'>;

interface ButtonProps extends MotionButtonProps {
    children: ReactNode;
    className?: string;
}

export function Button({ children, className = '', ...props }: ButtonProps) {
    return (
        <motion.button
            whileTap={{ y: 1 }}
            className={twMerge(
                'border-2 border-button bg-zinc-800 active:bg-zinc-900 h-full px-2 cursor-pointer text-sm',
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
}
