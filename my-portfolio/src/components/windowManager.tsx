import { appRegistry } from '../core/appRegistry';
import { useProcess } from '../store/processes';
import { useWindows, type Window as WindowType } from '../store/windows';
import { Window } from './ui/window';

function WindowInstance({ myWindow, desktopRef }: { myWindow: WindowType; desktopRef?: React.RefObject<HTMLElement> }) {
    const process = useProcess(myWindow.pid);

    if (!process) return null;

    const app = appRegistry[process.appId as keyof typeof appRegistry];
    if (!app) return null;
    console.log(myWindow);

    const AppComponent = app.component;

    return (
        <Window myWindow={myWindow} desktopRef={desktopRef}>
            <AppComponent pid={myWindow.pid} />
        </Window>
    );
}

export default function WindowManager({ desktopRef }: { desktopRef?: React.RefObject<HTMLElement> }) {
    const windows = useWindows();
    return (
        <>
            {windows.map((window) => (
                <WindowInstance key={window.id} myWindow={window} desktopRef={desktopRef} />
            ))}
        </>
    );
}
