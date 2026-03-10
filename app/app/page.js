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
          Signed in as <strong>{email}</strong>. This verified CMU access is the
          trust layer for Block Market, helping buyers and sellers feel safer
          about every order placed through the platform.
        </p>

        <div className="grid">
          <section className="panel">
            <h2>Buyer confidence</h2>
            <p>
              Buyers can request food knowing the marketplace is limited to
              verified CMU email holders rather than anonymous accounts.
            </p>
          </section>

          <section className="panel">
            <h2>Seller trust</h2>
            <p>
              Sellers get more confidence that requests come from real members
              of the campus community before they spend blocks on an order.
            </p>
          </section>

          <section className="panel">
            <h2>Verification model</h2>
            <p>
              Right now, trust starts with proving control of a valid{" "}
              <code>cmu.edu</code> inbox. Stronger school verification can be
              layered in later if needed.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
