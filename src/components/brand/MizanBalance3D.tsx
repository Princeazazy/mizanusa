import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import {
  AdditiveBlending,
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  MathUtils,
  Vector2,
  Vector3,
} from "three";
import type { Group, Mesh, MeshStandardMaterial, PointLight } from "three";

import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Mizan (ميزان) — a balance scale reinterpreted as a brand sculpture:
 * obsidian body with high clearcoat, polished gold accents, and a teal emissive
 * inlay. Canvas stays fully transparent; page bloom is CSS.
 */

const OBSIDIAN = {
  color: "#0a0c11",
  metalness: 0.55,
  roughness: 0.17,
  clearcoat: 1,
  clearcoatRoughness: 0.04,
} as const;

const OBSIDIAN_SOFT = {
  color: "#12151d",
  metalness: 0.4,
  roughness: 0.3,
  clearcoat: 0.8,
  clearcoatRoughness: 0.12,
} as const;

const BRUSHED = {
  color: "#5b6272",
  metalness: 0.95,
  roughness: 0.38,
  anisotropy: 0.7,
  anisotropyRotation: Math.PI / 2,
} as const;

const GOLD = {
  color: "#d8b978",
  metalness: 1,
  roughness: 0.13,
  clearcoat: 0.9,
  clearcoatRoughness: 0.06,
} as const;

const ACCENT = "#2ee6c5";
const RIM = "#8b7dff";

/**
 * Soft radial glow texture generated offscreen. Alpha reaches EXACTLY zero well
 * inside the sprite bounds (~60% of the radius), so a sprite can never paint a
 * visible edge or square. Replaces the postprocessing bloom pass entirely.
 */
let glowTexture: CanvasTexture | null = null;
const getGlowTexture = () => {
  if (glowTexture) return glowTexture;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  // Some mobile browsers refuse extra 2D contexts under memory pressure — an
  // untextured sprite is fine, a thrown error is not.
  if (!ctx) return null;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size * 0.3);
  g.addColorStop(0, "rgba(255,255,255,0.85)");
  g.addColorStop(0.35, "rgba(255,255,255,0.28)");
  g.addColorStop(0.7, "rgba(255,255,255,0.05)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  glowTexture = new CanvasTexture(canvas);
  return glowTexture;
};

/** True only when a real WebGL context can actually be created in this browser. */
const detectWebGL = () => {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    if (!gl) return false;
    const lose = (gl as WebGLRenderingContext).getExtension?.("WEBGL_lose_context");
    lose?.loseContext?.();
    return true;
  } catch {
    return false;
  }
};


/** Tiny additive glow halo attached to an emissive element. */
const GlowSprite = ({
  scale = 0.3,
  color = ACCENT,
  opacity = 0.9,
}: {
  scale?: number;
  color?: string;
  opacity?: number;
}) => (
  <sprite scale={[scale, scale, scale]}>
    <spriteMaterial
      map={getGlowTexture()}
      color={color}
      transparent
      opacity={opacity}
      blending={AdditiveBlending}
      depthWrite={false}
      toneMapped={false}
    />
  </sprite>
);

interface SceneProps {
  reduced: boolean;
  simple: boolean;
}

/** Very shallow, wide weighing dish: lathe profile with a thin floating lip. */
const DishGeometry = ({ radius = 0.56 }: { radius?: number }) => {
  const points = useMemo(() => {
    const pts: Vector2[] = [];
    const steps = 18;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      pts.push(new Vector2(radius * t, Math.pow(t, 2.3) * radius * 0.14));
    }
    pts.push(new Vector2(radius * 1.015, radius * 0.165));
    pts.push(new Vector2(radius * 1.0, radius * 0.172));
    pts.push(new Vector2(radius * 0.99, radius * 0.15));
    return pts;
  }, [radius]);

  return <latheGeometry args={[points, 84]} />;
};

/** A single elegant curved gold yoke arm. */
const YokeArm = ({
  radius,
  height,
  side,
}: {
  radius: number;
  height: number;
  side: number;
}) => {
  const geo = useMemo(() => {
    const curve = new CatmullRomCurve3([
      new Vector3(side * radius, 0, 0),
      new Vector3(side * radius * 0.92, height * 0.42, 0),
      new Vector3(side * radius * 0.42, height * 0.82, 0),
      new Vector3(0, height, 0),
    ]);
    return curve;
  }, [radius, height, side]);

  return (
    <mesh>
      <tubeGeometry args={[geo, 40, 0.0075, 8, false]} />
      <meshPhysicalMaterial {...GOLD} />
    </mesh>
  );
};

