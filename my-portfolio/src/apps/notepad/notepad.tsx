import { useState } from 'react';
import { useFileSystemStore } from '../../store/filesystem';
import { useProcessStore } from '../../store/processes';

interface NotepadProps {
    pid: string;
}

export default function Notepad({ pid }: NotepadProps) {
    const process = useProcessStore((s) => s.getProcess(pid));
    const updateData = useProcessStore((s) => s.updateData);
    const getItem = useFileSystemStore((s) => s.getItem);
    const updateFileContent = useFileSystemStore((s) => s.updateFileContent);

    const fileId = (process?.data as { fileId: string })?.fileId;

    const getInitialState = () => {
        if (fileId) {
            const file = getItem(fileId);
            if (file?.content) {
                return (file.content as { text: string }).text;
            }
        }

        if (process?.data) {
            return (process.data as { tempContent: string }).tempContent;
        }

        return '';
    };

    const [text, setText] = useState<string>(getInitialState);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setText(newValue);

        if (fileId) {
            updateFileContent(fileId, { text: newValue });
        } else {
            updateData(pid, { ...(process?.data as object), tempContent: newValue });
        }
    };

    return (
        <div className="relative h-full w-full bg-white">
            <textarea
                className="absolute h-full w-full min-h-0 p-2 resize-none border-0 outline-none"
                value={text}
                onChange={handleChange}
            />
        </div>
    );
}
