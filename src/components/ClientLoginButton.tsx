import { ArrowUpRight } from "lucide-react";
import { useLoginNav } from "@/components/auth/LoginNav";

interface ClientLoginButtonProps {
  className?: string;
}

/** Persistent, high-contrast client entry point. Present in every page header. */
export const ClientLoginButton = ({ className = "" }: ClientLoginButtonProps) => {
  const { requestLogin } = useLoginNav();

  return (
    <button
      type="button"
      onClick={() => requestLogin("client")}
      className={`group inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-[12.5px] font-medium tracking-[0.01em] text-background transition-all duration-200 hover:bg-primary hover:shadow-[0_6px_22px_-6px_hsl(var(--primary)/0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`}
    >
      Client Login
      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </button>
  );
};
