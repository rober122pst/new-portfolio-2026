import { KeyboardControls, Sky } from '@react-three/drei';

import { Physics } from '@react-three/cannon';
import { Canvas } from '@react-three/fiber';
import { Level } from './components/Level';
import { Player } from './components/Player';

function App() {
    const keyboardMap = [
        { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
        { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
        { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
        { name: 'right', keys: ['ArrowRight', 'KeyD'] },
        { name: 'jump', keys: ['Space'] },
    ];

    return (
        <KeyboardControls map={keyboardMap}>
            <Canvas shadows camera={{ fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
                <Sky sunPosition={[100, 20, 100]} />
                <Physics gravity={[0, -9.81, 0]}>
                    <Level />
                    <Player />
                </Physics>
            </Canvas>
        </KeyboardControls>
    );
}

export default App;
