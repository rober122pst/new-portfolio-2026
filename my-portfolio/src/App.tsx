import { useEffect } from 'react';
import Desktop from './components/desktop';
import RetroMonitor from './components/retroMonitor';
import Taskbar from './components/taskbar';

function App() {
    useEffect(() => {
        if (!sessionStorage.getItem('ligado')) {
            sessionStorage.setItem('ligado', 'true');
            console.log('PC ligando...');
        } else {
            console.log('PC ligado');
        }
    }, []);
    return (
        <RetroMonitor>
            <Desktop />
            <Taskbar />
        </RetroMonitor>
    );
}

export default App;
