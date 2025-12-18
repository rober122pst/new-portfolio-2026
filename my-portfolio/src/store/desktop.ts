// useDesktopStore.ts

import { create } from 'zustand';

interface DesktopStore {
    width: number;
    height: number;
    // eslint-disable-next-line no-unused-vars
    setSize: (w: number, h: number) => void;
}

export const useDesktopStore = create<DesktopStore>((set) => ({
    width: 0,
    height: 0,
    setSize: (width, height) => set({ width, height }),
}));
