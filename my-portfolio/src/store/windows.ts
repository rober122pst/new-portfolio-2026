import { create } from 'zustand';

type Window = {
    id: number | string;
    pid: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    isMinimized: boolean;
    isMaximized: boolean;
    isFocused: boolean;
    zIndex: number;
};

type WindowStore = {
    windows: Window[];
    topZIndex: number;
    openWindow: (pid: string, size?: { width: number; height: number }) => void;
    closeWindow: (pid: string) => void;

    focusWindow: (pid: string) => void;
    minimizeWindow: (pid: string) => void;
    maximizeWindow: (pid: string) => void;
};

export const useWindowStore = create<WindowStore>((set) => ({
    windows: [],
    topZIndex: 1,
    openWindow: (pid, size = { width: 800, height: 600 }) => {
        set((state) => {
            const id = crypto.randomUUID();

            return {
                windows: [
                    ...state.windows.map((w) => ({ ...w, isFocused: false })),
                    {
                        id,
                        pid,
                        position: { x: 150, y: 150 },
                        size: size,
                        isMinimized: false,
                        isMaximized: false,
                        isFocused: true,
                        zIndex: state.topZIndex + 1,
                    },
                ],
                topZIndex: state.topZIndex + 1,
            };
        });
    },
    closeWindow: (id) =>
        set((state) => ({
            windows: state.windows.filter((w) => w.id !== id),
        })),

    focusWindow: (id) =>
        set((state) => {
            const nextZ = state.topZIndex + 1;

            return {
                windows: state.windows.map((w) =>
                    w.id === id ? { ...w, isFocused: true, zIndex: nextZ } : { ...w, isFocused: false }
                ),
                topZIndex: nextZ,
            };
        }),

    minimizeWindow: (id) =>
        set((state) => ({
            windows: state.windows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)),
        })),

    maximizeWindow: (id) =>
        set((state) => ({
            windows: state.windows.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)),
        })),
}));
