import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SectionBoundary } from "@/components/marketing/SectionBoundary";
import { DepthAccents, DepthHorizon } from "@/components/marketing/depth";


/** Consistent editorial section wrapper for the marketing routes. */
export const Section = ({
  eyebrow,
  title,
  lede,
  children,
  className,
  align = "left",
  id,
  depth = true,
  horizon = true,
}: {
  eyebrow?: string;
  title?: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  className?: string;
  align?: "left" | "center";
  id?: string;
  /** Layered floating accents parallaxing behind the section. */
  depth?: boolean;
  /** Soft gradient horizon line at the top edge of the section. */
  horizon?: boolean;
}) => (
  <section
    id={id}
    className={cn("relative mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-24", className)}
  >
    {horizon && <DepthHorizon className="absolute inset-x-0 top-0" />}
    {depth && <DepthAccents />}
    {(eyebrow || title || lede) && (
      <div className={cn("max-w-[62ch]", align === "center" && "mx-auto text-center")}>
        {eyebrow && <span className="eyebrow-label">{eyebrow}</span>}
        {title && (
          <h2 className="headline-editorial mt-4 text-[30px] text-foreground sm:text-[40px]">
            {title}
          </h2>
        )}
        {lede && (
          <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
            {lede}
          </p>
        )}
      </div>
    )}
    {children && <SectionBoundary label={eyebrow ?? id}>{children}</SectionBoundary>}
  </section>
);

export default Section;