const Suspension = ({ radius, height }: { radius: number; height: number }) => (
  <group>
    <YokeArm radius={radius} height={height} side={-1} />
    <YokeArm radius={radius} height={height} side={1} />
    <group rotation={[0, Math.PI / 2, 0]}>
      <YokeArm radius={radius} height={height} side={-1} />
      <YokeArm radius={radius} height={height} side={1} />
    </group>
    <mesh position={[0, height + 0.028, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.03, 0.0075, 12, 32]} />
      <meshPhysicalMaterial {...GOLD} />
    </mesh>
  </group>
);

const BAND = {
  color: "#efe9da",
  roughness: 0.85,
  metalness: 0,
} as const;

const PAPER = {
  color: "#e7e4da",
  roughness: 0.95,
  metalness: 0,
} as const;

/** A banded bundle of bills: bill-proportioned slab, striated edges, currency strap. */
const BillBundle = ({ h = 0.042, tone = "#7a8a72" }: { h?: number; tone?: string }) => {
  const w = 0.3;
  const dz = w / 2.35;
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, h, dz]} />
        <meshStandardMaterial color={tone} roughness={0.9} metalness={0} />
      </mesh>
      {[-1, 1].map((s) =>
        [-0.3, -0.1, 0.1, 0.3].map((f) => (
          <mesh
            key={`${s}${f}`}
            position={[0, f * h, s * (dz / 2 + 0.0005)]}
            rotation={[0, s > 0 ? 0 : Math.PI, 0]}
          >
            <planeGeometry args={[w * 0.99, h * 0.09]} />
            <meshStandardMaterial color="#5f6d5b" roughness={0.95} />
          </mesh>
        )),
      )}
      <mesh>
        <boxGeometry args={[w * 0.2, h + 0.003, dz + 0.004]} />
        <meshStandardMaterial {...BAND} />
      </mesh>
    </group>
  );
};

const BUNDLES: { y: number; x: number; z: number; r: number; h: number; tone: string }[] = [
  { y: 0, x: 0, z: 0, r: 0.05, h: 0.044, tone: "#8fa383" },
  { y: 0.046, x: 0.01, z: -0.007, r: -0.11, h: 0.042, tone: "#99ad8d" },
  { y: 0.09, x: -0.009, z: 0.009, r: 0.16, h: 0.04, tone: "#889c7d" },
  { y: 0.131, x: 0.007, z: 0.005, r: -0.06, h: 0.038, tone: "#93a788" },
  { y: 0.17, x: -0.012, z: -0.01, r: 0.27, h: 0.036, tone: "#9db191" },
  { y: 0.207, x: 0.008, z: 0.011, r: -0.2, h: 0.034, tone: "#8ea281" },
];

/** A short stack of gold coins. */
const CoinStack = ({ count = 6, r = 0.052 }: { count?: number; r?: number }) => (
  <group>
    {Array.from({ length: count }).map((_, i) => (
      <mesh key={i} position={[0, 0.0105 * i + 0.005, 0]} rotation={[0, i * 0.4, 0]} castShadow>
        <cylinderGeometry args={[r, r, 0.0095, 34]} />
        <meshPhysicalMaterial {...GOLD} />
      </mesh>
    ))}
  </group>
);

const CashStack = () => (
  <group position={[0, 0.055, 0]} scale={1.45}>
    {/* banded bill bundles, offset to leave room for coins */}
    <group position={[-0.045, 0, 0.02]}>
      {BUNDLES.map((b, i) => (
        <group key={i} position={[b.x, b.y, b.z]} rotation={[0, b.r, 0]}>
          <BillBundle h={b.h} tone={b.tone} />
        </group>
      ))}
    </group>

    {/* coin stacks leaning against the bills */}
    <group position={[0.17, 0, -0.07]}>
      <CoinStack count={7} />
    </group>
    <group position={[0.16, 0, 0.08]}>
      <CoinStack count={4} r={0.048} />
    </group>
    {/* a couple of loose coins lying flat */}
    <mesh position={[0.24, 0.006, 0.02]} rotation={[0, 0.6, 0]} castShadow>
      <cylinderGeometry args={[0.05, 0.05, 0.0095, 34]} />
      <meshPhysicalMaterial {...GOLD} />
    </mesh>
    <mesh position={[-0.19, 0.006, -0.11]} rotation={[0, 0.2, 0]} castShadow>
      <cylinderGeometry args={[0.047, 0.047, 0.0095, 34]} />
      <meshPhysicalMaterial {...GOLD} />
    </mesh>
  </group>
);

