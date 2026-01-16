import type { JSX } from 'react';
import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { MyComputerIcon, type IconProps } from '../components/ui/icons';
import type { AppId } from '../core/appRegistry';

export const SYSTEM_IDS = {
    ROOT: 'root',
    C_DRIVE: 'disk-c',
    DESKTOP: 'desktop-id',
    MY_COMPUTER: 'my-computer-virtual-id',
    DOCUMENTS: 'documents-id',
    USERS: 'users-id',
    USER: 'user-id',
    SYSTEM: 'rbxOS-id',
};

export type FileType = 'file' | 'folder' | 'shortcut';

export type FileSystemItem = {
    id: string;
    parentId: string | null;
    name: string;
    type: FileType;
    extension?: string;
    content?: unknown; // Apenas para arquivos. Armazena o conteúdo do arquivo. Pode ser string, binary, etc.
    icon?: (props: IconProps) => JSX.Element;
    createdAt: number;

    metadata?: {
        targetPath?: string;
        targetId?: string;
        appId?: AppId;
    };
};

type FileSystemActions = {
    createItem: (parentId: string, name: string, type: FileType, extension?: string) => string;
    deleteItem: (id: string) => void;
    renameItem: (id: string, newName: string) => void;

    updateFileContent: (id: string, content: unknown) => void;

    resolvePath: (id: string) => string;
};

interface FileSystemStore {
    items: Record<string, FileSystemItem>; // Mapeamento de ID para FileSystemItem
    rootId: string;
    actions: FileSystemActions;
}

const initialItems: Record<string, FileSystemItem> = {
    [SYSTEM_IDS.DESKTOP]: {
        id: SYSTEM_IDS.DESKTOP,
        parentId: null,
        name: 'Área de Trabalho',
        type: 'folder',
        createdAt: Date.now(),
    },
    [SYSTEM_IDS.ROOT]: {
        id: SYSTEM_IDS.ROOT,
        parentId: SYSTEM_IDS.DESKTOP,
        name: 'Meu Computador',
        icon: MyComputerIcon,
        type: 'folder',
        createdAt: Date.now(),
    },
    [SYSTEM_IDS.C_DRIVE]: {
        id: SYSTEM_IDS.C_DRIVE,
        parentId: SYSTEM_IDS.ROOT,
        name: 'C:',
        type: 'folder',
        createdAt: Date.now(),
    },
    [SYSTEM_IDS.USER]: {
        id: SYSTEM_IDS.USER,
        parentId: SYSTEM_IDS.C_DRIVE,
        name: localStorage.getItem('user') ?? 'User',
        type: 'folder',
        createdAt: Date.now(),
    },
    [SYSTEM_IDS.SYSTEM]: {
        id: SYSTEM_IDS.SYSTEM,
        parentId: SYSTEM_IDS.C_DRIVE,
        name: 'rbx',
        type: 'folder',
        createdAt: Date.now(),
    },
    [SYSTEM_IDS.DOCUMENTS]: {
        id: SYSTEM_IDS.DOCUMENTS,
        parentId: SYSTEM_IDS.DESKTOP,
        name: 'Meus Documentos',
        type: 'folder',
        createdAt: Date.now(),
    },
    corn: {
        id: 'corn',
        parentId: SYSTEM_IDS.USER,
        name: 'toy chica nude',
        type: 'file',
        extension: 'jpg',
        createdAt: Date.now(),
    },
};

export const useFileSystemStore = create<FileSystemStore>((set, get) => ({
    items: initialItems,
    rootId: SYSTEM_IDS.ROOT,

    actions: {
        createItem: (parentId, name, type, extension) => {
            const id = crypto.randomUUID();
            const newItem: FileSystemItem = {
                id,
                parentId,
                name,
                type,
                extension: type === 'file' ? extension : undefined,
                createdAt: Date.now(),
            };

            set((state) => ({
                items: { ...state.items, [id]: newItem },
            }));

            return id;
        },
        deleteItem: (id) => {
            set((state) => {
                const newItems = { ...state.items };

                const deleteRecursive = (itemId: string) => {
                    const children = Object.values(newItems).filter((item) => item.parentId === itemId);
                    children.forEach((children) => deleteRecursive(children.id));
                    delete newItems[itemId];
                };

                deleteRecursive(id);
                return { items: newItems };
            });
        },
        renameItem: (id, newName) => {
            set((state) => ({
                items: {
                    ...state.items,
                    [id]: { ...state.items[id], name: newName },
                },
            }));
        },

        updateFileContent: (id, content) => {
            set((state) => ({
                items: {
                    ...state.items,
                    [id]: { ...state.items[id], content },
                },
            }));
        },

        resolvePath: (id) => {
            const state = get();
            let currentItem = state.items[id];
            const pathParts: string[] = [];

            while (currentItem) {
                pathParts.unshift(currentItem.name);
                if (!currentItem.parentId) break;
                currentItem = state.items[currentItem.parentId];
            }

            return pathParts.join('/');
        },
    },
}));

export const useItems = () => useFileSystemStore((s) => s.items);
export const useFileSystemItem = (id: string) => useFileSystemStore((s) => s.items[id]);
export const useSystemRootId = () => useFileSystemStore((s) => s.rootId);
export const useFolderItems = (folderId: string) => {
    return useFileSystemStore(useShallow((s) => Object.values(s.items).filter((item) => item.parentId === folderId)));
};
export const useFileSystemActions = () => useFileSystemStore((s) => s.actions);
