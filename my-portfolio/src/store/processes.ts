import { create } from 'zustand';
import type { AppId } from '../core/appRegistry';

type Process = {
    pid: string;
    appId: AppId;
    status: 'running' | 'suspended' | 'closed';
    data?: unknown;
};

type ProcessStore = {
    processes: Process[];

    openProcess: (appId: AppId, data?: unknown) => string;
    closeProcess: (pid: string) => void;
    getProcess: (pid: string) => Process | undefined;
};

export const useProcessStore = create<ProcessStore>((set, get) => ({
    processes: [],

    openProcess: (appId, data) => {
        const pid = crypto.randomUUID();
        set((state) => {
            return {
                processes: [...state.processes, { pid, appId, status: 'running', data }],
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
}));