const COVERS = [
  { color: "#12151d", metalness: 0.4, roughness: 0.3, clearcoat: 0.8 },
  { color: "#17222a", metalness: 0.35, roughness: 0.34, clearcoat: 0.7 },
  { color: "#221a20", metalness: 0.35, roughness: 0.36, clearcoat: 0.7 },
] as const;

/** A closed ledger book: cover, page block, gold spine and corner details. */
const LedgerBook = ({
  w = 0.3,
  d = 0.215,
  h = 0.044,
  cover = 0,
  ruled = false,
}: {
  w?: number;
  d?: number;
  h?: number;
  cover?: number;
  ruled?: boolean;
}) => (
  <group>
    <mesh castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <meshPhysicalMaterial {...COVERS[cover % COVERS.length]} />
    </mesh>
    <mesh position={[0.006, 0, 0]}>
      <boxGeometry args={[w * 0.98, h * 0.68, d * 0.97]} />
      <meshStandardMaterial {...PAPER} />
    </mesh>
    <mesh position={[-w / 2 - 0.0015, 0, 0]}>
      <boxGeometry args={[0.009, h * 0.96, d * 0.99]} />
      <meshPhysicalMaterial {...GOLD} />
    </mesh>
    {[
      [w * 0.43, d * 0.42],
      [w * 0.43, -d * 0.42],
      [-w * 0.37, d * 0.42],
      [-w * 0.37, -d * 0.42],
    ].map(([x, z]) => (
      <mesh key={`${x}${z}`} position={[x, h / 2 + 0.0008, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 0.1, w * 0.1]} />
        <meshPhysicalMaterial {...GOLD} />
      </mesh>
    ))}
    {ruled && (
      <mesh position={[0, h / 2 + 0.0006, d * 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 0.66, 0.004]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.9} />
      </mesh>
    )}
  </group>
);

/** A fuller bookkeeping pile: ruled sheets, a stack of ledgers, one leaning book, a pen. */
const BooksStack = () => (
  <group position={[0, 0.05, 0]} rotation={[0, 0.3, 0]} scale={1.42}>
    {/* loose ruled sheets at the base */}
    <group position={[0.012, 0.007, 0.012]} rotation={[0, -0.14, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.34, 0.014, 0.24]} />
        <meshStandardMaterial {...PAPER} />
      </mesh>
    </group>
    <group position={[-0.012, 0.022, -0.01]} rotation={[0, 0.1, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.34, 0.014, 0.24]} />
        <meshStandardMaterial {...PAPER} />
      </mesh>
    </group>
    <group position={[0.004, 0.037, 0.004]} rotation={[0, -0.05, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.34, 0.014, 0.24]} />
        <meshStandardMaterial {...PAPER} />
      </mesh>
      {[-0.075, -0.025, 0.025, 0.075].map((z) => (
        <mesh key={z} position={[0, 0.0075, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.27, 0.005]} />
          <meshStandardMaterial
            color={ACCENT}
            emissive={ACCENT}
            emissiveIntensity={0.6}
            roughness={0.9}
          />
        </mesh>
      ))}
    </group>

    {/* stack of three ledgers, each slightly rotated */}
    <group position={[-0.004, 0.068, -0.004]} rotation={[0, 0.16, 0]}>
      <LedgerBook w={0.33} d={0.235} h={0.05} cover={1} />
    </group>
    <group position={[0.008, 0.117, 0.008]} rotation={[0, -0.22, 0]}>
      <LedgerBook w={0.31} d={0.222} h={0.046} cover={2} />
    </group>
    <group position={[-0.006, 0.163, -0.006]} rotation={[0, 0.34, 0]}>
      <LedgerBook w={0.29} d={0.208} h={0.042} cover={0} ruled />
      {/* slim pen resting on the top book */}
      <group position={[0.01, 0.028, -0.03]} rotation={[0, 0.5, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.0075, 0.0075, 0.2, 14]} />
          <meshPhysicalMaterial color="#0c0e13" metalness={0.7} roughness={0.2} clearcoat={1} />
        </mesh>
        <mesh position={[0.075, 0.006, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.004, 0.05, 0.006]} />
          <meshPhysicalMaterial {...GOLD} />
        </mesh>
      </group>
    </group>

    {/* one book leaning against the stack */}
    <group position={[0.185, 0.078, 0.1]} rotation={[0, -0.7, -0.3]}>
      <LedgerBook w={0.26} d={0.185} h={0.04} cover={2} />
    </group>
  </group>
);

