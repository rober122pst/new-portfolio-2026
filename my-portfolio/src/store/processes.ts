import { create } from 'zustand';
import type { AppId } from '../core/appRegistry';

type Process = {
    pid: string;
    appId: AppId;
    status: 'running' | 'suspended' | 'closed';
    isActive: boolean;
    data?: unknown;
};

type ProcessStore = {
    processes: Process[];

    openProcess: (appId: AppId, data?: unknown) => string;
    closeProcess: (pid: string) => void;
    getProcess: (pid: string) => Process | undefined;

    updateData: (pid: string, data: unknown) => void;

    toggleActive: (pid: string) => void;
};

export const useProcessStore = create<ProcessStore>((set, get) => ({
    processes: [],

    openProcess: (appId, data) => {
        const pid = crypto.randomUUID();
        set((state) => {
            return {
                processes: [
                    ...state.processes.map((p) => ({ ...p, isActive: false })),
                    { pid, appId, status: 'running', isActive: true, data },
                ],
            };
        });

        return pid;
    },

    closeProcess: (pid) => {
        set((state) => ({
            processes: state.processes.filter((p) => p.pid !== pid),
        }));
    },

    getProcess: (pid) => {
        return get().processes.find((p) => p.pid === pid);
    },

    updateData: (pid, data) => {
        set((state) => ({
            processes: state.processes.map((p) => (p.pid === pid ? { ...p, data } : p)),
        }));
    },

    toggleActive: (pid) => {
        set((state) => ({
            processes: state.processes.map((p) => ({
                ...p,
                isActive: p.pid === pid ? true : false,
            })),
        }));
    },
}));
