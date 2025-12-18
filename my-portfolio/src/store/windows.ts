import { create } from 'zustand';
import { useDesktopStore } from './desktop';

export type Window = {
    id: string;
    pid: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    isMinimized: boolean;
    isMaximized: boolean;
    isFocused: boolean;
    zIndex: number;

    restoreBounds?: {
        position: { x: number; y: number };
        size: { width: number; height: number };
    };
};

type WindowStore = {
    windows: Window[];
    topZIndex: number;
    openWindow: (pid: string, size?: { width: number; height: number }) => void;
    closeWindow: (pid: string) => void;

    setFocusWindow: (pid: string, setFocus: boolean) => boolean;
    minimizeWindow: (id: string) => void;
    toggleMaximizeWindow: (id: string) => void;

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
                        position: { x: 20 + state.windows.length * 10, y: 20 + state.windows.length * 20 },
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

    toggleMaximizeWindow: (id) => {
        const { width, height } = useDesktopStore.getState();

        set((state) => ({
            windows: state.windows.map((w) => {
                if (w.id !== id) return w;

                if (w.isMaximized) {
                    if (!w.restoreBounds) return w;

                    return {
                        ...w,
                        ...w.restoreBounds,
                        isMaximized: false,
                    };
                }
                return {
                    ...w,
                    isMaximized: !w.isMaximized,
                    isFocused: true,
                    isMinimized: false,
                    restoreBounds: { position: w.position, size: w.size },
                    position: { x: 0, y: 0 },
                    size: { width, height },
                };
            }),
        }));
    },

    setPosition: (id, position) =>
        set((state) => ({
            windows: state.windows.map((w) => (w.id === id ? { ...w, position } : w)),
        })),

    setSize: (id, size) =>
        set((state) => ({
            windows: state.windows.map((w) => (w.id === id ? { ...w, size } : w)),
        })),
}));