const PanAssembly = ({ x, children }: { x: number; children?: React.ReactNode }) => {
  const radius = 0.56;
  const drop = 0.82;
  const lip = radius * 0.168;
  return (
    <group position={[x, 0, 0]}>
      <group position={[0, -drop, 0]}>
        <mesh castShadow receiveShadow>
          <DishGeometry radius={radius} />
          <meshPhysicalMaterial {...OBSIDIAN} side={2} />
        </mesh>
        <mesh position={[0, lip, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius * 1.012, 0.0075, 12, 84]} />
          <meshPhysicalMaterial {...GOLD} />
        </mesh>

        <group position={[0, lip, 0]}>
          <Suspension radius={radius * 0.95} height={drop - 0.07 - lip} />
        </group>
        {children}
      </group>
    </group>
  );
};

/** Blade beam: flattened, gently curved underside, gold tips, teal inlay. */
const Beam = ({ inlay }: { inlay: React.RefObject<MeshStandardMaterial> }) => {
  const segs = 13;
  const half = 1.3;
  return (
    <group>
      {Array.from({ length: segs }).map((_, i) => {
        const t = (i + 0.5) / segs;
        const x = -half + t * half * 2;
        const k = 1 - Math.pow(Math.abs(x) / half, 1.7);
        const h = 0.028 + k * 0.05;
        const d = 0.05 + k * 0.055;
        return (
          <mesh key={i} position={[x, -0.5 * (0.078 - h) + 0.012 * (1 - k), 0]} castShadow>
            <boxGeometry args={[(half * 2) / segs + 0.002, h, d]} />
            <meshPhysicalMaterial {...OBSIDIAN} />
          </mesh>
        );
      })}
      {/* central polished gold pivot collar */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.042, 0.042, 0.14, 32]} />
        <meshPhysicalMaterial {...GOLD} />
      </mesh>
      {/* gold caps at both tips */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * half, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.026, 0.021, 0.055, 24]} />
            <meshPhysicalMaterial {...GOLD} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.026, 0.006, 12, 28]} />
            <meshPhysicalMaterial {...GOLD} />
          </mesh>
        </group>
      ))}
      {/* teal emissive inlay, full length */}
      <mesh position={[0, 0.032, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.0055, 0.0055, half * 2, 10]} />
        <meshStandardMaterial
          ref={inlay}
          color={ACCENT}
          emissive={ACCENT}
          emissiveIntensity={1.5}
          roughness={0.35}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};


const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

