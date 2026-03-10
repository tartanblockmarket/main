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

    async function exchangeCode() {
      const code = new URLSearchParams(window.location.search).get("code");

      if (!code) {
        if (isMounted) {
          setError("The login link is missing its auth code.");
        }
        return;
      }

      try {
        const supabase = getSupabaseBrowserClient();
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          throw exchangeError;
        }

        if (isMounted) {
          setMessage("Login verified. Redirecting into Block Market...");
        }

        router.replace("/app");
      } catch (callbackError) {
        if (isMounted) {
          setError(
            callbackError.message ||
              "We could not verify that login link. Try requesting a new one."
          );
        }
      }
    }

    exchangeCode();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <main className="shell">
      <section className="card">
        <p className="eyebrow">Auth Callback</p>
        <h1 className="title">Checking your CMU login.</h1>
        <p className="lead">
          Supabase is exchanging the magic-link auth code for a real session.
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
