import { useEffect, useState } from 'react';

export interface KeyState {
    key: string;
    code: string;
    ctrl: boolean;
    shift: boolean;
    alt: boolean;
    meta: boolean;
}

export function useKeyup(onKeyPressed?: (keyState: KeyState) => void) {
    const [keyState, setKeyState] = useState<KeyState>({
        key: '',
        code: '',
        ctrl: false,
        shift: false,
        alt: false,
        meta: false,
    });

    useEffect(() => {
        const handleKeyUp = (e: KeyboardEvent) => {
            const newKeyState: KeyState = {
                key: e.key,
                code: e.code,
                ctrl: e.ctrlKey,
                shift: e.shiftKey,
                alt: e.altKey,
                meta: e.metaKey,
            };
            setKeyState(newKeyState);
            onKeyPressed?.(newKeyState);
        };

        window.addEventListener('keyup', handleKeyUp);

        return () => window.removeEventListener('keyup', handleKeyUp);
    }, [onKeyPressed]);

    return keyState;
}
