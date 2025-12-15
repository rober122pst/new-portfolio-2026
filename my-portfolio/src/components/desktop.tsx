import { useState } from 'react';
import { MyComputerIcon } from './ui/icons';
import { Window } from './ui/window';

export function Desktop() {
    const [selected, setSelected] = useState<string[]>([]);
    interface Program {
        id: string;
        name: string;
        icon: React.ComponentType<{ size?: number }>;
        action: () => void;
    }

    const programs: Program[] = [
        {
            id: 'my-computer',
            name: 'Meu Computador',
            icon: MyComputerIcon,
            action: () => {
                console.log('Funciona');
            },
        },
    ];

    const handleDesktopClick = () => {
        setSelected([]);
    };

    const handleSelected = (
        e: React.MouseEvent<HTMLButtonElement>,
        id: string,
        isSelected: boolean,
        action: () => void
    ) => {
        e.stopPropagation();

        if (!isSelected) {
            setSelected([id]);
            return;
        }

        action();
        setSelected([]);
    };

    return (
        <main
            className="h-full w-full bg-zinc-950 grid 
              grid-flow-col 
              grid-rows-[repeat(auto-fill,96px)] 
              auto-cols-[96px] 
              gap-2 
              p-4
              content-start
              select-none"
            onClick={handleDesktopClick}
        >
            <Window program={programs[0]} />
            {programs.map((p, index) => {
                const isSelected = selected.includes(p.id);

                return (
                    <button
                        key={index}
                        data-selected={isSelected}
                        className="
                            w-24 h-fit
                            flex flex-col items-center justify-center
                            cursor-pointer
                            text-white
                            select-none 
                            py-1.5
                            hover:bg-white/20
                            data-[selected=true]:bg-white/40
                        "
                        onClick={(e) => handleSelected(e, p.id, isSelected, p.action)}
                    >
                        <p.icon size={40} />
                        <span className="text-xs mt-1 text-center">{p.name}</span>
                    </button>
                );
            })}
        </main>
    );
}
