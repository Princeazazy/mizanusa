import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Consistent editorial section wrapper for the marketing routes. */
export const Section = ({
  eyebrow,
  title,
  lede,
  children,
  className,
  align = "left",
  id,
}: {
  eyebrow?: string;
  title?: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  className?: string;
  align?: "left" | "center";
  id?: string;
}) => (
  <section id={id} className={cn("mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-24", className)}>
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
    {children}
  </section>
);

export default Section;
