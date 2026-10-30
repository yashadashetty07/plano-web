import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { missingSupabaseConfig, supabase } from "../lib/supabase";
import { AuthContext, type AuthState } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(!missingSupabaseConfig);
  const [error, setError] = useState<string | null>(
    missingSupabaseConfig ? "Add the browser-safe Supabase URL and publishable key to .env.local." : null,
  );

  useEffect(() => {
    if (!supabase) return;

    let active = true;
    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;
      setSession(data.session);
      setError(sessionError ? `Could not restore your session: ${sessionError.message}` : null);
      setLoading(false);
    }).catch((reason: unknown) => {
      if (!active) return;
      setError(reason instanceof Error ? `Could not restore your session: ${reason.message}` : "Could not restore your session.");
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
      setError(null);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthState>(() => ({
    session,
    loading,
    error,
    signInWithGoogle: async () => {
      if (!supabase) throw new Error("Supabase is not configured.");
      setError(null);
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (authError) throw authError;
    },
    signOut: async () => {
      if (!supabase) return;
      const { error: authError } = await supabase.auth.signOut();
      if (authError) throw authError;
    },
  }), [session, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
