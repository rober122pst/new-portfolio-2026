import { useFileSystemActions, useFileSystemItem } from '../../../store/filesystem';
import { useProcess, useProcessActions } from '../../../store/processes';

import { useState } from 'react';

interface NotepadProps {
    pid: string;
}

export default function Notepad({ pid }: NotepadProps) {
    const { updateData } = useProcessActions();
    const process = useProcess(pid);
    const { updateFileContent } = useFileSystemActions();
    const getItem = useFileSystemItem;

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
                className="absolute h-full min-h-0 w-full resize-none border-0 p-2 outline-none"
                value={text}
                onChange={handleChange}
            />
        </div>
    );
}
