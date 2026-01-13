import React from 'react';
import { useProcessStore } from '../store/processes';
import { useWindowStore } from '../store/windows';
import BlueScreen from './blueScreen';

interface ErrorBoundaryProps {
    children?: React.ReactNode;
    variant?: 'window' | 'screen';
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean; message: string }> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, message: '' };
    }

    componentDidMount() {
        window.addEventListener('error', this.handleGlobalError);
        window.addEventListener('unhandledrejection', this.handlePromiseRejection);
    }

    // Limpeza para não duplicar ouvintes
    componentWillUnmount() {
        window.removeEventListener('error', this.handleGlobalError);
        window.removeEventListener('unhandledrejection', this.handlePromiseRejection);
    }

    // Handler para erros gerais
    handleGlobalError = (event: ErrorEvent) => {
        this.setState({
            hasError: true,
            message: event.message || 'Erro desconhecido detectado pelo Sistema.',
        });
    };

    handlePromiseRejection = (event: PromiseRejectionEvent) => {
        const reason = event.reason;
        const message = reason instanceof Error ? reason.message : String(reason);

        this.setState({
            hasError: true,
            message: `Falha de Processo Assíncrono: ${message}`,
        });
    };

    // Deleta o erro e altera o estado pra mostrar tela azul
    static getDerivedStateFromError(error: Error) {
        return { hasError: true, message: error.message };
    }

    resetError = () => {
        this.setState({ hasError: false, message: '' });
    };

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error('Erro crítico detectado:', error, errorInfo);
    }

    render(): React.ReactNode {
        if (this.state.hasError) {
            if (this.props.variant === 'window') {
                try {
                    // Verifica se já não abrimos essa janela para evitar spam
                    const currentProcesses = useProcessStore.getState().processes;
                    const isAlreadyOpen = Object.values(currentProcesses).some(
                        (p) =>
                            (p.data as { isError: boolean }).isError === true &&
                            (p.data as { message: string })?.message === this.state.message
                    );

                    if (!isAlreadyOpen) {
                        const pid = useProcessStore.getState().openProcess('errorWindow', {
                            isError: true,
                            message: this.state.message,
                        });
                        useWindowStore.getState().openWindow(pid, { width: 200, height: 100 });
                    }

                    return;
                } catch (e) {
                    console.error('Falha ao tentar abrir janela de erro:', e);
                }
            }
            return <BlueScreen message={this.state.message} />;
        }

        return this.props.children;
    }
}
