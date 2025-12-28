import { type ReactNode } from 'react';
import { useMonitorStore } from '../store/monitor';
import CRTOverlays from './crtOverlays';

interface RetroMonitorProps {
    children: ReactNode;
}

export default function RetroMonitor({ children }: RetroMonitorProps) {
    const scale = useMonitorStore((s) => s.scale);
    return (
        <div className="flex items-center justify-center h-screen bg-black overflow-hidden">
            <div style={{ scale }} className="relative aspect-4/3 h-150 overflow-hidden mx-auto origin-center">
                <div className="grid grid-rows-[1fr_auto] h-full m-auto">{children}</div>
            </div>
            <CRTOverlays />
        </div>
    );
}
