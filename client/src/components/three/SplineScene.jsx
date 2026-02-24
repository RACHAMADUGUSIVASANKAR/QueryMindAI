import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSphere() {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.4} floatIntensity={1}>
            <mesh ref={meshRef} scale={2.2}>
                <icosahedronGeometry args={[1, 4]} />
                <MeshDistortMaterial
                    color="#6C63FF"
                    emissive="#4a42c7"
                    emissiveIntensity={0.3}
                    roughness={0.2}
                    metalness={0.8}
                    distort={0.3}
                    speed={2}
                    transparent
                    opacity={0.85}
                />
            </mesh>
        </Float>
    );
}

function Rings() {
    const ringRef = useRef();
    useFrame((state) => {
        if (ringRef.current) {
            ringRef.current.rotation.z = state.clock.elapsedTime * 0.3;
            ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
        }
    });

    return (
        <group ref={ringRef}>
            <mesh>
                <torusGeometry args={[3, 0.02, 16, 100]} />
                <meshStandardMaterial color="#8B83FF" transparent opacity={0.4} />
            </mesh>
            <mesh rotation={[Math.PI / 4, 0, 0]}>
                <torusGeometry args={[3.3, 0.015, 16, 100]} />
                <meshStandardMaterial color="#a78bfa" transparent opacity={0.3} />
            </mesh>
        </group>
    );
}

export default function SplineScene() {
    return (
        <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
            <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
                <pointLight position={[-5, -5, 5]} intensity={0.4} color="#6C63FF" />
                <AnimatedSphere />
                <Rings />
            </Canvas>
        </div>
    );
}
