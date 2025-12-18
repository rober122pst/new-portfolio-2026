import { create } from 'zustand';

export type Window = {
    id: string;
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

    setFocusWindow: (pid: string, setFocus: boolean) => boolean;
    minimizeWindow: (id: string) => void;
    maximizeWindow: (id: string) => void;

    setPosition: (id: string, position: { x: number; y: number }) => void;
    setSize: (id: string, size: { width: number; height: number }) => void;
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
                        position: { x: 0, y: 0 },
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
    closeWindow: (pid) =>
        set((state) => ({
            windows: state.windows.filter((w) => w.pid !== pid),
        })),

    setFocusWindow: (pid, setFocus) => {
        if (setFocus) {
            set((state) => {
                const nextZ = state.topZIndex + 1;

                return {
                    windows: state.windows.map((w) =>
                        w.pid === pid
                            ? { ...w, isFocused: true, zIndex: nextZ, isMinimized: false }
                            : { ...w, isFocused: false }
                    ),
                    topZIndex: nextZ,
                };
            });
            return true;
        } else {
            set((state) => ({
                windows: state.windows.map((w) => (w.pid === pid ? { ...w, isFocused: false } : w)),
            }));
            return false;
        }
    },

    minimizeWindow: (id) =>
        set((state) => ({
            windows: state.windows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)),
        })),

    maximizeWindow: (id) =>
        set((state) => ({
            windows: state.windows.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)),
        })),

    setPosition: (id, position) =>
        set((state) => ({
            windows: state.windows.map((w) => (w.id === id ? { ...w, position } : w)),
        })),

    setSize: (id, size) =>
        set((state) => ({
            windows: state.windows.map((w) => (w.id === id ? { ...w, size } : w)),
        })),
}));
