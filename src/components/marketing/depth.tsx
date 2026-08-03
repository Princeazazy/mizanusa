import {
  CSSProperties,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Capability probes — motion is opt-out, cursor depth is desktop-only.       */
/* -------------------------------------------------------------------------- */

const safeMatch = (query: string) => {
  try {
    return typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia(query)
      : null;
  } catch {
    return null;
  }
};

/** True when the visitor has not asked for reduced motion. */
export const useMotionAllowed = () => {
  const [allowed, setAllowed] = useState(true);

  useEffect(() => {
    const mql = safeMatch("(prefers-reduced-motion: reduce)");
    if (!mql) return;
    const apply = () => setAllowed(!mql.matches);
    apply();
    mql.addEventListener?.("change", apply);
    return () => mql.removeEventListener?.("change", apply);
  }, []);

  return allowed;
};

/** True on a precise-pointer viewport wide enough for cursor-linked depth. */
export const usePointerDepth = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mql = safeMatch("(min-width: 1024px) and (pointer: fine)");
    if (!mql) return;
    const apply = () => setEnabled(mql.matches);
    apply();
    mql.addEventListener?.("change", apply);
    return () => mql.removeEventListener?.("change", apply);
  }, []);

  return enabled;
};

/* -------------------------------------------------------------------------- */
/*  Background dot-grid that drifts slower than the content above it.          */
/* -------------------------------------------------------------------------- */

/**
 * Scroll-linked parallax field rendered behind the page content. Transform-only,
 * so it never triggers layout. Static when reduced motion is requested.
 */
export const ParallaxField = ({ className }: { className?: string }) => {
  const motionAllowed = useMotionAllowed();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (v) => (motionAllowed ? v * -0.14 : 0));
  const yFar = useTransform(scrollY, (v) => (motionAllowed ? v * -0.06 : 0));

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none fixed inset-0 z-0 overflow-hidden", className)}
    >
      <motion.div
        style={{ y: yFar }}
        className="absolute -inset-x-24 -top-24 bottom-[-30%] opacity-[0.5]"
      >
        <div className="depth-grid depth-grid-far h-full w-full" />
      </motion.div>
      <motion.div
        style={{ y }}
        className="absolute -inset-x-24 -top-24 bottom-[-40%] opacity-[0.65]"
      >
        <div className="depth-grid h-full w-full" />
      </motion.div>
      <div className="depth-vignette absolute inset-0" />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Cursor-linked 3D tilt with a travelling specular highlight.                */
/* -------------------------------------------------------------------------- */

/**
 * Wraps a card in a restrained 3D tilt (max ~3.5°) that eases toward the cursor,
 * plus a specular sheen that tracks the pointer. Desktop + motion only; on any
 * other device it renders a plain container with zero listeners.
 */
