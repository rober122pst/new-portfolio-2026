import { twMerge } from 'tailwind-merge';

interface AppContentProps {
    children: React.ReactNode;
    className?: string;
}

export default function AppContent({ children, className }: AppContentProps) {
    return (
        <div className="relative h-full w-full overflow-hidden">
            <div
                className={twMerge(
                    'absolute inset-0 min-h-0 overflow-hidden border-t border-l border-t-zinc-950 border-l-zinc-950',
                    className
                )}
            >
                {children}
            </div>
        </div>
    );
}
