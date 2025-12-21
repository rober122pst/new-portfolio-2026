import { useEffect, useMemo, useRef, useState } from 'react';
import { selectItemsInFolder, useFileSystemStore } from '../store/filesystem';

import { useShallow } from 'zustand/react/shallow';
import { useDesktopStore } from '../store/desktop';
import FileItem from './fileItem';
import WindowManager from './windowManager';

export default function Desktop() {
    const [selected, setSelected] = useState<string[]>([]);
    const desktopRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
    const selectDesktop = useMemo(() => selectItemsInFolder('desktop-id'), []);

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
            {desktopItems.length > 0 &&
                desktopItems.map((item) => {
                    const isSelected = selected.includes(item.id);

                    return (
                        <FileItem
                            key={item.id}
                            item={item}
                            isSelected={isSelected}
                            onClick={(e) => handleSelected(e, item.id)}
                        />
                    );
                })}
        </main>
    );
}
