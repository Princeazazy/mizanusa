import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, Sparkles } from "@react-three/drei";
import { Vector2 } from "three";
import type { Group, MeshStandardMaterial, PointLight } from "three";

import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Mizan (ميزان) — a classical apothecary balance.
 * Brushed titanium, polished accents, faint teal inlay. Fully transparent canvas:
 * any bloom is CSS on the page so it can never reveal a canvas edge.
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

const GOLD = {
  color: "#c9a86a",
  metalness: 1,
  roughness: 0.24,
  clearcoat: 0.6,
} as const;

const ACCENT = "#2ee6c5";
const RIM = "#8b7dff";

interface SceneProps {
  reduced: boolean;
  simple: boolean;
}

/** Shallow weighing dish: lathe profile, wide and shallow, with a thin lip. */
const DishGeometry = ({ radius = 0.5 }: { radius?: number }) => {
  const points = useMemo(() => {
    const pts: Vector2[] = [];
    const steps = 16;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const r = radius * t;
      // gentle bowl curve, very shallow
      const y = Math.pow(t, 2.1) * radius * 0.2;
      pts.push(new Vector2(r, y));
    }
    // thin lip turning slightly up and back under itself
    pts.push(new Vector2(radius * 1.02, radius * 0.235));
    pts.push(new Vector2(radius * 1.0, radius * 0.245));
    pts.push(new Vector2(radius * 0.985, radius * 0.215));
    return pts;
  }, [radius]);

  return <latheGeometry args={[points, 72]} />;
};

/** Three fine chains converging from the dish rim to a hook at the beam end. */
const Suspension = ({ radius, height }: { radius: number; height: number }) => (
  <group>
    {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((a, i) => {
      const x = Math.cos(a) * radius;
      const z = Math.sin(a) * radius;
      const len = Math.sqrt(height * height + radius * radius);
      const mid: [number, number, number] = [x / 2, height / 2, z / 2];
      // orient the rod along (−x, height, −z)
      const tilt = Math.atan2(radius, height);
      return (
        <group key={i} position={mid} rotation={[0, -a, 0]}>
          <mesh rotation={[0, 0, tilt]}>
            <cylinderGeometry args={[0.006, 0.006, len, 6]} />
            <meshPhysicalMaterial {...POLISHED} />
          </mesh>
        </group>
      );
    })}
    {/* convergence ring / hook at the top */}
    <mesh position={[0, height + 0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.032, 0.008, 10, 28]} />
      <meshPhysicalMaterial {...POLISHED} />
    </mesh>
  </group>
);

const BILL = {
  color: "#8d9c88",
  roughness: 0.92,
  metalness: 0,
} as const;

const BAND = {
  color: "#c8cfc4",
  roughness: 0.85,
  metalness: 0,
} as const;

const PAPER = {
  color: "#eceae4",
  roughness: 0.95,
  metalness: 0,
} as const;

const COVER = {
  color: "#15181e",
  roughness: 0.7,
  metalness: 0.05,
} as const;

/** A banded bundle of bills: slim slab, striated edges, strap around the middle. */
const BillBundle = ({ h = 0.05 }: { h?: number }) => (
  <group>
    <mesh castShadow>
      <boxGeometry args={[0.3, h, 0.14]} />
      <meshStandardMaterial {...BILL} />
    </mesh>
    {/* faint edge striations suggesting many bill edges */}
    {[-0.0165, -0.0055, 0.0055, 0.0165].map((y) => (
      <mesh key={y} position={[0, y * (h / 0.05), 0.0705]}>
        <planeGeometry args={[0.298, 0.0035]} />
        <meshStandardMaterial color="#6d7a69" roughness={0.95} />
      </mesh>
    ))}
    {[-0.0165, -0.0055, 0.0055, 0.0165].map((y) => (
      <mesh key={`b${y}`} position={[0, y * (h / 0.05), -0.0705]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.298, 0.0035]} />
        <meshStandardMaterial color="#6d7a69" roughness={0.95} />
      </mesh>
    ))}
    {/* band strap */}
    <mesh>
      <boxGeometry args={[0.062, h + 0.004, 0.145]} />
      <meshStandardMaterial {...BAND} />
    </mesh>
  </group>
);

const CashStack = () => (
  <group position={[0, 0.032, 0]}>
    <group position={[0, 0, 0]} rotation={[0, 0.06, 0]}>
      <BillBundle />
    </group>
    <group position={[0.008, 0.052, -0.006]} rotation={[0, -0.14, 0]}>
      <BillBundle h={0.046} />
    </group>
    <group position={[-0.012, 0.1, 0.01]} rotation={[0, 0.34, 0]}>
      <BillBundle h={0.042} />
    </group>
  </group>
);

