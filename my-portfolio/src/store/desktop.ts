import { create } from 'zustand';

interface DesktopStore {
    width: number;
    height: number;
    setSize: (w: number, h: number) => void;
}

export const useDesktopStore = create<DesktopStore>((set) => ({
    width: 0,
    height: 0,
    setSize: (width, height) => set({ width, height }),
}));
