import { SYSTEM_IDS, useFileSystemActions, useFileSystemItem, useFolderItems } from '../../store/filesystem';
import { useProcess, useProcessActions } from '../../store/processes';

import { useState } from 'react';
import FileItem from '../../components/ui/fileItem';
import { useOpenFile } from '../../hooks/useOpenItem';

export default function FileExplorer({ pid }: { pid: string }) {
    const [selected, setSelected] = useState<string[]>([]);
    const { resolvePath } = useFileSystemActions();
    const { updateData: updateProcessData } = useProcessActions();
    const process = useProcess(pid);
    const currentFolderId = (process?.data as { currentFolderId: string }).currentFolderId || SYSTEM_IDS.MY_COMPUTER;

    const items = useFolderItems(currentFolderId);

    const currentFolderItem = useFileSystemItem(currentFolderId);

    const openFile = useOpenFile();

    const handleNavigate = (id: string, type: string) => {
        if (type === 'folder') {
            // SE FOR PASTA: Não abre janela! Atualiza o processo atual.
            updateProcessData(pid, { currentFolderId: id });
            console.log('Abrir pasta:', resolvePath(id));
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
        <div className="relative w-full h-full overflow-hidden">
            <div className="absolute h-full w-full min-h-0 bg-zinc-500 flex flex-wrap px-5 py-2 overflow-hidden">
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
        </div>
    );
}
