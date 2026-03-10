"use client";

import { useState } from "react";
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
        `Check ${normalizedEmail} for your secure sign-in link. Opening it confirms that you control that CMU inbox.`
      );
      setEmail(normalizedEmail);
    } catch (submissionError) {
      console.error("Supabase login error", submissionError);
      setError("We could not send your login link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="shell">
      <section className="card">
        <p className="eyebrow">Verified CMU Access</p>
        <h1 className="title">Trusted purchases start with a CMU email.</h1>
        <p className="lead">
          Block Market is built for the Carnegie Mellon community. We verify
          every account through a <strong>cmu.edu</strong> inbox so buyers and
          sellers can make purchases inside a more trusted campus network.
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
            {isLoading ? "Sending link..." : "Send secure login link"}
          </button>
        </form>

        <p className="meta">
          CMU email verification helps reduce scams, raise accountability, and
          make every purchase feel more trustworthy for both sides of the
          marketplace.
        </p>

        <p className="meta">
          Access is limited to people who can open a valid <code>cmu.edu</code>{" "}
          inbox and complete the login link.
        </p>
      </section>
    </main>
  );
}
