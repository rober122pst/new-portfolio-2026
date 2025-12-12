import { usePlane } from '@react-three/cannon';
import { Mesh } from 'three';

export function Level() {
    // usePlane é uma red pra o mesh e uma api pra controlar a fisica
    // rotation: [-Math.PI / 2, 0, 0] pra o plano ficar deitado
    const [ref] = usePlane<Mesh>(() => ({
        rotation: [-Math.PI / 2, 0, 0],
        position: [0, 0, 0],
        material: { friction: 0.0 }, // pra deslizar menos
    }));

    return (
        <mesh ref={ref} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="green" />
        </mesh>
    );
}
