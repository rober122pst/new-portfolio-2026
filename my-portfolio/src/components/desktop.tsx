import folderIcon from '../assets/icons/folder_icon.ico';

export function Desktop() {
    return (
        <main
            className="h-full w-full bg-zinc-950 grid 
              grid-flow-col 
              grid-rows-[repeat(auto-fill,96px)] 
              auto-cols-[96px] 
              gap-2 
              p-4
              content-start"
        >
            <div
                className="
                    w-20 h-fit
                    flex flex-col items-center justify-center
                    cursor-pointer
                    text-white
                    select-none 
                    hover:bg-white/20
                "
            >
                <img src={folderIcon} className="w-10 h-10" />
                <span className="text-xs mt-1 text-center">Nova Pasta</span>
            </div>
            <div
                className="
                    w-20 h-fit
                    flex flex-col items-center justify-center
                    cursor-pointer
                    text-white
                    select-none 
                    hover:bg-white/20
                "
            >
                <img src={folderIcon} className="w-10 h-10" />
                <span className="text-xs mt-1 text-center">Nova Pasta</span>
            </div>
        </main>
    );
}
