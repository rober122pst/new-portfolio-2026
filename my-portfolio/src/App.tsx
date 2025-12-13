import { Desktop } from './components/desktop';
import { RetroMonitor } from './components/retroMonitor';
import { Taskbar } from './components/taskbar';

function App() {
    return (
        <RetroMonitor>
            <Desktop />
            <Taskbar />
        </RetroMonitor>
    );
}

export default App;
