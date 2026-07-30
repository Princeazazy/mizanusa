import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import type { Group } from "three";

/**
 * Mizan (ميزان) — the balance scale.
 * A slowly rotating, softly-lit brushed-metal balance used as the brand object.
 * Deliberately monochrome: no neon, no emissive glow, no bloom.
 */

const METAL = { color: "#8f98a8", metalness: 0.92, roughness: 0.34 } as const;
const METAL_DARK = { color: "#5b6272", metalness: 0.85, roughness: 0.45 } as const;

const Pan = ({ x }: { x: number }) => (
  <group position={[x, -0.62, 0]}>
    {/* three suspension cords */}
    {[-0.28, 0, 0.28].map((offset, i) => (
      <mesh key={i} position={[offset * 0.7, 0.31, i === 1 ? 0.24 : -0.08]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.62, 8]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
    ))}
    {/* shallow dish */}
    <mesh rotation={[Math.PI, 0, 0]} castShadow>
      <coneGeometry args={[0.52, 0.16, 48, 1, true]} />
      <meshStandardMaterial {...METAL} side={2} />
    </mesh>
    <mesh position={[0, 0.001, 0]} castShadow>
      <cylinderGeometry args={[0.52, 0.52, 0.012, 48]} />
      <meshStandardMaterial {...METAL} />
    </mesh>
  </group>
);

const Balance = () => {
  const group = useRef<Group>(null);
  const beam = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.14;
      group.current.position.y = Math.sin(t * 0.5) * 0.035;
    }
    if (beam.current) {
      // barely-there settling motion, as if the scale is coming to rest
      beam.current.rotation.z = Math.sin(t * 0.42) * 0.035;
    }
  });

  return (
    <group ref={group} position={[0, 0.15, 0]}>
      {/* plinth */}
      <mesh position={[0, -1.32, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.72, 0.86, 0.09, 64]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* column */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.075, 1.58, 32]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* finial */}
      <mesh position={[0, 0.34, 0]} castShadow>
        <sphereGeometry args={[0.085, 32, 32]} />
        <meshStandardMaterial {...METAL} />
      </mesh>

      <group ref={beam} position={[0, 0.28, 0]}>
        {/* beam */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.032, 0.032, 2.5, 24]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        <Pan x={-1.25} />
        <Pan x={1.25} />
      </group>
    </group>
  );
};

const Rig = () => (
  <>
    <ambientLight intensity={0.35} />
    {/* soft key */}
    <directionalLight position={[3.5, 5, 3]} intensity={2.1} castShadow shadow-mapSize={[1024, 1024]} />
    {/* cool fill from the left */}
    <directionalLight position={[-4, 1.5, 2]} intensity={0.55} color="#8fb4c8" />
    {/* faint accent rim, barely perceptible */}
    <pointLight position={[0, -1, -4]} intensity={6} color="#2ee6c5" distance={9} />
    <Balance />
    <ContactShadows position={[0, -1.42, 0]} opacity={0.45} scale={7} blur={3.2} far={3} resolution={512} color="#000000" />
  </>
);

interface MizanBalance3DProps {
  className?: string;
}

export const MizanBalance3D = ({ className }: MizanBalance3DProps) => {
  const dpr = useMemo<[number, number]>(() => [1, 1.8], []);

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={dpr}
        shadows
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 1.1, 8.2], fov: 30 }}
      >
        <Suspense fallback={null}>
          <Rig />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default MizanBalance3D;
