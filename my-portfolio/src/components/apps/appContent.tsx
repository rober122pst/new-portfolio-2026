import { twMerge } from 'tailwind-merge';

interface AppHeaderProps {
    children: React.ReactNode;
    className?: string;
}
interface AppContentProps {
    children: React.ReactNode;
    className?: string;
}

export function AppHeader({ children, className }: AppHeaderProps) {
    return <div className={twMerge('flex flex-col gap-px bg-zinc-700 pt-px', className)}>{children}</div>;
}

export function AppContent({ children, className }: AppContentProps) {
    return (
        <div className="relative h-full w-full overflow-hidden">
            <div
                className={twMerge(
                    'absolute inset-0 min-h-0 overflow-hidden border border-t-zinc-950 border-r-zinc-700 border-b-zinc-700 border-l-zinc-950 bg-zinc-900',
                    className
                )}
            >
                {children}
            </div>
        </div>
    );
}
