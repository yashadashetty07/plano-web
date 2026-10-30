import { useState } from "react";
import { ArrowRight, CircleAlert, PanelsTopLeft } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useAuth } from "./auth-context";

export function App() {
  const { session, loading, error, signInWithGoogle, signOut } = useAuth();
  const location = useLocation();
  const [signInError, setSignInError] = useState<string | null>(null);

  if (loading) {
    return <main className="center-screen" aria-live="polite">Checking your Plano session…</main>;
  }

  if (session) {
    if (location.pathname === "/login" || location.pathname === "/") {
      return <Navigate to="/app" replace />;
    }
    if (location.pathname === "/auth/callback") {
      return <Navigate to="/app" replace />;
    }
    return (
      <main className="center-screen">
        <section className="welcome-card" aria-labelledby="welcome-title">
          <div className="brand-mark"><PanelsTopLeft size={22} aria-hidden="true" /></div>
          <p className="eyebrow">Your private workspace</p>
          <h1 id="welcome-title">Welcome to Plano</h1>
          <p className="muted">Your account is connected. The application foundation is ready for the approved productivity and finance modules.</p>
          <div className="account-row">
            <span className="status-dot" aria-hidden="true" />
            <span>Signed in as {session.user.email ?? "your Google account"}</span>
          </div>
          <button className="text-button" onClick={() => {
            void signOut().catch((reason: unknown) => {
              setSignInError(reason instanceof Error ? reason.message : "Could not sign out.");
            });
          }} type="button">
            Sign out
          </button>
          {signInError && <p className="inline-error" role="alert"><CircleAlert size={16} />{signInError}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="center-screen">
      <section className="welcome-card" aria-labelledby="welcome-title">
        <div className="brand-mark"><PanelsTopLeft size={22} aria-hidden="true" /></div>
        <p className="eyebrow">A calmer way to plan</p>
        <h1 id="welcome-title">Make room for what matters.</h1>
        <p className="muted">Bring your work, habits and finances into one thoughtful workspace.</p>
        {error && <p className="inline-error" role="alert"><CircleAlert size={16} />{error}</p>}
        {signInError && <p className="inline-error" role="alert"><CircleAlert size={16} />{signInError}</p>}
        <Button
          className="primary-button"
          disabled={!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)}
          onClick={() => {
            setSignInError(null);
            void signInWithGoogle().catch((reason: unknown) => {
              setSignInError(reason instanceof Error ? reason.message : "Google sign-in could not start.");
            });
          }}
          type="button"
        >
          Continue with Google <ArrowRight size={17} aria-hidden="true" />
        </Button>
        <p className="fine-print">Sign in securely through Google and Supabase Auth.</p>
      </section>
    </main>
  );
}