/** Closed ledger book with a teal spine, topped by a short stack of ruled sheets. */
const BooksStack = () => (
  <group position={[0, 0.032, 0]} rotation={[0, 0.3, 0]}>
    {/* ledger book base */}
    <mesh castShadow>
      <boxGeometry args={[0.36, 0.055, 0.26]} />
      <meshStandardMaterial {...COVER} />
    </mesh>
    <mesh position={[-0.183, 0, 0]}>
      <boxGeometry args={[0.008, 0.05, 0.255]} />
      <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.35} roughness={0.6} />
    </mesh>
    {/* page block peeking out of the cover */}
    <mesh position={[0.006, 0, 0]}>
      <boxGeometry args={[0.352, 0.036, 0.248]} />
      <meshStandardMaterial {...PAPER} />
    </mesh>

    {/* sheets on top, slightly offset and rotated */}
    <group position={[0.01, 0.036, 0.008]} rotation={[0, -0.16, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.31, 0.008, 0.22]} />
        <meshStandardMaterial {...PAPER} />
      </mesh>
    </group>
    <group position={[-0.014, 0.046, -0.012]} rotation={[0, 0.22, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.31, 0.008, 0.22]} />
        <meshStandardMaterial {...PAPER} />
      </mesh>
      {/* faint ruled lines on the top sheet */}
      {[-0.06, -0.02, 0.02, 0.06].map((z) => (
        <mesh key={z} position={[0, 0.0045, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.24, 0.0045]} />
          <meshStandardMaterial color="#9aa6b4" roughness={0.9} />
        </mesh>
      ))}
    </group>
  </group>
);


const PanAssembly = ({
  x,
  children,
}: {
  x: number;
  children?: React.ReactNode;
}) => {
  const radius = 0.5;
  const drop = 0.78;
  return (
    <group position={[x, 0, 0]}>
      <group position={[0, -drop, 0]}>
        <mesh castShadow receiveShadow>
          <DishGeometry radius={radius} />
          <meshPhysicalMaterial {...BODY} side={2} />
        </mesh>
        <mesh position={[0, radius * 0.235, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius * 1.01, 0.007, 10, 72]} />
          <meshPhysicalMaterial {...POLISHED} />
        </mesh>

        <group position={[0, radius * 0.225, 0]}>
          <Suspension radius={radius * 0.94} height={drop - 0.06 - radius * 0.225} />
        </group>
        {children}
      </group>
    </group>
  );
};

