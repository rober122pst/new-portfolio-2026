import { create } from 'zustand';

interface UserStore {
    user: string | null;

    register: (username: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: localStorage.getItem('user'),

    register: async (username) => {
        localStorage.setItem('user', username);
        set({ user: username });
    },
}));
