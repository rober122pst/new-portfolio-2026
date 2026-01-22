import { useEffect, useRef, useState } from 'react';
import { SYSTEM_IDS, useFolderItems } from '../store/filesystem';

import { ErrorBoundary } from 'react-error-boundary';
import wallpaper from '../assets/red_gotham.png';
import { useDesktopStore } from '../store/desktop';
import FileItem from './ui/fileItem';
import WindowManager from './windowManager';

export default function Desktop() {
    const [selected, setSelected] = useState<string[]>([]);
    const desktopRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

    const desktopItems = useFolderItems(SYSTEM_IDS.DESKTOP);

    const setSize = useDesktopStore((s) => s.setSize);
    const setPosition = useDesktopStore((s) => s.setPosition);

    const handleDesktopClick = () => {
        setSelected([]);
    };

    const handleSelected = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
        e.stopPropagation();

        setSelected([id]);
    };

    useEffect(() => {
        if (!desktopRef.current) return;

        const rect = desktopRef.current;

        setSize(rect.clientWidth, rect.clientHeight);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!desktopRef.current) return;

        const rect = desktopRef.current.getBoundingClientRect();

        setPosition(rect.x, rect.y);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <main
            ref={desktopRef}
            className="relative grid h-full w-full auto-cols-[96px] grid-flow-col grid-rows-[repeat(auto-fill,96px)] content-start gap-2 bg-cover bg-center p-4 select-none"
            style={{ backgroundImage: `url(${wallpaper})` }}
            onClick={handleDesktopClick}
        >
            <WindowManager />
            {desktopItems.length > 0 &&
                desktopItems.map((item) => {
                    const isSelected = selected.includes(item.id);

                    return (
                        <ErrorBoundary
                            key={item.id}
                            fallbackRender={({ error }) => <div>Error loading item: {error.message}</div>}
                        >
                            <FileItem item={item} isSelected={isSelected} onClick={(e) => handleSelected(e, item.id)} />
                        </ErrorBoundary>
                    );
                })}
        </main>
    );
}
