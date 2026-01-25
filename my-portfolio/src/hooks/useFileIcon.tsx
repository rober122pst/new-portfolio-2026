import { appRegistry } from '../core/app-registry';
import { useFileSystemItem, type FileSystemItem } from '../store/filesystem';
import { fileIcon, folderIcon } from '../utils/icons-src';

const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'ico', 'webp'];

export function useFileIcon(item: FileSystemItem): string {
    const targetId = item.type === 'shortcut' && item.metadata?.targetId ? item.metadata.targetId : item.id;

    const targetItem = useFileSystemItem(targetId);

    if (item.icon) return item.icon;

    if (item.type === 'shortcut') {
        if (item.metadata?.appId) {
            const app = appRegistry[item.metadata.appId];
            return app ? app.icon : fileIcon;
        }

        if (targetItem) {
            if (targetItem.icon) return targetItem.icon;
            if (targetItem.type === 'folder') return folderIcon;

            const ext = targetItem.extension;
            const appEntry = Object.values(appRegistry).find((app) => app.supportedExtensions?.includes(ext || ''));
            if (appEntry?.fileIcon) return appEntry.fileIcon;
        }

        return folderIcon;
    }

    if (imageExtensions.includes(item.extension?.toLowerCase() || '')) {
        return (item.content as string) || fileIcon;
    }

    if (item.type === 'folder') return folderIcon;

    const ext = item.extension;
    const appEntry = Object.values(appRegistry).find((app) => app.supportedExtensions?.includes(ext || ''));
    if (appEntry?.fileIcon) return appEntry.fileIcon;

    return fileIcon;
}
