import { type ReactNode } from 'react';
import { useScale } from '../store/monitor';
import CRTOverlays from './crtOverlays';

interface RetroMonitorProps {
    children: ReactNode;
}

export default function RetroMonitor({ children }: RetroMonitorProps) {
    const scale = useScale();
    return (
        <div className="flex h-screen items-center justify-center overflow-hidden bg-black">
            <div style={{ scale }} className="relative mx-auto aspect-4/3 h-150 origin-center overflow-hidden">
                <div className="m-auto h-full w-full">{children}</div>
            </div>
            <CRTOverlays />
        </div>
    );
}
