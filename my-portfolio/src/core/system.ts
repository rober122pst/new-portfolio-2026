import { useFileSystemStore } from '../store/filesystem';
import { useProcessStore } from '../store/processes';
import { useWindowStore } from '../store/windows';
import { appRegistry, type AppId } from './appRegistry';

import { FolderIcon } from '../components/ui/icons';
import type { FileSystemItem } from '../store/filesystem';

export function openFile(fileId: string) {
    const file = useFileSystemStore.getState().getItem(fileId);
    if (!file) return;

    if (file.type === 'folder') {
        console.log('Abrir pasta:', file.name);
        return;
    }

    const extension = file.extension?.toLowerCase();

    if (!extension) {
        alert('Arquivo sem extensão, não sei como abrir.'); // TODO: fazer modal de alerta
        return;
    }

    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const appEntry = Object.entries(appRegistry).find(([_, config]) => config.supportedExtensions.includes(extension));

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
export function getFileIcon(file: FileSystemItem) {
    if (file.icon) {
        return file.icon;
    }

    if (file.type === 'folder') {
        return FolderIcon;
    }

    const extension = file.extension;

    // Procura no Registry qual app abre essa extensão
    const appEntry = Object.values(appRegistry).find((app) => app.supportedExtensions.includes(extension || ''));

    // Se achou um app (ex: Notepad), retorna o ícone desse app
    if (appEntry) {
        return appEntry.fileIcon;
    }

    return FolderIcon;
}
