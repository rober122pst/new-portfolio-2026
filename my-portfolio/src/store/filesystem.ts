import type { JSX } from 'react';
import { create } from 'zustand';
import type { IconsProps } from '../components/ui/icons';

export type FileType = 'file' | 'folder';

export interface FileSystemItem {
    id: string;
    parentId: string | null;
    name: string;
    type: FileType;
    extension?: string;
    content?: unknown; // Apenas para arquivos. Armazena o conteúdo do arquivo. Pode ser string, binary, etc.
    icon?: ({ className, size }: IconsProps) => JSX.Element;
    createdAt: number;
}

interface FileSystemStore {
    items: Record<string, FileSystemItem>; // Mapeamento de ID para FileSystemItem
    rootId: string;

    createItem: (parentId: string, name: string, type: FileType, extension?: string) => string;
    deleteItem: (id: string) => void;
    renameItem: (id: string, newName: string) => void;

    updateFileContent: (id: string, content: unknown) => void;

    getItem: (id: string) => FileSystemItem | undefined;
    resolvePath: (path: string) => string;
}

const ROOT_ID = 'root';
const initialItems: Record<string, FileSystemItem> = {
    [ROOT_ID]: {
        id: ROOT_ID,
        parentId: null,
        name: 'C:',
        type: 'folder',
        createdAt: Date.now(),
    },
    'desktop-id': {
        id: 'desktop-id',
        parentId: ROOT_ID,
        name: 'Desktop',
        type: 'folder',
        createdAt: Date.now(),
    },
    'spider-man': {
        id: 'spider-man',
        parentId: 'desktop-id',
        name: 'spider-man',
        type: 'file',
        extension: 'txt',
        content: { text: 'A verdade é que... eu sou o Homem-Aranha.' },
        createdAt: Date.now(),
    },
};

export const selectItemsInFolder = (folderId: string) => (state: FileSystemStore) => {
    return Object.values(state.items).filter((item) => item.parentId === folderId);
};

export const useFileSystemStore = create<FileSystemStore>((set, get) => ({
    items: initialItems,
    rootId: ROOT_ID,

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
