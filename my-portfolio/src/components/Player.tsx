import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Mesh, Vector3 } from 'three';

import { useSphere } from '@react-three/cannon';
import { useKeyboardControls } from '@react-three/drei';

export function Player() {
    // Configurar física (Não prender nas quinas)
    const [ref, api] = useSphere<Mesh>(() => ({
        mass: 1,
        position: [0, 1, 0],
        fixedRotation: true, // Pro boneco não rolar como uma bola
        args: [0.5], // Raio
    }));

    // Refs pra guardar velocidade e posição atual sem re-renderizar
    const vel = useRef([0, 0, 0]);
    const pos = useRef([0, 0, 0]);

    // Subescrever aos valores da física
    useEffect(() => api.velocity.subscribe((v) => (vel.current = v)), [api.velocity]);
    useEffect(() => api.position.subscribe((p) => (pos.current = p)), [api.position]);

    // Acesso a  inputs
    const [, get] = useKeyboardControls();

    const { camera } = useThree();

    // Loop do jogo - 60 FPS
    useFrame(() => {
        const { forward, backward, left, right, jump } = get();

        // Movimento
        const frontVector = new Vector3(0, 0, Number(backward) - Number(forward));
        const sideVector = new Vector3(Number(left) - Number(right), 0, 0);
        const direction = new Vector3();

        direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(5);

        // Aplicar velocidade ao corpo
        api.velocity.set(direction.x, vel.current[1], direction.z);

        // Pulo (se tiver perto do chão, vel y quase 0)
        if (jump && Math.abs(vel.current[1]) < 0.05) {
            api.velocity.set(vel.current[0], 5, vel.current[2]); // Força 5 pra pulo
        }

        // Lógica da camera seguir o jogador
        // Pos desejada: Pos Player + offset
        const cameraPos = new Vector3(pos.current[0], pos.current[1] + 5, pos.current[2] + 10);

        // Lerp pra câmera
        camera.position.lerp(cameraPos, 0.1);

        camera.lookAt(pos.current[0], pos.current[1], pos.current[2]);
    });

    return (
        <mesh ref={ref} castShadow>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color="orange" />
        </mesh>
    );
}
