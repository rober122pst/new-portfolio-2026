import { useCallback, useState } from 'react';

export function usePanic() {
    const [_, setEstado] = useState();

    return useCallback((message?: string) => {
        setEstado(() => {
            throw new Error(message || 'Erro Crítico do Sistema');
        });
    }, []);
}
