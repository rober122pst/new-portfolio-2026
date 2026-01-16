export default function BlueScreen({ message }: { message?: string }) {
    return (
        <div className="flex size-full flex-col items-center justify-center gap-2 bg-[#0000aa] text-white">
            <span className="bg-neutral-400 px-1.5 text-[#0000aa]">rbxOS</span>

            <div className="max-w-xl">
                <p>Ocorreu uma falha geral no kernel do sistema.</p>
                <p>DUMP: {message}</p>
            </div>
            <p className="mx-auto">Pressione F5 para reiniciar...</p>
        </div>
    );
}
