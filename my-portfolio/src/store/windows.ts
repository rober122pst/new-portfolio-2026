import { create } from 'zustand';
import { useDesktopStore } from './desktop';
import { useProcessStore } from './processes';

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

type WindowActions = {
    openWindow: (pid: string, size?: { width: number; height: number }) => void;
    closeWindow: (pid: string) => void;

    setFocusWindow: (pid: string, setFocus: boolean) => boolean;
    minimizeWindow: (id: string) => void;
    toggleMaximizeWindow: (id: string) => void;

    setPosition: (id: string, position: { x: number; y: number }) => void;
    setSize: (id: string, size: { width: number; height: number }) => void;

    getWindow: (params: { id?: string; pid?: string }) => Window | undefined;
};

type WindowStore = {
    windows: Window[];
    topZIndex: number;
    actions: WindowActions;
};

export const useWindowStore = create<WindowStore>((set, get) => ({
    windows: [],
    topZIndex: 1,
    actions: {
        openWindow: (pid, size = { width: 800, height: 600 }) => {
            set((state) => {
                const id = crypto.randomUUID();
                const toggleActive = useProcessStore.getState().actions.toggleActive;

                toggleActive(pid);

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
            const toggleActive = useProcessStore.getState().actions.toggleActive;
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
                toggleActive(pid);
                return true;
            } else {
                set((state) => ({
                    windows: state.windows.map((w) => (w.pid === pid ? { ...w, isFocused: false } : w)),
                }));
                toggleActive('');
                return false;
            }
        },

        minimizeWindow: (id) => {
            set((state) => ({
                windows: state.windows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)),
            }));
        },

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

        getWindow: ({ id, pid }) => {
            return get().windows.find((w) => (id ? w.id === id : pid ? w.pid === pid : false));
        },
    },
}));

export const useWindows = () => useWindowStore((s) => s.windows);
export const useWindowActions = () => useWindowStore((s) => s.actions);
