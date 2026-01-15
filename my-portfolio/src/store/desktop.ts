import { create } from 'zustand';

interface DesktopStore {
    width: number;
    height: number;
    x: number;
    y: number;
    setSize: (w: number, h: number) => void;
    setPosition: (x: number, y: number) => void;
}

export const useDesktopStore = create<DesktopStore>((set) => ({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    setSize: (width, height) => set({ width, height }),
    setPosition: (x, y) => set({ x, y }),
}));

export const useDesktopScale = () => {
    const width = useDesktopStore.getState().width;
    const height = useDesktopStore.getState().height;

    return { width, height };
};

export const useDesktopPosition = () => {
    const x = useDesktopStore.getState().x;
    const y = useDesktopStore.getState().y;

    return { x, y };
};
