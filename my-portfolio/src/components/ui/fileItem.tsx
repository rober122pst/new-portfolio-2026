import type { ButtonHTMLAttributes } from 'react';
import { useFileIcon } from '../../hooks/useFileIcon';
import { useOpenFile } from '../../hooks/useOpenItem';
import type { FileSystemItem } from '../../store/filesystem';
import { BaseIcon } from './icons';

interface FileItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    item: FileSystemItem;
    isSelected?: boolean;
}

export default function FileItem({ item, isSelected, ...props }: FileItemProps) {
    const icon = useFileIcon(item);

    const openFile = useOpenFile();

    console.log(icon);

    return (
        <button
            data-selected={isSelected}
            className="relative flex h-fit w-24 cursor-pointer flex-col items-center justify-center py-1.5 wrap-break-word text-white select-none hover:bg-white/20 data-[selected=true]:bg-white/40"
            onDoubleClick={(e) => {
                e.stopPropagation();
                openFile(item.id);
            }}
            {...props}
        >
            <BaseIcon src={icon} isShortcut={item.type === 'shortcut'} />
            <span className="mt-1 text-center text-xs">
                {item.name}
                {item.type === 'file' ? `.${item.extension}` : ''}
            </span>
        </button>
    );
}
