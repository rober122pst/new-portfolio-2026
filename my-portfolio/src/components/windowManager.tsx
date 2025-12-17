import { appRegistry } from '../core/appRegistry';
import { useProcessStore } from '../store/processes';
import { useWindowStore } from '../store/windows';
import { Window } from './ui/window';

export function WindowManager() {
    const { windows } = useWindowStore();
    const getProcess = useProcessStore((p) => p.getProcess);

    return (
        <>
            {windows.map((window) => {
                const process = getProcess(window.pid);

                if (!process) return null;

                const app = appRegistry[process.appId as keyof typeof appRegistry];
                if (!app) return null;

                const AppComponent = app.component;

                return (
                    <Window key={window.id} myWindow={window}>
                        <AppComponent />
                    </Window>
                );
            })}
        </>
    );
}
