"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "../../lib/supabase/client";

export default function AppHomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      try {
        const supabase = getSupabaseBrowserClient();
        const {
          data: { session }
        } = await supabase.auth.getSession();

        if (!session) {
          router.replace("/login");
          return;
        }

        if (isMounted) {
          setEmail(session.user.email || "");
        }
      } catch {
        router.replace("/login");
        return;
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (isLoading) {
    return (
      <main className="shell">
        <section className="card">
          <p className="eyebrow">Block Market</p>
          <h1 className="title">Loading your session.</h1>
        </section>
      </main>
    );
  }

  return (
    <main className="shell">
      <section className="card card--wide">
        <div className="row">
          <div>
            <p className="eyebrow">Signed In</p>
            <h1 className="title">Block Market</h1>
          </div>

          <button className="button" type="button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>

        <p className="lead">
          Session active for <strong>{email}</strong>. This is the protected app
          shell; buyer and seller flows can now be built behind the CMU email
          gate.
        </p>

        <div className="grid">
          <section className="panel">
            <h2>Buyer side</h2>
            <p>
              Grubhub-style request flow with restaurant search, item entry, and
              visible market pricing.
            </p>
          </section>

          <section className="panel">
            <h2>Seller side</h2>
            <p>
              Uber Eats-style queue of available requests, payout preview after
              fees, and proof-of-purchase submission.
            </p>
          </section>

          <section className="panel">
            <h2>Identity model</h2>
            <p>
              Access currently means control of a <code>cmu.edu</code> inbox.
              Stronger school verification can be layered in later with SSO or a
              directory-backed check.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
