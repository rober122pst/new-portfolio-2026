import type { JSX } from 'react';
import { create } from 'zustand';
import { MyComputerIcon, type IconProps } from '../components/ui/icons';
import type { AppId } from '../core/appRegistry';

export const SYSTEM_IDS = {
    ROOT: 'root',
    C_DRIVE: 'disk-c',
    DESKTOP: 'desktop-id',
    MY_COMPUTER: 'my-computer-virtual-id',
    DOCUMENTS: 'documents-id',
};

export type FileType = 'file' | 'folder' | 'shortcut';

export interface FileSystemItem {
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
}

interface FileSystemStore {
    items: Record<string, FileSystemItem>; // Mapeamento de ID para FileSystemItem
    rootId: string;

    createItem: (parentId: string, name: string, type: FileType, extension?: string) => string;
    deleteItem: (id: string) => void;
    renameItem: (id: string, newName: string) => void;

    updateFileContent: (id: string, content: unknown) => void;

    getItem: (id: string) => FileSystemItem | undefined;
    resolvePath: (id: string) => string;
}

const initialItems: Record<string, FileSystemItem> = {
    [SYSTEM_IDS.ROOT]: {
        id: SYSTEM_IDS.ROOT,
        parentId: null,
        name: 'Meu Computador',
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
    [SYSTEM_IDS.DESKTOP]: {
        id: SYSTEM_IDS.DESKTOP,
        parentId: SYSTEM_IDS.C_DRIVE,
        name: 'Área de Trabalho',
        type: 'folder',
        createdAt: Date.now(),
    },
    [SYSTEM_IDS.MY_COMPUTER]: {
        id: SYSTEM_IDS.MY_COMPUTER,
        parentId: SYSTEM_IDS.DESKTOP,
        name: 'Meu Computador',
        type: 'shortcut',
        icon: MyComputerIcon,
        metadata: {
            targetId: SYSTEM_IDS.ROOT,
        },
        createdAt: Date.now(),
    },
    [SYSTEM_IDS.DOCUMENTS]: {
        id: SYSTEM_IDS.DOCUMENTS,
        parentId: SYSTEM_IDS.C_DRIVE,
        name: 'Documentos',
        type: 'folder',
        createdAt: Date.now(),
    },
};

export const selectItemsInFolder = (folderId: string) => (state: FileSystemStore) => {
    return Object.values(state.items).filter((item) => item.parentId === folderId);
};

export const useFileSystemStore = create<FileSystemStore>((set, get) => ({
    items: initialItems,
    rootId: SYSTEM_IDS.ROOT,

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

    getItem: (id) => {
        return get().items[id];
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
}));