const Balance = ({ reduced, simple }: SceneProps) => {
  const group = useRef<Group>(null);
  const beam = useRef<Group>(null);
  const needle = useRef<Group>(null);
  const inlay = useRef<MeshStandardMaterial>(null);
  const ring = useRef<MeshStandardMaterial>(null);
  const sweep = useRef<PointLight>(null);
  const plinth = useRef<Group>(null);
  const column = useRef<Mesh>(null);
  const pivot = useRef<Group>(null);
  const tilt = useRef(0);
  const intro = useRef(reduced ? 1 : 0);
  const { pointer } = useThree();

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const d = Math.min(delta, 0.05);

    // entrance
    if (intro.current < 1) intro.current = Math.min(1, intro.current + d / 2.3);
    const e = easeOutExpo(intro.current);
    const stage = (from: number, to: number) =>
      MathUtils.clamp((e - from) / (to - from), 0, 1);

    const sPlinth = stage(0, 0.28);
    const sColumn = stage(0.16, 0.5);
    const sBeam = stage(0.4, 0.78);
    const sPans = stage(0.6, 0.9);

    if (plinth.current) {
      plinth.current.position.y = -0.16 * (1 - sPlinth);
      plinth.current.scale.setScalar(0.9 + 0.1 * sPlinth);
    }
    if (column.current) column.current.scale.y = 0.04 + 0.96 * sColumn;
    if (pivot.current) pivot.current.scale.setScalar(0.001 + 0.999 * sColumn);

    if (group.current) {
      group.current.rotation.y += d * 0.1;
      if (!reduced) {
        group.current.position.y += (Math.sin(t * 0.5) * 0.03 - group.current.position.y + 0.15) * 0.06;
        if (!simple) {
          const tx = pointer.y * 0.06;
          const tz = -pointer.x * 0.05;
          group.current.rotation.x += (tx - group.current.rotation.x) * 0.05;
          group.current.rotation.z += (tz - group.current.rotation.z) * 0.05;
        }
      }
    }

    if (beam.current) {
      beam.current.scale.setScalar(0.001 + 0.999 * sBeam);
      const settle = (1 - sBeam) * 0.09;
      const target = reduced
        ? 0
        : (Math.sin(t * 0.22) * 0.006 + Math.sin(t * 0.09 + 1.2) * 0.0025) *
            (0.8 + 0.2 * Math.cos(t * 0.05)) +
          Math.sin(sBeam * 14) * settle;
      tilt.current += (target - tilt.current) * (1 - Math.pow(0.01, d));
      beam.current.rotation.z = tilt.current;
      beam.current.children.forEach((child, i) => {
        if (i > 0) {
          child.rotation.z = -tilt.current;
          child.scale.setScalar(0.001 + 0.999 * sPans);
        }
      });
      if (needle.current) needle.current.rotation.z = tilt.current;
    }

    if (inlay.current) inlay.current.emissiveIntensity = (1.35 + Math.sin(t * 0.6) * 0.3) * sBeam;
    if (ring.current) ring.current.emissiveIntensity = (2.2 + Math.sin(t * 0.9) * 0.5) * sPlinth;

    if (sweep.current) {
      const p = (t % 9) / 9;
      sweep.current.position.x = -3.6 + p * 7.2;
      sweep.current.intensity = Math.sin(Math.PI * p) * 5;
    }
  });

  return (
    <group ref={group} position={[0, 0.15, 0]} scale={1.18}>
      {/* plinth with recessed glowing seam */}
      <group ref={plinth}>
        <mesh position={[0, -1.4, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[0.6, 0.7, 0.05, 72]} />
          <meshPhysicalMaterial {...OBSIDIAN} />
        </mesh>
        <mesh position={[0, -1.363, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.575, 0.0035, 10, 84]} />
          <meshStandardMaterial
            ref={ring}
            color={ACCENT}
            emissive={ACCENT}
            emissiveIntensity={2.2}
            toneMapped={false}
          />
        </mesh>
        {Array.from({ length: 14 }).map((_, i) => {
          const a = (i / 14) * Math.PI * 2;
          return (
            <group
              key={a}
              position={[Math.cos(a) * 0.575, -1.363, Math.sin(a) * 0.575]}
            >
              <GlowSprite scale={0.2} opacity={0.22} />
            </group>
          );
        })}
        <mesh position={[0, -1.325, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[0.36, 0.5, 0.08, 72]} />
          <meshPhysicalMaterial {...OBSIDIAN_SOFT} />
        </mesh>
        <mesh position={[0, -1.283, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.36, 0.007, 12, 84]} />
          <meshPhysicalMaterial {...GOLD} />
        </mesh>
      </group>

      {/* dramatically tapered column */}
      <mesh ref={column} position={[0, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.095, 1.54, 48]} />
        <meshPhysicalMaterial {...OBSIDIAN} />
      </mesh>

      <group ref={pivot}>
        {/* pivot fork in brushed metal */}
        {[-0.072, 0.072].map((z) => (
          <mesh key={z} position={[0, 0.2, z]} rotation={[0.12 * Math.sign(z), 0, 0]} castShadow>
            <cylinderGeometry args={[0.014, 0.019, 0.3, 20]} />
            <meshPhysicalMaterial {...BRUSHED} />
          </mesh>
        ))}
        <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.026, 0.026, 0.2, 28]} />
          <meshPhysicalMaterial {...GOLD} />
        </mesh>

        {/* indicator needle */}
        <group ref={needle} position={[0, 0.3, 0.11]}>
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.0035, 0.01, 0.44, 12]} />
            <meshPhysicalMaterial {...GOLD} />
          </mesh>
          <group position={[0, -0.45, 0]}>
            <mesh>
              <sphereGeometry args={[0.014, 16, 16]} />
              <meshStandardMaterial
                color={ACCENT}
                emissive={ACCENT}
                emissiveIntensity={2.6}
                toneMapped={false}
              />
            </mesh>
            <GlowSprite scale={0.34} opacity={0.85} />
          </group>
        </group>
        <mesh position={[0, -0.02, 0.145]}>
          <boxGeometry args={[0.2, 0.01, 0.006]} />
          <meshPhysicalMaterial {...BRUSHED} />
        </mesh>
      </group>

      <group ref={beam} position={[0, 0.3, 0]}>
        <Beam inlay={inlay} />
        {[-0.86, -0.43, 0, 0.43, 0.86].map((x) => (
          <group key={x} position={[x, 0.032, 0]}>
            <GlowSprite scale={0.24} opacity={0.5} />
          </group>
        ))}
        <PanAssembly x={-1.3}>
          <CashStack />
        </PanAssembly>
        <PanAssembly x={1.3}>
          <BooksStack />
        </PanAssembly>
      </group>

      <pointLight ref={sweep} position={[0, 0.1, 2.4]} color="#dfe8ff" intensity={0} distance={9} />
    </group>
  );
};

