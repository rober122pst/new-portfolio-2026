import { errorIcon, explorerIcon, notepadIcon, txtIcon } from '../utils/icons-src';

import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
const DialogBox = lazy(() => import('../components/apps/error-window/dialog-box'));
const FileExplorer = lazy(() => import('../components/apps/file-explorer/file-explorer'));
const Notepad = lazy(() => import('../components/apps/notepad/notepad'));

interface App {
    name: string;
    fileIcon?: string;
    icon: string;
    component: LazyExoticComponent<ComponentType<{ pid: string }>> | ComponentType<{ pid: string }>;
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
        supportedExtensions: ['txt', 'md', 'json', 'js', 'java', 'sys'],
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
