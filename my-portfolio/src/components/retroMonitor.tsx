import type { ReactNode } from 'react';

interface RetroMonitorProps {
    children: ReactNode;
}

export function RetroMonitor({ children }: RetroMonitorProps) {
    return (
        <div className="relative max-w-360 h-screen overflow-hidden m-auto">
            <div className="crt grid grid-rows-[1fr_auto] h-screen m-auto">{children}</div>
            <div className="scanlines"></div>
        </div>
    );
}
