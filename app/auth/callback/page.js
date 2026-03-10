"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "../../../lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Verifying your login link...");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabaseBrowserClient();

    function redirectToApp() {
      if (isMounted) {
        setMessage("Login verified. Redirecting into Block Market...");
      }

      router.replace("/app");
    }

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        redirectToApp();
      }
    });

    async function resolveSession() {
      try {
        const {
          data: { session }
        } = await supabase.auth.getSession();

        if (session) {
          redirectToApp();
          return;
        }

        const code = new URLSearchParams(window.location.search).get("code");

        if (!code) {
          window.setTimeout(async () => {
            const {
              data: { session: delayedSession }
            } = await supabase.auth.getSession();

            if (delayedSession) {
              redirectToApp();
              return;
            }

            if (isMounted) {
              setError("We could not verify that login link. Try requesting a new one.");
            }
          }, 1200);

          return;
        }

        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          throw exchangeError;
        }

        redirectToApp();
      } catch (callbackError) {
        console.error("Supabase callback error", callbackError);

        if (isMounted) {
          setError("We could not verify that login link. Try requesting a new one.");
        }
      }
    }

    resolveSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <main className="shell">
      <section className="card">
        <p className="eyebrow">Verifying Access</p>
        <h1 className="title">Checking your CMU login.</h1>
        <p className="lead">
          We&apos;re confirming your email so Block Market stays inside a more
          trusted campus network.
        </p>

        {error ? (
          <div className="message message--error">{error}</div>
        ) : (
          <div className="message message--success">{message}</div>
        )}
      </section>
    </main>
  );
}
