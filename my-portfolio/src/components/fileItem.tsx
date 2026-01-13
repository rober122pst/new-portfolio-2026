import type { ButtonHTMLAttributes } from 'react';
import { useMemo } from 'react';
import { getFileIcon } from '../core/system';
import { useOpenFile } from '../hooks/useOpenItem';
import type { FileSystemItem } from '../store/filesystem';

interface FileItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    item: FileSystemItem;
    isSelected?: boolean;
}

export default function FileItem({ item, isSelected, ...props }: FileItemProps) {
    const IconComponent = useMemo(() => {
        return getFileIcon(item);
    }, [item]);

    const openFile = useOpenFile();

    return (
        <button
            key={item.id}
            data-selected={isSelected}
            className="
                            relative
                            w-24 h-fit
                            flex flex-col items-center justify-center
                            cursor-pointer
                            text-white
                            select-none 
                            py-1.5 wrap-break-word
                            hover:bg-white/20
                            data-[selected=true]:bg-white/40
                        "
            onDoubleClick={(e) => {
                e.stopPropagation();
                openFile(item.id);
            }}
            {...props}
        >
            {/* eslint-disable-next-line react-hooks/static-components */}
            <IconComponent isShortcut={item.type === 'shortcut'} size={40} />
            <span className="text-xs mt-1 text-center">
                {item.name}
                {item.type === 'file' ? `.${item.extension}` : ''}
            </span>
        </button>
    );
}
