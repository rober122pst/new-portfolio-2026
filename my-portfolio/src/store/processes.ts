import { create } from 'zustand';
import type { AppId } from '../core/app-registry';

export type Process = {
    pid: string;
    appId: AppId;
    status: 'running' | 'suspended' | 'closed';
    isActive: boolean;
    data?: unknown;
};

type ProccesActions = {
    openProcess: (appId: AppId, data?: unknown) => string;
    closeProcess: (pid: string) => void;

    updateData: (pid: string, data: unknown) => void;

    toggleActive: (pid: string) => void;
};

type ProcessStore = {
    processes: Process[];
    actions: ProccesActions;
};

export const useProcessStore = create<ProcessStore>((set) => ({
    processes: [],

    actions: {
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
    },
}));

export const useProcesses = () => useProcessStore((s) => s.processes);
export const useProcess = (pid: string) => useProcessStore((state) => state.processes.find((p) => p.pid === pid));
export const useProcessActions = () => useProcessStore((s) => s.actions);
