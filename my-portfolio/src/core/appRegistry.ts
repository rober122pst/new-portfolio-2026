import { ExplorerIcon, NotepadIcon, TXTIcon, type IconProps } from '../components/ui/icons';

import type { JSX } from 'react';
import Explorer from '../apps/notepad/explorer';
import Notepad from '../apps/notepad/notepad';

interface App {
    name: string;
    fileIcon?: (props: IconProps) => JSX.Element;
    icon: (props: IconProps) => JSX.Element;
    component: ({ pid }: { pid: string }) => JSX.Element;
    singleInstance: boolean;
    supportedExtensions?: string[];
}

export const appRegistry: Record<string, App> = {
    notepad: {
        name: 'Bloco de notas',
        fileIcon: TXTIcon, // TODO: mudar depois
        icon: NotepadIcon,
        component: Notepad,
        singleInstance: false,
        supportedExtensions: ['txt', 'md', 'json', 'js', 'java'],
    },
    explorer: {
        name: 'Explorador de Arquivos',
        icon: ExplorerIcon,
        component: Explorer,
        singleInstance: false,
    },
};

export type AppId = keyof typeof appRegistry;
export type AppConfig = (typeof appRegistry)[AppId];
