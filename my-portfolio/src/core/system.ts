import { useFileSystemStore } from '../store/filesystem';
import { appRegistry } from './appRegistry';

import type { JSX } from 'react';
import { FolderIcon, type IconProps } from '../components/ui/icons';
import type { FileSystemItem } from '../store/filesystem';

// Esta função devolve o Componente do ícone correto
export function getFileIcon(file: FileSystemItem): (props: IconProps) => JSX.Element {
    if (file.icon) {
        return file.icon;
    }

    if (file.type === 'shortcut' && file.metadata) {
        if (file.metadata.appId) {
            const app = appRegistry[file.metadata.appId];
            return app ? app.icon : FolderIcon; // TODO muda aqui né
        }

        if (file.metadata.targetId) {
            const targetItem = useFileSystemStore.getState().getItem(file.metadata.targetId);
            if (targetItem) {
                return getFileIcon(targetItem);
            }
        }
    }

    if (file.type === 'folder') {
        return FolderIcon;
    }

    const extension = file.extension;

    // Procura no Registry qual app abre essa extensão
    const appEntry = Object.values(appRegistry).find((app) => app.supportedExtensions?.includes(extension || ''));

    // Se achou um app (ex: Notepad), retorna o ícone desse app
    if (appEntry?.fileIcon) {
        return appEntry.fileIcon;
    }

    return FolderIcon;
}