const Balance = ({ reduced, simple }: SceneProps) => {
  const group = useRef<Group>(null);
  const beam = useRef<Group>(null);
  const needle = useRef<Group>(null);
  const inlay = useRef<MeshStandardMaterial>(null);
  const sweep = useRef<PointLight>(null);
  const tilt = useRef(0);
  const { pointer } = useThree();

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const d = Math.min(delta, 0.05);

    if (group.current) {
      group.current.rotation.y += d * 0.11;
      if (!reduced) {
        group.current.position.y += (Math.sin(t * 0.5) * 0.03 - group.current.position.y) * 0.06;
        if (!simple) {
          const tx = pointer.y * 0.07;
          const tz = -pointer.x * 0.055;
          group.current.rotation.x += (tx - group.current.rotation.x) * 0.05;
          group.current.rotation.z += (tz - group.current.rotation.z) * 0.05;
        }
      }
    }

    if (beam.current && !reduced) {
      const target =
        (Math.sin(t * 0.32) * 0.032 + Math.sin(t * 0.11 + 1.2) * 0.012) *
        (0.75 + 0.25 * Math.cos(t * 0.07));
      tilt.current += (target - tilt.current) * (1 - Math.pow(0.001, d));
      beam.current.rotation.z = tilt.current;
      // pans hang plumb regardless of beam tilt
      beam.current.children.forEach((child, i) => {
        if (i > 0) child.rotation.z = -tilt.current;
      });
      if (needle.current) needle.current.rotation.z = tilt.current;
    }

    if (inlay.current) inlay.current.emissiveIntensity = 0.5 + Math.sin(t * 0.6) * 0.15;

    if (sweep.current) {
      const p = (t % 9) / 9;
      sweep.current.position.x = -3.6 + p * 7.2;
      sweep.current.intensity = Math.sin(Math.PI * p) * 5.5;
    }
  });

  return (
    <group ref={group} position={[0, 0.15, 0]}>
      {/* two-step plinth */}
      <mesh position={[0, -1.4, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.62, 0.68, 0.05, 64]} />
        <meshPhysicalMaterial {...BODY_DARK} />
      </mesh>
      <mesh position={[0, -1.33, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.42, 0.52, 0.09, 64]} />
        <meshPhysicalMaterial {...BODY_DARK} />
      </mesh>
      <mesh position={[0, -1.283, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.007, 10, 72]} />
        <meshPhysicalMaterial {...POLISHED} />
      </mesh>


      {/* slender column */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.042, 0.066, 1.54, 40]} />
        <meshPhysicalMaterial {...BODY} />
      </mesh>

      {/* pivot fork */}
      {[-0.075, 0.075].map((z) => (
        <mesh key={z} position={[0, 0.2, z]} rotation={[0.12 * Math.sign(z), 0, 0]} castShadow>
          <cylinderGeometry args={[0.016, 0.02, 0.3, 16]} />
          <meshPhysicalMaterial {...BODY} />
        </mesh>
      ))}
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.2, 24]} />
        <meshPhysicalMaterial {...POLISHED} />
      </mesh>

      {/* indicator needle descending from the pivot */}
      <group ref={needle} position={[0, 0.3, 0.11]}>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.004, 0.011, 0.44, 10]} />
          <meshPhysicalMaterial {...POLISHED} />
        </mesh>
        <mesh position={[0, -0.45, 0]}>
          <sphereGeometry args={[0.015, 16, 16]} />
          <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.8} />
        </mesh>
      </group>
      {/* fixed reference scale plate behind the needle */}
      <mesh position={[0, -0.02, 0.145]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.22, 0.012, 0.006]} />
        <meshPhysicalMaterial {...BODY_DARK} />
      </mesh>

      <group ref={beam} position={[0, 0.3, 0]}>
        <group>
          {/* tapered beam: two cones meeting at the centre */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.65, 0, 0]} rotation={[0, 0, (s * Math.PI) / 2]} castShadow>
              <cylinderGeometry args={[0.014, 0.036, 1.3, 28]} />
              <meshPhysicalMaterial {...BODY} />
            </mesh>
          ))}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.036, 0.036, 0.16, 28]} />
            <meshPhysicalMaterial {...POLISHED} />
          </mesh>
          {/* end caps / hook points */}
          {[-1.3, 1.3].map((x) => (
            <mesh key={x} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.026, 0.007, 10, 24]} />
              <meshPhysicalMaterial {...POLISHED} />
            </mesh>
          ))}
          {/* faint teal inlay along the beam */}
          <mesh position={[0, 0.03, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.005, 0.005, 2.4, 8]} />
            <meshStandardMaterial
              ref={inlay}
              color={ACCENT}
              emissive={ACCENT}
              emissiveIntensity={0.55}
              roughness={0.4}
            />
          </mesh>
        </group>
        <PanAssembly x={-1.3}>
          <CoinStack />
        </PanAssembly>
        <PanAssembly x={1.3}>
          <LedgerTablet />
        </PanAssembly>
      </group>

      {/* travelling specular highlight — a real moving light, so nothing can
          ever paint a rectangle over the transparent canvas */}
      <pointLight ref={sweep} position={[0, 0.1, 2.4]} color="#dfe8ff" intensity={0} distance={9} />

    </group>
  );
};

const Rig = ({ reduced, simple }: SceneProps) => (
  <>
    <Environment resolution={256} frames={1}>
      <Lightformer intensity={2.4} position={[0, 4, 3]} scale={[10, 4, 1]} color="#eef3ff" />
      <Lightformer intensity={1.1} position={[-5, 1, 2]} scale={[6, 6, 1]} color="#5d7fb8" />
      <Lightformer intensity={1.6} position={[4, 0.5, -3]} scale={[6, 6, 1]} color={RIM} />
      <Lightformer intensity={0.6} position={[0, -3, 2]} scale={[10, 4, 1]} color="#1b2230" />
    </Environment>

    <ambientLight intensity={0.2} />
    <directionalLight position={[3.5, 5, 3]} intensity={1.9} castShadow shadow-mapSize={[512, 512]} />
    <directionalLight position={[-2.5, 2, -4]} intensity={1.4} color={RIM} />
    <directionalLight position={[-4, 1.2, 2.5]} intensity={0.4} color="#8fb4c8" />

    <Balance reduced={reduced} simple={simple} />

    {!simple && !reduced && (
      <Sparkles count={22} scale={[6, 4, 4]} size={1.6} speed={0.18} opacity={0.28} color="#cfd8ff" />
    )}

    <ContactShadows
      position={[0, -1.44, 0]}
      opacity={0.45}
      scale={5.4}
      blur={3.6}
      far={2.4}
      resolution={256}
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
    <div ref={host} className={`relative ${className ?? ""}`} aria-hidden="true">
      {/* CSS bloom — composites with the page background, fades to full transparency
          well inside its own bounds so no rectangle can ever be visible. */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(closest-side, hsl(252 70% 62% / 0.13), hsl(252 70% 62% / 0.04) 34%, transparent 58%)",
          filter: "blur(28px)",
        }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[58%] h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(closest-side, hsl(168 78% 54% / 0.1), transparent 52%)",
          filter: "blur(26px)",
        }}
      />
      <Canvas
        className="relative"
        dpr={isMobile ? [1, 1.5] : dpr}
        shadows
        frameloop={visible ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearAlpha(0);
        }}
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
