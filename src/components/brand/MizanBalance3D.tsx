import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, Sparkles } from "@react-three/drei";
import type { Group, Mesh, MeshStandardMaterial, PointLight } from "three";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Mizan (ميزان) — the balance scale.
 * A cinematic, softly-lit brushed-titanium balance used as the brand object.
 * Restrained: reflections and light do the work, not neon.
 */

const BODY = {
  color: "#6f7787",
  metalness: 0.96,
  roughness: 0.32,
  anisotropy: 0.7,
  anisotropyRotation: Math.PI / 2,
  clearcoat: 0.4,
  clearcoatRoughness: 0.5,
} as const;

const BODY_DARK = {
  color: "#3f4553",
  metalness: 0.9,
  roughness: 0.45,
  anisotropy: 0.5,
} as const;

const POLISHED = {
  color: "#b9c2d2",
  metalness: 1,
  roughness: 0.09,
  clearcoat: 1,
  clearcoatRoughness: 0.08,
} as const;

const ACCENT = "#2ee6c5";
const RIM = "#8b7dff";

interface SceneProps {
  reduced: boolean;
  simple: boolean;
}

const Pan = ({ x, tilt }: { x: number; tilt: number }) => (
  <group position={[x, -0.62, 0]}>
    {[-0.28, 0, 0.28].map((offset, i) => (
      <mesh key={i} position={[offset * 0.7, 0.31, i === 1 ? 0.24 : -0.08]}>
        <cylinderGeometry args={[0.009, 0.009, 0.62, 8]} />
        <meshPhysicalMaterial {...POLISHED} />
      </mesh>
    ))}
    <mesh rotation={[Math.PI, 0, 0]} castShadow>
      <coneGeometry args={[0.52, 0.16, 48, 1, true]} />
      <meshPhysicalMaterial {...BODY} side={2} />
    </mesh>
    <mesh position={[0, 0.001, 0]} castShadow>
      <cylinderGeometry args={[0.52, 0.52, 0.014, 48]} />
      <meshPhysicalMaterial {...BODY} />
    </mesh>
    <mesh position={[0, 0.012, 0]}>
      <torusGeometry args={[0.52, 0.012, 12, 64]} />
      <meshPhysicalMaterial {...POLISHED} />
    </mesh>
    {/* orb of "data" resting in the pan */}
    <Orb tilt={tilt} color={x < 0 ? ACCENT : RIM} sign={x < 0 ? 1 : -1} />
  </group>
);

const Orb = ({ tilt, color, sign }: { tilt: number; color: string; sign: number }) => {
  const mat = useRef<MeshStandardMaterial>(null);
  const light = useRef<PointLight>(null);
  useFrame(() => {
    const w = 0.5 + Math.max(0, sign * tilt * 12);
    if (mat.current) mat.current.emissiveIntensity = 0.7 + w * 0.9;
    if (light.current) light.current.intensity = 0.6 + w * 1.4;
  });
  return (
    <group position={[0, 0.13, 0]}>
      <mesh>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial
          ref={mat}
          color={color}
          emissive={color}
          emissiveIntensity={1}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>
      <pointLight ref={light} color={color} distance={1.6} intensity={1} />
    </group>
  );
};

