import { useState, useEffect, useCallback } from "react";

interface ClientSession {
  sessionToken: string;
  clientId: string;
  clientName: string;
  expiresAt: string;
}

const STORAGE_KEY = "client_session";

export const useClientAuth = () => {
  const [session, setSession] = useState<ClientSession | null>(null);
  const [loading, setLoading] = useState(true);

  const validateSession = useCallback(async (sessionToken: string): Promise<ClientSession | null> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/client-auth`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "validate", sessionToken }),
        }
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      if (data.valid) {
        return {
          sessionToken,
          clientId: data.clientId,
          clientName: data.clientName,
          expiresAt: data.expiresAt,
        };
      }
      return null;
    } catch (error) {
      console.error("Session validation error:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const storedSession = localStorage.getItem(STORAGE_KEY);
      if (storedSession) {
        try {
          const parsed = JSON.parse(storedSession) as ClientSession;
          const validSession = await validateSession(parsed.sessionToken);
          if (validSession) {
            setSession(validSession);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      setLoading(false);
    };

    checkSession();
  }, [validateSession]);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/client-auth`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "login", username, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || "Login failed" };
      }

      const newSession: ClientSession = {
        sessionToken: data.sessionToken,
        clientId: data.clientId,
        clientName: data.clientName,
        expiresAt: data.expiresAt,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
      setSession(newSession);

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Connection error. Please try again." };
    }
  };

  const logout = async () => {
    if (session?.sessionToken) {
      try {
        await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/client-auth`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "logout", sessionToken: session.sessionToken }),
          }
        );
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  };

  return {
    session,
    loading,
    isAuthenticated: !!session,
    clientId: session?.clientId,
    clientName: session?.clientName,
    login,
    logout,
  };
};
