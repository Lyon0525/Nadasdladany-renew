import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleField = () => {
    const count = 1500;
    const mesh = useRef<THREE.Points>(null);

    const particles = useMemo(() => {
        const temp = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            temp[i * 3] = (Math.random() - 0.5) * 10;
            temp[i * 3 + 1] = (Math.random() - 0.5) * 10;
            temp[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        if (mesh.current) {
            mesh.current.rotation.y = state.clock.getElapsedTime() * 0.05;
            mesh.current.rotation.x = state.clock.getElapsedTime() * 0.03;
        }
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                {/* JAVÍTÁS: Az args prop-ban adjuk át a tömböt és a méretet (3 = x,y,z) */}
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.015}
                color="#c5a35a"
                transparent
                opacity={0.4}
                sizeAttenuation={true}
            />
        </points>
    );
};

export const CastleParticles = () => (
    <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5] }}>
            <ParticleField />
        </Canvas>
    </div>
);