const Balance = ({ reduced, simple }: SceneProps) => {
  const group = useRef<Group>(null);
  const beam = useRef<Group>(null);
  const inlay = useRef<MeshStandardMaterial>(null);
  const sweep = useRef<Mesh>(null);
  const tilt = useRef(0);
  const { pointer } = useThree();

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const d = Math.min(delta, 0.05);

    if (group.current) {
      group.current.rotation.y += d * 0.14;
      if (!reduced) {
        group.current.position.y += (Math.sin(t * 0.5) * 0.035 - group.current.position.y) * 0.06;
        if (!simple) {
          const tx = pointer.y * 0.09;
          const tz = -pointer.x * 0.07;
          group.current.rotation.x += (tx - group.current.rotation.x) * 0.05;
          group.current.rotation.z += (tz - group.current.rotation.z) * 0.05;
        }
      }
    }

    if (beam.current && !reduced) {
      // damped see-saw: two slow harmonics so it never reads mechanical
      const target =
        (Math.sin(t * 0.38) * 0.052 + Math.sin(t * 0.13 + 1.2) * 0.018) *
        (0.75 + 0.25 * Math.cos(t * 0.07));
      tilt.current += (target - tilt.current) * (1 - Math.pow(0.001, d));
      beam.current.rotation.z = tilt.current;
      beam.current.children.forEach((child, i) => {
        if (i > 0) child.rotation.z = -tilt.current * 0.85;
      });
    }

    if (inlay.current) {
      inlay.current.emissiveIntensity = 0.55 + Math.sin(t * 0.6) * 0.18;
    }

    // slow light sweep across the metal, ~8s cadence
    if (sweep.current) {
      const p = (t % 8) / 8;
      sweep.current.position.x = -5 + p * 10;
      const m = sweep.current.material as MeshStandardMaterial;
      m.opacity = Math.sin(Math.PI * p) * 0.5;
    }
  });

  return (
    <group ref={group} position={[0, 0.15, 0]}>
      {/* plinth */}
      <mesh position={[0, -1.32, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.72, 0.86, 0.09, 64]} />
        <meshPhysicalMaterial {...BODY_DARK} />
      </mesh>
      <mesh position={[0, -1.276, 0]}>
        <torusGeometry args={[0.72, 0.012, 12, 80]} />
        <meshPhysicalMaterial {...POLISHED} />
      </mesh>
      {/* column */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.075, 1.58, 32]} />
        <meshPhysicalMaterial {...BODY} />
      </mesh>
      {/* finial */}
      <mesh position={[0, 0.34, 0]} castShadow>
        <sphereGeometry args={[0.085, 32, 32]} />
        <meshPhysicalMaterial {...POLISHED} />
      </mesh>

      <group ref={beam} position={[0, 0.28, 0]}>
        <group>
          {/* beam */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.034, 0.034, 2.5, 32]} />
            <meshPhysicalMaterial {...BODY} />
          </mesh>
          {/* polished beam caps */}
          {[-1.25, 1.25].map((x) => (
            <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.045, 0.045, 0.07, 24]} />
              <meshPhysicalMaterial {...POLISHED} />
            </mesh>
          ))}
          {/* faint teal emissive inlay along the beam */}
          <mesh position={[0, 0.032, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.006, 0.006, 2.3, 8]} />
            <meshStandardMaterial
              ref={inlay}
              color={ACCENT}
              emissive={ACCENT}
              emissiveIntensity={0.6}
              roughness={0.4}
            />
          </mesh>
        </group>
        <Pan x={-1.25} tilt={tilt.current} />
        <Pan x={1.25} tilt={tilt.current} />
      </group>

      {/* light sweep card (additive highlight travelling over the metal) */}
      <mesh ref={sweep} position={[0, -0.3, 2.6]} rotation={[0, 0, 0.35]}>
        <planeGeometry args={[0.5, 5]} />
        <meshBasicMaterial color="#dfe8ff" transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
};

const Rig = ({ reduced, simple }: SceneProps) => (
  <>
    {/* procedural studio env — reflections without a network HDRI */}
    <Environment resolution={256} frames={1}>
      <Lightformer intensity={2.4} position={[0, 4, 3]} scale={[10, 4, 1]} color="#eef3ff" />
      <Lightformer intensity={1.1} position={[-5, 1, 2]} scale={[6, 6, 1]} color="#5d7fb8" />
      <Lightformer intensity={1.6} position={[4, 0.5, -3]} scale={[6, 6, 1]} color={RIM} />
      <Lightformer intensity={0.6} position={[0, -3, 2]} scale={[10, 4, 1]} color="#1b2230" />
    </Environment>

    <ambientLight intensity={0.22} />
    <directionalLight position={[3.5, 5, 3]} intensity={1.9} castShadow shadow-mapSize={[1024, 1024]} />
    <directionalLight position={[-2.5, 2, -4]} intensity={1.5} color={RIM} />
    <directionalLight position={[-4, 1.2, 2.5]} intensity={0.4} color="#8fb4c8" />

    {/* volumetric-looking glow behind the object */}
    <GlowSprite color={RIM} radius={4.2} opacity={0.4} position={[0, -0.1, -2.6]} />
    <GlowSprite color={ACCENT} radius={2.6} opacity={0.28} position={[0, -0.5, -2.4]} />


    <Balance reduced={reduced} simple={simple} />

    {!simple && !reduced && (
      <Sparkles count={60} scale={[7, 5, 5]} size={2.2} speed={0.25} opacity={0.5} color="#cfd8ff" />
    )}

    <ContactShadows
      position={[0, -1.42, 0]}
      opacity={0.5}
      scale={7}
      blur={3.4}
      far={3}
      resolution={512}
      color="#000000"
    />
  </>
);

interface MizanBalance3DProps {
  className?: string;
}

export const MizanBalance3D = ({ className }: MizanBalance3DProps) => {
  const dpr = useMemo<[number, number]>(() => [1, 2], []);
  const isMobile = useIsMobile();
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setVisible(entries.some((e) => e.isIntersecting)),
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host} className={className} aria-hidden="true">
      <Canvas
        dpr={isMobile ? [1, 1.5] : dpr}
        shadows
        frameloop={visible ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 1.1, 8.2], fov: 30 }}
      >
        <Suspense fallback={null}>
          <Rig reduced={reduced} simple={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default MizanBalance3D;
