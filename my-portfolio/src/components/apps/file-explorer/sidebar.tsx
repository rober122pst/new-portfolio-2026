import { BaseIcon } from '@components/ui/icons';
import { useFileIcon } from '@hooks/useFileIcon';
import { useFolderItems, useItems, type FileSystemItem } from '@store/filesystem';
import { useState } from 'react';

interface FileProps {
    item: FileSystemItem;
    open?: boolean;
    isLast?: boolean;
    onNavigate: (id: string, type: string) => void;
}

function File({ item, open, isLast, onNavigate }: FileProps) {
    const [isOpen, setOpen] = useState(open);
    const contentFolder = useFolderItems(item.id);

    const icon = useFileIcon(item);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setOpen(!isOpen);
    };

    if (item.type !== 'folder') return null;
    return (
        <div className="relative ml-4 flex flex-col text-xs text-white">
            <div
                className={`absolute top-0 -left-3 w-px border-l border-dotted border-zinc-400 ${isLast ? 'h-2.5' : 'h-full'}`}
            />
            <div className="absolute top-2.5 -left-2.5 w-2.5 border-t border-dotted border-zinc-400" />
            <div className="relative flex h-5 items-center" onClick={() => onNavigate(item.id, item.type)}>
                <button
                    onClick={handleClick}
                    data-haschildren={contentFolder.filter((i) => i.type === 'folder').length > 0}
                    className="absolute -left-2.75 z-10 flex size-2.75 -translate-x-1/2 cursor-pointer items-center justify-center border border-zinc-800 bg-zinc-700 px-0 text-[8px] data-[haschildren=false]:invisible"
                >
                    {isOpen ? '-' : '+'}
                </button>
                <div className="flex min-w-0 flex-1 items-center gap-0.5">
                    <span>
                        <BaseIcon src={icon} size={16} />
                    </span>
                    <span className="w-full overflow-hidden px-1 pr-1 text-[10px] whitespace-nowrap">{item.name}</span>
                </div>
            </div>

            {contentFolder.map(
                (child, index) =>
                    isOpen && (
                        <File
                            key={child.id}
                            item={child}
                            isLast={index === contentFolder.length - 1}
                            onNavigate={onNavigate}
                        />
                    )
            )}
        </div>
    );
}

export default function FileExplorerSidebar({ onNavigate }: { onNavigate: (id: string, type: string) => void }) {
    const items = useItems();
    return (
        <div className="h-full w-fit px-2 py-3">
            <File item={items['desktop-id']} open isLast onNavigate={onNavigate} />
        </div>
    );
}
