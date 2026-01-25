import { useMonitorStore } from '../store/monitor';

export default function CRTOverlays() {
    const scale = useMonitorStore((s) => s.scale);
    const finalHeight = 600 * scale;
    const finalWidth = 800 * scale;

    return (
        <div
            className="pointer-events-none absolute z-50 overflow-hidden"
            style={{ width: finalWidth, height: finalHeight }}
        >
            <div className="crt" />
            <div className="scanlines" />
        </div>
    );
}
