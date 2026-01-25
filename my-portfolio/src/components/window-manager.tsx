import { appRegistry } from '@/core/app-registry';
import errorAudio from '@assets/audios/error.mp3';
import { useProcess, useProcessActions, useProcessStore } from '@store/processes';
import { useWindowActions, useWindows, type Window as WindowType } from '@store/windows';
import { playAudio } from '@utils/playAudio';
import { ErrorBoundary } from 'react-error-boundary';
import { Window } from './ui/window';

function WindowInstance({ myWindow }: { myWindow: WindowType }) {
    const process = useProcess(myWindow.pid);

    const { openProcess, closeProcess } = useProcessActions();
    const { openWindow, closeWindow } = useWindowActions();
    if (!process) return null;

    const app = appRegistry[process.appId as keyof typeof appRegistry];
    if (!app) return null;

    const AppComponent = app.component;

    const launchErrorDialog = (name: string, message: string) => {
        closeProcess(myWindow.pid);
        closeWindow(myWindow.id);

        try {
            // Verifica se já não abrimos essa janela para evitar spam
            const currentProcesses = useProcessStore.getState().processes;
            const isAlreadyOpen = Object.values(currentProcesses).some(
                (p) =>
                    (p.data as { isError: boolean }).isError === true &&
                    (p.data as { message: string })?.message === message
            );

            if (!isAlreadyOpen) {
                const pid = openProcess('dialogBox', {
                    isError: true,
                    name: name,
                    message: message,
                });
                playAudio(errorAudio, 0.2);
                openWindow(pid, { width: 400, height: 180 }, 'unresizable');
            }

            return;
        } catch (e) {
            console.error('Falha ao tentar abrir janela de erro:', e);
        }
    };

    return (
        <ErrorBoundary fallback={null} onError={(error) => launchErrorDialog(error.name, error.message)}>
            <Window myWindow={myWindow} variant={myWindow.variant}>
                <AppComponent pid={myWindow.pid} />
            </Window>
        </ErrorBoundary>
    );
}

export default function WindowManager() {
    const windows = useWindows();
    return windows.map((window) => <WindowInstance key={window.id} myWindow={window} />);
}
