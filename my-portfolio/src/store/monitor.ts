import { create } from 'zustand';

interface Monitor {
    scale: number;
    updateScale: () => void;
}

export const useMonitorStore = create<Monitor>((set) => ({
    scale: window.innerHeight / 600,
    updateScale: () => set({ scale: window.innerHeight / 600 }),
}));

window.addEventListener('resize', () => {
    useMonitorStore.getState().updateScale();
});
