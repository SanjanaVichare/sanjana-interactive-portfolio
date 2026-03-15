import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";

function Avatar() {
    const group = useRef<THREE.Group>(null);
    const { scene } = useGLTF("/bestop.glb");
    const mouse = useRef({ x: 0, y: 0 });
    const smoothMouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useFrame(({ clock }) => {
        if (!group.current) return;
        const t = clock.getElapsedTime();

        smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * 0.06;
        smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * 0.06;

        group.current.position.y = -0.2 + Math.sin(t * 1.5) * 0.06;
        group.current.rotation.y = smoothMouse.current.x * 0.5;
        group.current.rotation.x = smoothMouse.current.y * 0.2;
        group.current.rotation.z = -smoothMouse.current.x * 0.05;
    });

    return (
        <primitive
            ref={group}
            object={scene}
            scale={3}
            position={[0, 0, 0]}
        />
    );
}

export default function AvatarPortfolio() {
    return (
        <div style={{ width: "100%", height: "80%", position: "relative" }}>
            <Canvas camera={{ position: [0, 0.8, 3.2], fov: 50 }}>
                <ambientLight intensity={1} />
                <directionalLight position={[4, 5, 4]} intensity={2} />

                <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.15}>
                    <Avatar />
                </Float>

                <Environment preset="city" />
            </Canvas>
        </div>
    );
}