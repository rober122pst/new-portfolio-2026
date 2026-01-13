import { useProcessActions } from '../store/processes';
import { useWindows } from '../store/windows';

import { appRegistry } from '../core/appRegistry';
import { Window } from './ui/window';

export default function WindowManager({ desktopRef }: { desktopRef?: React.RefObject<HTMLElement> }) {
    const windows = useWindows();
    const { getProcess } = useProcessActions();

    return (
        <>
            {windows.map((window) => {
                const process = getProcess(window.pid);

                if (!process) return null;

                const app = appRegistry[process.appId as keyof typeof appRegistry];
                if (!app) return null;

                const AppComponent = app.component;

                return (
                    <Window key={window.id} myWindow={window} desktopRef={desktopRef}>
                        <AppComponent pid={window.pid} />
                    </Window>
                );
            })}
        </>
    );
}
