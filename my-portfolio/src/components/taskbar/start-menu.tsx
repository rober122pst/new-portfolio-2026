import { SYSTEM_IDS } from '@/core/files';
import { useOpenFile } from '@/hooks/useOpenItem';
import { useUserStore } from '@/store/user';
import { documentsIcon } from '@/utils/icons-src';
import logo from '@assets/logos/start_name.webp';
import { motion } from 'motion/react';
import { useMemo } from 'react';
import { BaseIcon } from '../ui/icons';

function Option({ item }: { item: { name: string; icon: string; action: () => void } }) {
    return (
        <button
            key={item.name}
            onClick={item.action}
            className="flex w-full cursor-pointer items-center gap-2 py-1 hover:bg-rose-500"
        >
            <BaseIcon className="ml-1" src={item.icon} size={24} />
            <span>{item.name}</span>
        </button>
    );
}

export default function StartMenu({ id }: { id?: string }) {
    const openFile = useOpenFile();
    const user = useUserStore((s) => s.user);
    const items = useMemo(() => {
        return [
            { name: 'Programas', icon: '', action: () => {} },
            { name: 'Jogos', icon: '', action: () => {} },
            {
                name: 'Documentos',
                icon: documentsIcon,
                action: () => {
                    openFile(SYSTEM_IDS.DOCUMENTS);
                },
            },
            { name: 'Ajustes', icon: '', action: () => {} },
            { name: 'Links', icon: '', action: () => {} },
        ];
    }, [openFile]);

    return (
        <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.2 }}
            id={id}
            className="border-elevated absolute bottom-full left-0 flex w-36 origin-bottom bg-zinc-800 p-0.75"
        >
            <div className="flex h-67 w-5 flex-col justify-end bg-linear-to-t from-[#a12141] to-[#ed4b62] p-0.75">
                <img src={logo} className="pointer-events-none object-cover select-none" alt="rbxOS 122" />
            </div>
            <div className="flex w-full flex-col">
                <div className="py-2 pr-2">
                    <div className="flex items-center gap-2">
                        <BaseIcon className="ml-1" src="" size={24} />
                        <span>{user}</span>
                    </div>
                </div>
                <div className="w-full border-t border-b border-t-zinc-900 border-b-zinc-700" />
                <div className="flex h-full flex-1 flex-col space-y-1 py-2 pr-2">
                    {items.map((item) => (
                        <Option key={item.name} item={item} />
                    ))}
                </div>
                <div className="w-full border-t border-b border-t-zinc-900 border-b-zinc-700" />
                <div className="py-2 pr-2">
                    <Option item={{ name: 'Desligar', icon: '', action: () => {} }} />
                </div>
            </div>
        </motion.div>
    );
}
