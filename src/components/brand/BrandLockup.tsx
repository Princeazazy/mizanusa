import { cn } from "@/lib/utils";
import mizanMark from "@/assets/mizan-mark.png";

type LockupSize = "sm" | "md" | "lg";

interface BrandLockupProps {
  /** Client logo asset. When omitted the lockup renders the Mizan mark alone. */
  clientLogo?: string;
  clientName?: string;
  /** Relationship label shown above the client mark. */
  eyebrow?: string;
  size?: LockupSize;
  className?: string;
  /** Route the mark to a click target (e.g. return to dashboard). */
  onLogoClick?: () => void;
}

/**
 * Co-branding lockup.
 *
 * Both marks are normalised to a shared optical cap-height rather than to their
 * raw pixel boxes: the Mizan emblem is roughly square, client assets are usually
 * wide wordmarks, so the client mark is set slightly shorter to read as an equal
 * weight. Client assets are additionally clamped by max-height and max-width so a
 * tall or very wide upload can never blow out the header.
 */
const SIZES: Record<LockupSize, { mizan: string; client: string; rule: string; gap: string }> = {
  sm: { mizan: "h-8", client: "h-6 max-w-[120px]", rule: "h-6", gap: "gap-3" },
  md: { mizan: "h-11", client: "h-8 max-w-[168px]", rule: "h-7", gap: "gap-4" },
  lg: { mizan: "h-14", client: "h-10 max-w-[220px]", rule: "h-9", gap: "gap-5" },
};

export const BrandLockup = ({
  clientLogo,
  clientName,
  eyebrow = "Prepared for",
  size = "md",
  className,
  onLogoClick,
}: BrandLockupProps) => {
  const s = SIZES[size];

  const mark = (
    <img
      src={mizanMark}
      alt="Mizan"
      className={cn(s.mizan, "w-auto shrink-0 object-contain")}
      loading="eager"
      decoding="async"
    />
  );

  return (
    <div className={cn("flex items-center", s.gap, className)}>
      {onLogoClick ? (
        <button
          type="button"
          onClick={onLogoClick}
          aria-label="Mizan — go to dashboard"
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {mark}
        </button>
      ) : (
        mark
      )}

      {clientLogo && (
        <>
          {/* Hairline divider — never a multiplication glyph */}
          <span
            aria-hidden="true"
            className={cn("hidden w-px shrink-0 bg-white/[0.12] sm:block", s.rule)}
          />
          <div className="hidden min-w-0 flex-col justify-center gap-1 sm:flex">
            {eyebrow && <span className="eyebrow-label leading-none">{eyebrow}</span>}
            <img
              src={clientLogo}
              alt={clientName ? `${clientName} logo` : "Client logo"}
              className={cn(s.client, "w-auto object-contain object-left")}
              loading="lazy"
              decoding="async"
            />
          </div>
        </>
      )}
    </div>
  );
};

/** Text fallback for clients without a logo asset (e.g. demo accounts). */
export const ClientMonogram = ({ name, className }: { name: string; className?: string }) => {
  const initials = name
    .replace(/\b(LLC|Inc\.?|Co\.?|Corp\.?)\b/gi, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <span
      className={cn(
        "inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-white/[0.1] bg-white/[0.04] px-2 text-[13px] font-medium tracking-[0.08em] text-foreground/85",
        className,
      )}
      aria-label={name}
    >
      {initials || "—"}
    </span>
  );
};
