import { Activity, useState } from 'react';

import BootScreen from './components/bootScreen';
import Desktop from './components/desktop';
import RetroMonitor from './components/retroMonitor';
import Taskbar from './components/taskbar';

function App() {
    const [initialBoot, setInitialBoot] = useState(() => {
        if (!sessionStorage.getItem('ligado')) {
            sessionStorage.setItem('ligado', 'true');
            console.log('PC ligando...');
            return true;
        } else {
            console.log('PC ligado');
            return true;
        }
    });

    return (
        <RetroMonitor>
            <Activity mode={initialBoot ? 'visible' : 'hidden'}>
                <BootScreen onBoot={setInitialBoot} />
            </Activity>
            <Activity mode={initialBoot ? 'hidden' : 'visible'}>
                <Desktop />
                <Taskbar />
            </Activity>
        </RetroMonitor>
    );
}

export default App;
