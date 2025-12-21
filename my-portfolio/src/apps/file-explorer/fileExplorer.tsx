import { SYSTEM_IDS, selectItemsInFolder, useFileSystemStore } from '../../store/filesystem';

import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import FileItem from '../../components/fileItem';
import { openFile } from '../../core/system';
import { useProcessStore } from '../../store/processes';

export default function FileExplorer({ pid }: { pid: string }) {
    const [selected, setSelected] = useState<string[]>([]);
    const process = useProcessStore((s) => s.getProcess(pid));
    const updateProcessData = useProcessStore((s) => s.updateData);
    const currentFolderId = (process?.data as { currentFolderId: string }).currentFolderId || SYSTEM_IDS.MY_COMPUTER;

    const items = useFileSystemStore(useShallow(selectItemsInFolder(currentFolderId)));

    const currentFolderItem = useFileSystemStore((s) => s.getItem(currentFolderId));

    const handleNavigate = (id: string, type: string) => {
        if (type === 'folder') {
            // SE FOR PASTA: Não abre janela! Atualiza o processo atual.
            updateProcessData(pid, { currentFolderId: id });
        } else {
            // SE FOR ARQUIVO: Chama o lançador global (que abre o Notepad, etc.)
            openFile(id);
        }
    };

    const handleBack = () => {
        if (currentFolderItem && currentFolderItem.parentId) {
            updateProcessData(pid, { currentFolderId: currentFolderItem.parentId });
        }
    };

    const handleSelected = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
        e.stopPropagation();

        setSelected([id]);
    };

    return (
        <div className="relative w-full h-full bg-zinc-500 flex flex-wrap px-5 py-2">
            {items.length > 0 &&
                items.map((item) => {
                    const isSelected = selected.includes(item.id);

                    return (
                        <FileItem
                            key={item.id}
                            item={item}
                            isSelected={isSelected}
                            onClick={(e) => handleSelected(e, item.id)}
                            onDoubleClick={() => handleNavigate(item.id, item.type)}
                        />
                    );
                })}
        </div>
    );
}