export const TiltCard = ({
  children,
  className,
  style,
  as = "div",
  max = 3.5,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "article" | "li";
  max?: number;
}) => {
  const motionAllowed = useMotionAllowed();
  const pointerDepth = usePointerDepth();
  const active = motionAllowed && pointerDepth;
  const ref = useRef<HTMLDivElement>(null);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glow = useMotionValue(0);

  const springCfg = { stiffness: 140, damping: 18, mass: 0.5 };
  const rotateX = useSpring(rx, springCfg);
  const rotateY = useSpring(ry, springCfg);
  const sheenX = useSpring(gx, { stiffness: 90, damping: 20 });
  const sheenY = useSpring(gy, { stiffness: 90, damping: 20 });
  const sheenOpacity = useSpring(glow, { stiffness: 120, damping: 22 });

  const sheen = useTransform(
    [sheenX, sheenY],
    ([x, y]: number[]) =>
      `radial-gradient(420px circle at ${x}% ${y}%, hsl(var(--primary) / 0.16), transparent 62%)`,
  );

  const handleMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    ry.set((px - 0.5) * 2 * max);
    rx.set((0.5 - py) * 2 * max);
    gx.set(px * 100);
    gy.set(py * 100);
    glow.set(1);
  };

  const handleLeave = () => {
    rx.set(0);
    ry.set(0);
    gx.set(50);
    gy.set(50);
    glow.set(0);
  };

  const Tag = motion[as] as typeof motion.div;

  if (!active) {
    const Plain = as === "article" ? "article" : as === "li" ? "li" : "div";
    return (
      <Plain className={className} style={style}>
        {children}
      </Plain>
    );
  }

  return (
    <div className="depth-stage" style={{ display: "contents" }}>
      <Tag
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={{ rotateX, rotateY, transformPerspective: 1100, ...style }}
        className={cn("relative will-change-transform", className)}
      >
        <motion.span
          aria-hidden="true"
          style={{ backgroundImage: sheen, opacity: sheenOpacity }}
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
        />
        <span className="relative block" style={{ transform: "translateZ(0.01px)" }}>
          {children}
        </span>
      </Tag>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Perspective showcase — a resting tilt that flattens as it centres.         */
/* -------------------------------------------------------------------------- */

/**
 * Presents a block of UI on a true 3D plane: it rests at a slight rotateX/rotateY
 * and eases toward flat as it reaches the centre of the viewport, with a soft
 * reflected glow beneath.
 */
export const PerspectiveShowcase = ({
  children,
  className,
  restTiltX = 9,
  restTiltY = -5,
}: {
  children: ReactNode;
  className?: string;
  restTiltX?: number;
  restTiltY?: number;
}) => {
  const motionAllowed = useMotionAllowed();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 22, mass: 0.4 });

  const rotateX = useTransform(progress, [0, 1], [motionAllowed ? restTiltX : 0, 0]);
  const rotateY = useTransform(progress, [0, 1], [motionAllowed ? restTiltY : 0, 0]);
  const scale = useTransform(progress, [0, 1], [motionAllowed ? 0.955 : 1, 1]);
  const glowOpacity = useTransform(progress, [0, 1], [motionAllowed ? 0.75 : 0.35, 0.3]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div
        aria-hidden="true"
        style={{ opacity: glowOpacity }}
        className="depth-reflection pointer-events-none absolute inset-x-[8%] -bottom-10 h-32"
      />
      <motion.div
        style={{ rotateX, rotateY, scale, transformPerspective: 1600 }}
        className="relative will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Layered floating accents at different z-depths.                            */
/* -------------------------------------------------------------------------- */

type Accent = { x: string; y: string; size: number; depth: number; tone?: "primary" | "neutral" };

const DEFAULT_ACCENTS: Accent[] = [
  { x: "6%", y: "12%", size: 180, depth: 0.22, tone: "primary" },
  { x: "78%", y: "4%", size: 120, depth: 0.4, tone: "neutral" },
  { x: "88%", y: "62%", size: 220, depth: 0.14, tone: "primary" },
  { x: "22%", y: "78%", size: 140, depth: 0.32, tone: "neutral" },
];

/** Soft out-of-focus accent orbs that parallax at different rates. */
export const DepthAccents = ({
  accents = DEFAULT_ACCENTS,
  className,
}: {
  accents?: Accent[];
  className?: string;
}) => {
  const motionAllowed = useMotionAllowed();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      {accents.map((a, i) => (
        <AccentOrb key={i} accent={a} progress={scrollYProgress} enabled={motionAllowed} />
      ))}
    </div>
  );
};

const AccentOrb = ({
  accent,
  progress,
  enabled,
}: {
  accent: Accent;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  enabled: boolean;
}) => {
  const y = useTransform(progress, [0, 1], enabled ? [accent.depth * 90, accent.depth * -90] : [0, 0]);
  const tone =
    accent.tone === "primary"
      ? "radial-gradient(circle, hsl(var(--primary) / 0.13), transparent 70%)"
      : "radial-gradient(circle, hsl(0 0% 100% / 0.05), transparent 70%)";

  return (
    <motion.span
      style={{
        y,
        left: accent.x,
        top: accent.y,
        width: accent.size,
        height: accent.size,
        backgroundImage: tone,
        filter: `blur(${Math.round(accent.size / 8)}px)`,
      }}
      className="absolute rounded-full will-change-transform"
    />
  );
};

/* -------------------------------------------------------------------------- */
/*  Horizon divider — depth fog between major sections.                        */
/* -------------------------------------------------------------------------- */

/** A soft gradient horizon so sections read as receding space, not stacked boxes. */
export const DepthHorizon = ({ className }: { className?: string }) => (
  <div aria-hidden="true" className={cn("relative h-px w-full", className)}>
    <div className="absolute inset-x-0 -top-24 h-48 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.07),transparent_70%)]" />
    <div className="absolute inset-x-[12%] top-0 h-px bg-[linear-gradient(90deg,transparent,hsl(var(--primary)/0.35),transparent)]" />
  </div>
);
