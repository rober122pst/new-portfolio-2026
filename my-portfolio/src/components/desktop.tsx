import { useEffect, useMemo, useRef, useState } from 'react';
import { getFileIcon, openFile } from '../core/system';
import { selectItemsInFolder, useFileSystemStore } from '../store/filesystem';

import { useShallow } from 'zustand/react/shallow';
import { useDesktopStore } from '../store/desktop';
import { Button } from './ui/buttons';
import { WindowManager } from './windowManager';

let count = 0; // TODO tirar dps

export function Desktop() {
    const [selected, setSelected] = useState<string[]>([]);
    const desktopRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
    const createItem = useFileSystemStore((s) => s.createItem);
    const selectDesktop = useMemo(
        () => selectItemsInFolder('desktop-id'),
        [] // ou ['desktop-id'] se for variável
    );

    const desktopItems = useFileSystemStore(useShallow(selectDesktop));

    const setSize = useDesktopStore((s) => s.setSize);

    const handleDesktopClick = () => {
        setSelected([]);
    };

    const handleSelected = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
        e.stopPropagation();

        setSelected([id]);
    };

    useEffect(() => {
        if (!desktopRef.current) return;

        const resize = () => {
            const rect = desktopRef.current?.getBoundingClientRect();
            if (!rect) return;

            setSize(rect.width, rect.height);
        };

        resize();
        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <main
            ref={desktopRef}
            className="
                relative 
                h-full w-full grid 
                grid-flow-col 
                grid-rows-[repeat(auto-fill,96px)] 
                auto-cols-[96px] 
                gap-2 
                p-4
                content-start
                select-none
                bg-teal-700
                bg-center bg-auto
            "
            onClick={handleDesktopClick}
        >
            <WindowManager desktopRef={desktopRef} />
            <Button
                onClick={() => {
                    createItem('desktop-id', 'rola_' + count, 'file', 'txt');
                    count++;
                }}
            >
                Adicionar arquivo
            </Button>
            {desktopItems.length > 0 &&
                desktopItems.map((item) => {
                    const isSelected = selected.includes(item.id);
                    const IconComponent = getFileIcon(item);

                    return (
                        <button
                            key={item.id}
                            data-selected={isSelected}
                            className="
                            w-24 h-fit
                            flex flex-col items-center justify-center
                            cursor-pointer
                            text-white
                            select-none 
                            py-1.5 wrap-break-word
                            hover:bg-white/20
                            data-[selected=true]:bg-white/40
                        "
                            onClick={(e) => handleSelected(e, item.id)}
                            onDoubleClick={(e) => {
                                e.stopPropagation();
                                openFile(item.id);
                            }}
                        >
                            <IconComponent size={40} />
                            <span className="text-xs mt-1 text-center">
                                {item.name}
                                {item.type === 'file' ? `.${item.extension}` : ''}
                            </span>
                        </button>
                    );
                })}
        </main>
    );
}
