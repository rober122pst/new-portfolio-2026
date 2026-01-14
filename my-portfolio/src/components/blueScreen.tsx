export default function BlueScreen({ message }: { message?: string }) {
    return (
        <div className="flex flex-col justify-center items-center size-full text-white bg-[#0000aa] gap-2">
            <span className="bg-neutral-400 text-[#0000aa] px-1.5">rbxOS</span>

            <div className="max-w-xl">
                <p>Ocorreu uma falha geral no kernel do sistema.</p>
                <p>DUMP: {message}</p>
            </div>
            <p className="mx-auto">Pressione F5 para reiniciar...</p>
        </div>
    );
}
