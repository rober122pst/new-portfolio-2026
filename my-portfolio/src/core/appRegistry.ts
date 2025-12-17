import { Notepad } from '../apps/notepad/notepad';
import { FolderIcon } from '../components/ui/icons';

export const appRegistry = {
    notepad: {
        name: 'Bloco de notas',
        icon: FolderIcon, // TODO: mudar depois
        component: Notepad,
        singleInstance: false,
    },
};

export type AppId = keyof typeof appRegistry;
export type AppConfig = (typeof appRegistry)[AppId];
