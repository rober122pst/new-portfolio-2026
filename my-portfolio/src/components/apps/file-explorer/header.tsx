import rbxLogo from '../../../assets/logos/logo_16x.webp';

function FileExplorerOptions() {
    const options = [
        { name: 'File', onClick: () => {} },
        { name: 'Edit', onClick: () => {} },
        { name: 'View', onClick: () => {} },
        { name: 'Tools', onClick: () => {} },
        { name: 'Help', onClick: () => {} },
    ];
    return (
        <div className="grid h-fit grid-cols-[1fr_auto] gap-px bg-zinc-800">
            <div className="flex h-full items-center border-r border-b border-r-zinc-900 border-b-zinc-900 px-1 py-0.75">
                <div className="h-full w-0.75 border-r border-b border-r-zinc-900 border-b-zinc-900 bg-zinc-700" />
                <div className="mx-5 w-full space-x-4 text-[10px] text-white">
                    {options.map((o) => (
                        <button>{o.name}</button>
                    ))}
                </div>
            </div>
            <div className="flex h-full w-10 items-center justify-center border-b border-b-zinc-900 bg-zinc-950">
                <img className="h-3 w-3" src={rbxLogo} alt="Logo do SO" />
            </div>
        </div>
    );
}

// TODO desenhar icones
// function FileExplorerButtons() {
//     return <div></div>;
// }

function FileExplorerAdressBar({ path }: { path: string }) {
    return (
        <div className="flex h-6 w-full items-center bg-zinc-800 px-1 py-0.75 text-[10px] text-white">
            <div className="h-full w-0.75 border-r border-b border-r-zinc-900 border-b-zinc-900 bg-zinc-700" />
            <div className="ml-1 flex h-full flex-1 items-center gap-1">
                <span>Address</span>
                <input
                    type="text"
                    name="address"
                    readOnly
                    value={path}
                    className="h-full w-full border-t-2 border-l-2 border-t-zinc-950 border-l-zinc-950 bg-white text-black outline-0"
                />
            </div>
        </div>
    );
}

export default function FileExplorerHeader({ path }: { path: string }) {
    return (
        <>
            <FileExplorerOptions />
            <FileExplorerAdressBar path={path} />
        </>
    );
}