/** Slow cinematic drift: gentle orbital sway plus a breathing dolly.
 *  The base distance is fit to the canvas aspect ratio so the full object
 *  (pans + plinth) always stays inside the frame at every breakpoint. */
const HALF_W = 2.55; // world half-width of the sculpture incl. pans
const HALF_H = 2.05; // world half-height incl. plinth + shadow
const CameraDrift = ({ reduced }: { reduced: boolean }) => {
  const target = useMemo(() => new Vector3(0, 0.1, 0), []);
  useFrame((state) => {
    const aspect = state.size.width / Math.max(1, state.size.height);
    const tanHalfFov = Math.tan((34 * Math.PI) / 360);
    const distForHeight = HALF_H / tanHalfFov;
    const distForWidth = HALF_W / (tanHalfFov * aspect);
    const base = Math.max(distForHeight, distForWidth) * 1.06;

    const t = reduced ? 0 : state.clock.getElapsedTime();
    const yaw = Math.sin(t * 0.07) * 0.075;
    const dist = base + (reduced ? 0 : Math.sin(t * 0.05 + 1.1) * 0.3);
    const x = Math.sin(yaw) * dist;
    const z = Math.cos(yaw) * dist;
    const y = 1.05 + (reduced ? 0 : Math.sin(t * 0.045) * 0.12);
    state.camera.position.lerp(new Vector3(x, y, z), reduced ? 1 : 0.03);
    state.camera.lookAt(target);
  });
  return null;
};


const Rig = ({ reduced, simple }: SceneProps) => (
  <>
    <Environment resolution={256} frames={1}>
      <Lightformer intensity={2.2} position={[0, 4, 3]} scale={[10, 4, 1]} color="#e8efff" />
      <Lightformer intensity={1.5} position={[-6, 1.5, -2]} scale={[7, 7, 1]} color="#6d8fd8" />
      <Lightformer intensity={1.9} position={[5, 0.6, 2]} scale={[6, 6, 1]} color="#ffd9a0" />
      <Lightformer intensity={0.25} position={[0, -3, 2]} scale={[10, 4, 1]} color="#0b0e15" />
    </Environment>

    <ambientLight intensity={0.09} />
    <directionalLight position={[3.6, 4.4, 2.6]} intensity={1.5} color="#ffe3b8" castShadow shadow-mapSize={[512, 512]} />
    <directionalLight position={[-3.4, 2.4, -4]} intensity={2.1} color={RIM} />
    <directionalLight position={[-4.2, 0.6, 2.2]} intensity={0.3} color="#8fb4c8" />

    <CameraDrift reduced={reduced} />
    <Balance reduced={reduced} simple={simple} />

    <ContactShadows
      position={[0, -1.46, 0]}
      opacity={0.42}
      scale={4.2}
      blur={3.2}
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
          background: "radial-gradient(closest-side, hsl(168 78% 54% / 0.1), transparent 52%)",
          filter: "blur(26px)",
        }}
      />
      <Canvas
        className="relative"
        dpr={isMobile ? [1, 1.5] : dpr}
        shadows
        frameloop={visible ? "always" : "never"}
        gl={{
          antialias: true,
          alpha: true,
          premultipliedAlpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(new Color("#000000"), 0);
          gl.setClearAlpha(0);
        }}
        camera={{ position: [0, 1.15, 9.4], fov: 34 }}
      >
        <Suspense fallback={null}>
          <Rig reduced={reduced} simple={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default MizanBalance3D;
