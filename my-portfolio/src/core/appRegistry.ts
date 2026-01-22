import { errorIcon, explorerIcon, notepadIcon, txtIcon } from '../utils/iconsSrc';

import type { JSX } from 'react';
import DialogBox from '../components/apps/error-window/dialogBox';
import FileExplorer from '../components/apps/file-explorer/fileExplorer';
import Notepad from '../components/apps/notepad/notepad';

interface App {
    name: string;
    fileIcon?: string;
    icon: string;
    component: ({ pid }: { pid: string }) => JSX.Element;
    singleInstance: boolean;
    supportedExtensions?: string[];
}

export const appRegistry: Record<string, App> = {
    notepad: {
        name: 'Bloco de notas',
        fileIcon: txtIcon,
        icon: notepadIcon,
        component: Notepad,
        singleInstance: false,
        supportedExtensions: ['txt', 'md', 'json', 'js', 'java'],
    },
    fileExplorer: {
        name: 'Explorador de Arquivos',
        icon: explorerIcon,
        component: FileExplorer,
        singleInstance: false,
    },
    dialogBox: {
        name: 'Error',
        icon: errorIcon,
        component: DialogBox,
        singleInstance: true,
    },
};

export type AppId = keyof typeof appRegistry;
export type AppConfig = (typeof appRegistry)[AppId];
