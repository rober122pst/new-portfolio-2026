import { useState } from 'react';
import { useProcessStore } from '../../store/processes';

interface NotepadProps {
    pid: string;
}

export function Notepad({ pid }: NotepadProps) {
    const updateData = useProcessStore((s) => s.updateData);
    const process = useProcessStore((s) => s.getProcess(pid));

    const initialContent = (process?.data as { content?: string })?.content || '';
    const [text, setText] = useState(initialContent);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        updateData(pid, { content: e.target.value });
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
