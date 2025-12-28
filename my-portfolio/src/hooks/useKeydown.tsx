import { useEffect, useState } from 'react';

export function useKeydown({ onKeyPressed }: { onKeyPressed: (key: string) => void }) {
    const [key, setKey] = useState('');

    useEffect(() => {
        const handleKeydownPressed = (e: KeyboardEvent) => {
            onKeyPressed(e.key);
            setKey(e.key);
        };

        window.addEventListener('keydown', handleKeydownPressed);

        return () => window.removeEventListener('keydown', handleKeydownPressed);
    }, [onKeyPressed]);

    return { key };
}
