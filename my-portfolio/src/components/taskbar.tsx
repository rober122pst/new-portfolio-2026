import { useEffect, useState } from 'react';

import volumeIcon from '../assets/icons_taskbar/volume.ico';
import soLogo from '../assets/so_logo.ico';
import { TaskbarButton } from './ui/buttons';

export function Taskbar() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="flex justify-between items-center w-full p-1 bg-zinc-800 text-white text-[12px]">
            <TaskbarButton className="flex items-center gap-1">
                <img className="size-4" src={soLogo} alt="Logo do SO" />
                Iniciar
            </TaskbarButton>
            <div className="border-3 px-3 py-0.5 border-b-zinc-700 border-r-zinc-700 border-l-zinc-900 border-t-zinc-900 bg-zinc-900/30 flex items-center">
                <div className="mr-2 p-1.5">
                    <img src={volumeIcon} alt="volume" />
                </div>
                <div className="flex flex-col justify-center h-full text-right pointer-events-none">
                    <p>
                        {now.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </p>
                    <p>{now.toLocaleDateString()}</p>
                </div>
            </div>
        </footer>
    );
}
