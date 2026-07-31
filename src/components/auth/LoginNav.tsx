import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { useClientAuth } from "@/hooks/useClientAuth";

export type LoginRole = "client" | "bookkeeper";

const PATHS: Record<LoginRole, string> = {
  client: "/auth?role=client",
  bookkeeper: "/auth?role=bookkeeper",
};

interface LoginNavValue {
  /** Navigate to the given login page, confirming a sign-out first when the other role is active. */
  requestLogin: (role: LoginRole) => void;
}

const LoginNavContext = createContext<LoginNavValue>({ requestLogin: () => {} });

/**
 * Single owner of cross-role login navigation. If a bookkeeper session is live and the
 * user asks for the client login (or vice versa), we confirm, fully sign out, then redirect.
 */
export const LoginNavProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAuthenticated: isClientAuthenticated, logout: clientLogout } = useClientAuth();
  const [pending, setPending] = useState<LoginRole | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  const requestLogin = useCallback(
    (role: LoginRole) => {
      const needsSwitch =
        (role === "client" && !!user) || (role === "bookkeeper" && isClientAuthenticated);

      if (needsSwitch) {
        setPending(role);
        return;
      }
      navigate(PATHS[role]);
    },
    [isClientAuthenticated, navigate, user],
  );

  const confirm = async () => {
    if (!pending) return;
    setSigningOut(true);
    try {
      if (pending === "client") {
        await signOut();
      } else {
        await clientLogout();
      }
    } finally {
      setSigningOut(false);
      const target = PATHS[pending];
      setPending(null);
      navigate(target, { replace: true });
    }
  };

  const value = useMemo(() => ({ requestLogin }), [requestLogin]);

  const switchingToClient = pending === "client";

  return (
    <LoginNavContext.Provider value={value}>
      {children}
      <AlertDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open && !signingOut) setPending(null);
        }}
      >
        <AlertDialogContent className="halo-card max-w-[460px] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {switchingToClient ? "Switch to client login?" : "Switch to bookkeeper login?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="leading-relaxed">
              {switchingToClient
                ? "You're currently signed in as a bookkeeper. Continuing will sign you out of the practice session before opening the client login."
                : "You're currently signed in to the client portal. Continuing will sign you out of that session before opening the bookkeeper login."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={signingOut}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void confirm();
              }}
              disabled={signingOut}
            >
              {signingOut ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Signing out…
                </span>
              ) : (
                "Sign out & continue"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </LoginNavContext.Provider>
  );
};

export const useLoginNav = () => useContext(LoginNavContext);

interface LoginLinkProps {
  role: LoginRole;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}

/** Anchor-styled trigger that routes through the cross-role confirmation flow. */
export const LoginLink = ({ role, className = "", children, ...rest }: LoginLinkProps) => {
  const { requestLogin } = useLoginNav();
  return (
    <button type="button" onClick={() => requestLogin(role)} className={className} {...rest}>
      {children}
    </button>
  );
};
