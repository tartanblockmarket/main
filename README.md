# Block Market

Minimal Next.js starter for the Block Market website.

## Current Scope

The first implemented feature is a CMU-only login flow:

- `app/login/page.js` blocks any email that does not end in `cmu.edu`
- Supabase sends a magic link to matching addresses
- `app/auth/callback/page.js` exchanges the auth code for a session
- signed-in users land in a protected placeholder app shell at `app/app/page.js`

This verifies mailbox control, not enrollment status.

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` from `.env.local.example` and fill in:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   NEXT_PUBLIC_ALLOW_ANY_EMAIL=false
   ```

   `.env.example` is intentionally value-free and exists only to explain the
   repo policy.

3. Start the app:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000/login`

## CMU Email Verification

The login form normalizes the email to lowercase and only allows addresses
whose domain is exactly `cmu.edu` or ends with `.cmu.edu`.

That accepts addresses such as:

- `student@cmu.edu`
- `student@andrew.cmu.edu`

If the email does not match and `NEXT_PUBLIC_ALLOW_ANY_EMAIL !== "true"`, the
form stops before Supabase is called and shows:

```txt
Please use a CMU email ending in cmu.edu.
```

After the domain check passes, the app sends a magic link with:

```js
await supabase.auth.signInWithOtp({
  email: normalizedEmail,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`
  }
});
```

Then the callback page completes sign-in with:

```js
await supabase.auth.exchangeCodeForSession(code);
```

## Product Notes

Block Market connects buyers who want food ordered with blocks and sellers who
are willing to use their blocks to place those orders for a fee.

### Buyer Experience

- The buyer UI should feel similar to Grubhub.
- Buyers enter the restaurant and what they want to order.
- Buyers should be able to see the prices other people are paying, without
  seeing the rest of the order details.

### Seller Experience

- The seller UI should feel more like Uber Eats.
- Sellers see available buyer requests and choose which ones they want to
  fulfill.

### Fees

- Take a $0.05 fee from the seller side.
- Example: if a buyer offers $7.00 for a block order, the seller sees that they
  will receive $6.95.
