import { appRegistry } from '../core/appRegistry';
import { useProcess } from '../store/processes';
import { useWindows, type Window as WindowType } from '../store/windows';
import { Window } from './ui/window';

function WindowInstance({ myWindow }: { myWindow: WindowType }) {
    const process = useProcess(myWindow.pid);

    if (!process) return null;

    const app = appRegistry[process.appId as keyof typeof appRegistry];
    if (!app) return null;

    const AppComponent = app.component;

    return (
        <Window myWindow={myWindow} variant={myWindow.variant}>
            <AppComponent pid={myWindow.pid} />
        </Window>
    );
}

export default function WindowManager() {
    const windows = useWindows();
    return windows.map((window) => <WindowInstance key={window.id} myWindow={window} />);
}
