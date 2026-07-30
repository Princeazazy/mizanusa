import { supabase } from "@/integrations/supabase/client";

const STAY_KEY = "mizan.stay_signed_in";
const TAB_KEY = "mizan.tab_alive";

/** Record the user's "stay signed in" choice at sign-in time. */
export const setStaySignedIn = (stay: boolean) => {
  try {
    localStorage.setItem(STAY_KEY, stay ? "1" : "0");
    sessionStorage.setItem(TAB_KEY, "1");
  } catch {
    /* storage unavailable — fall back to default persistence */
  }
};

/**
 * Called once on app boot. If the user opted out of staying signed in and the
 * browsing session has ended (sessionStorage cleared), drop the stored session.
 */
export const enforceSessionPersistence = async () => {
  try {
    const stay = localStorage.getItem(STAY_KEY);
    const sameSession = sessionStorage.getItem(TAB_KEY);
    if (stay === "0" && !sameSession) {
      await supabase.auth.signOut();
      localStorage.removeItem(STAY_KEY);
    }
    sessionStorage.setItem(TAB_KEY, "1");
  } catch {
    /* no-op */
  }
};
