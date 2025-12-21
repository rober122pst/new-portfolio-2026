import { useFileSystemStore } from '../store/filesystem';
import { useProcessStore } from '../store/processes';
import { useWindowStore } from '../store/windows';
import { appRegistry, type AppId } from './appRegistry';

import type { JSX } from 'react';
import { FolderIcon, type IconProps } from '../components/ui/icons';
import type { FileSystemItem } from '../store/filesystem';

export function openFile(fileId: string) {
    const file = useFileSystemStore.getState().getItem(fileId);
    const resolvePath = useFileSystemStore.getState().resolvePath;
    if (!file) return;

    if (file.type === 'shortcut' && file.metadata) {
        if (file.metadata.appId) {
            const pid = useProcessStore.getState().openProcess(file.metadata.appId);
            useWindowStore.getState().openWindow(pid);
            return;
        }

        if (file.metadata.targetId) {
            openFile(file.metadata.targetId);
            return;
        }
    }

    if (file.type === 'folder') {
        console.log('Abrir pasta:', resolvePath(file.id));
        const pid = useProcessStore.getState().openProcess('fileExplorer', {
            currentFolderId: file.id,
        });

        useWindowStore.getState().openWindow(pid);
        return;
    }

    const extension = file.extension?.toLowerCase();

    if (!extension) {
        alert('Arquivo sem extensão, não sei como abrir.'); // TODO: fazer modal de alerta
        return;
    }

    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const appEntry = Object.entries(appRegistry).find(([_, config]) => config.supportedExtensions?.includes(extension));

    if (appEntry) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [appId, _] = appEntry;

        const pid = useProcessStore.getState().openProcess(appId as AppId, {
            fileId: file.id,
        });

        useWindowStore.getState().openWindow(pid);
    } else {
        alert(`Nenhum aplicativo instalado para abrir arquivos .${extension}`);
    }
}

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
