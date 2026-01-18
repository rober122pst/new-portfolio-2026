import { SYSTEM_IDS, useFileSystemActions, useFileSystemItem, useFolderItems } from '../../../store/filesystem';
import { useProcess, useProcessActions } from '../../../store/processes';

import { useState } from 'react';
import Split from 'react-split';
import { useOpenFile } from '../../../hooks/useOpenItem';
import FileItem from '../../ui/fileItem';
import AppContent from '../appContent';
import FileExplorerSidebar from './sidebar';

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
        <AppContent>
            <Split
                className="flex h-full w-full overflow-hidden bg-zinc-900"
                sizes={[25, 75]}
                gutterSize={6}
                direction="horizontal"
            >
                <div className="overflow-auto">
                    <FileExplorerSidebar onNavigate={handleNavigate} />
                </div>
                <div className="flex flex-wrap">
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
            </Split>
        </AppContent>
    );
}
