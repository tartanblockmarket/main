"use client";

import { useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "../../lib/supabase/client";

const CMU_EMAIL_SUFFIX = "cmu.edu";

function isAllowedEmail(email) {
  if (process.env.NEXT_PUBLIC_ALLOW_ANY_EMAIL === "true") {
    return true;
  }

  const [, domain = ""] = email.split("@");

  return domain === CMU_EMAIL_SUFFIX || domain.endsWith(`.${CMU_EMAIL_SUFFIX}`);
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Enter your email to continue.");
      return;
    }

    if (!isAllowedEmail(normalizedEmail)) {
      setError("Please use a CMU email ending in cmu.edu.");
      return;
    }

    try {
      setIsLoading(true);

      const supabase = getSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (authError) {
        throw authError;
      }

      setSuccess(
        `Magic link sent to ${normalizedEmail}. Open that inbox and click the link to continue.`
      );
      setEmail(normalizedEmail);
    } catch (submissionError) {
      setError(
        submissionError.message ||
          "We could not start the login flow. Check your Supabase config and try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="shell">
      <section className="card">
        <p className="eyebrow">CMU Access Required</p>
        <h1 className="title">Log in with your CMU email.</h1>
        <p className="lead">
          Block Market currently allows sign-in only for mailboxes ending in{" "}
          <strong>cmu.edu</strong>. After the domain check passes, Supabase
          sends a magic link and you finish sign-in from that inbox.
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <label className="label" htmlFor="email">
            CMU email
            <input
              id="email"
              className="input"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@andrew.cmu.edu"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isLoading}
            />
          </label>

          {error ? <div className="message message--error">{error}</div> : null}
          {success ? (
            <div className="message message--success">{success}</div>
          ) : null}

          <button className="button" type="submit" disabled={isLoading}>
            {isLoading ? "Sending link..." : "Send magic link"}
          </button>
        </form>

        <p className="meta">
          This verifies mailbox ownership, not enrollment status. Anyone who can
          receive and click a magic link sent to a valid <code>cmu.edu</code>{" "}
          address can sign in.
        </p>

        <p className="meta">
          Need to wire up Supabase first? Copy <code>.env.example</code> into a
          local <code>.env.local</code> and fill in the public URL and anon key.
        </p>

        <p className="meta">
          After login, users land in the early app shell at{" "}
          <Link className="link" href="/app">
            /app
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
