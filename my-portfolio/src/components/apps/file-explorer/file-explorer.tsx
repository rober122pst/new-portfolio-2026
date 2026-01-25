import { useFileSystemActions, useFolderItems } from '@store/filesystem';
import { useProcess, useProcessActions } from '@store/processes';
import { AppContent, AppHeader } from '../app-content';

import { SYSTEM_IDS } from '@/core/files';
import FileItem from '@components/ui/file-item';
import { useOpenFile } from '@hooks/useOpenItem';
import { useState } from 'react';
import Split from 'react-split';
import FileExplorerHeader from './header';
import FileExplorerSidebar from './sidebar';

export default function FileExplorer({ pid }: { pid: string }) {
    const [selected, setSelected] = useState<string[]>([]);
    const { resolvePath } = useFileSystemActions();
    const { updateData: updateProcessData } = useProcessActions();
    const process = useProcess(pid);
    const currentFolderId = (process?.data as { currentFolderId: string }).currentFolderId || SYSTEM_IDS.MY_COMPUTER;

    const items = useFolderItems(currentFolderId);

    const openFile = useOpenFile();

    const handleNavigate = (id: string, type: string) => {
        if (type === 'folder') {
            // SE FOR PASTA: Não abre janela! Atualiza o processo atual.
            updateProcessData(pid, { currentFolderId: id });
        } else {
            // SE FOR ARQUIVO: Chama o lançador global (que abre o Notepad, etc.)
            openFile(id);
        }
    };

    const handleSelected = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
        e.stopPropagation();

        setSelected([id]);
    };

    return (
        <>
            <AppHeader>
                <FileExplorerHeader path={resolvePath(currentFolderId)} />
            </AppHeader>
            <AppContent className="flex flex-col border-t-zinc-900">
                <div className="h-1.25 w-full border-t border-t-zinc-700 bg-zinc-800" />
                <Split
                    className="flex w-full flex-1 overflow-hidden bg-zinc-900"
                    cursor="ew-resize"
                    sizes={[25, 75]}
                    gutterSize={6}
                    direction="horizontal"
                >
                    <div className="custom-scrollbar h-full min-w-24 overflow-auto border-t border-t-zinc-950">
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
        </>
    );
}
