import { create } from 'zustand';

export type SystemState = 'BOOT' | 'LOOK' | 'DESKTOP' | 'SHUTDOWN';

interface SystemStore {
    currentState: SystemState;
    setScreen: (state: SystemState) => void;
}

const checkInitialScreen = (): SystemState => {
    if (sessionStorage.getItem('ligado')) {
        if (!localStorage.getItem('user')) {
            return 'LOOK';
        } else {
            return 'DESKTOP';
        }
    }
    return 'BOOT';
};

export const useKernelStore = create<SystemStore>((set) => ({
    currentState: checkInitialScreen(),
    setScreen: (s) => set({ currentState: s }),
}));
