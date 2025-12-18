import { NotepadIcon, TXTIcon } from '../components/ui/icons';

import { Notepad } from '../apps/notepad/notepad';

export const appRegistry = {
    notepad: {
        name: 'Bloco de notas',
        fileIcon: TXTIcon, // TODO: mudar depois
        icon: NotepadIcon,
        component: Notepad,
        singleInstance: false,
        supportedExtensions: ['txt', 'md', 'json', 'js', 'java'],
    },
};

export type AppId = keyof typeof appRegistry;
export type AppConfig = (typeof appRegistry)[AppId];
