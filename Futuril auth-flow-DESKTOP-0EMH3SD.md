# Futuril — Authentication Flow

Built on Supabase Auth (Postgres + GoTrue), matching the onboarding options already specified in the PRD: email/password, Google, GitHub, with Apple/Microsoft as future providers.

## 1. Signup (email/password)

```
sequenceDiagram
  participant C as Client
  participant A as API /auth/signup
  participant SA as Supabase Auth
  participant DB as Postgres

  C->>A: POST /auth/signup { email, password, name, education_stage }
  A->>SA: signUp(email, password)
  SA-->>A: user_id + access_token + refresh_token
  A->>DB: insert users, user_profile row
  alt education_stage indicates minor (Grade 10-12, under 18)
    A->>DB: set users.is_minor = true
    A-->>C: 201 + require guardian consent before full access
  else adult learner
    A-->>C: 201 + tokens, proceed to onboarding
  end
```

**Key rule:** `is_minor` is derived server-side from the declared education stage at signup, never trusted from the client alone. It gates Kiki's voice/free-text modes later (see AI Integration Flow doc).

## 2. Login (email/password)

```
sequenceDiagram
  participant C as Client
  participant A as API /auth/login
  participant SA as Supabase Auth

  C->>A: POST /auth/login { email, password }
  A->>SA: signInWithPassword(email, password)
  alt valid credentials
    SA-->>A: access_token (JWT, short-lived) + refresh_token (long-lived)
    A-->>C: 200 + tokens
  else invalid credentials
    SA-->>A: 401
    A-->>C: 401 (generic "invalid email or password" — never reveal which field is wrong)
  end
```

Rate limit: 5 failed attempts per email per 15 minutes at the API layer, independent of whatever Supabase's own throttling does — don't rely on a single layer for brute-force protection.

## 3. OAuth (Google / GitHub)

```
sequenceDiagram
  participant C as Client
  participant A as API
  participant SA as Supabase Auth
  participant P as OAuth Provider

  C->>A: GET /auth/oauth/google
  A->>SA: signInWithOAuth('google')
  SA->>P: redirect to consent screen
  P-->>SA: authorization code
  SA-->>A: exchanges code for access_token + refresh_token, creates/links user
  A-->>C: redirect back to app with session
  Note over A: If no matching users row exists yet, create one and route to onboarding instead of dashboard
```

## 4. Session lifecycle

- **Access token (JWT):** short-lived (~1 hour), sent as `Authorization: Bearer` on every API call.
- **Refresh token:** long-lived, stored client-side (httpOnly cookie on web, secure storage on mobile), used to silently mint new access tokens without re-login.
- **Every API route** validates the JWT signature and expiry before touching the database. **Postgres row-level security (RLS) policies mirror the same `user_id = auth.uid()` check** — this is a second, independent layer, not a substitute for the API check. If either layer is missing, don't ship the route.

## 5. Guardian consent (minors)

```
sequenceDiagram
  participant C as Client
  participant A as API
  participant DB as Postgres

  Note over C,DB: Triggered post-signup when users.is_minor = true
  C->>A: POST /me/guardian-consent { guardian_name, guardian_email }
  A->>DB: insert guardian_consent (consent_given = false)
  A-->>C: consent request email sent to guardian
  Note over A: Product access remains limited (no Kiki voice, no unmoderated chat)<br/>until guardian_consent.consent_given = true
```

This is a placeholder flow to design against — the actual verification mechanism (email link, parent account, etc.) needs a legal/compliance decision before building, not just an engineering one.

## 6. Logout

```
sequenceDiagram
  participant C as Client
  participant A as API /auth/logout
  participant SA as Supabase Auth

  C->>A: POST /auth/logout
  A->>SA: signOut() — invalidates refresh token server-side
  A-->>C: 200, client clears local tokens
```

## 7. Password reset

Standard Supabase flow: `POST /auth/reset-password` with email → magic link → `POST /auth/update-password` with the reset token. No custom logic needed beyond rate-limiting the request endpoint (same 5-per-15-min pattern as login).

## Failure modes to design for up front

| Scenario | Handling |
|---|---|
| Expired access token mid-session | API returns 401 with `code: token_expired`; client silently refreshes and retries once before showing a login prompt |
| Refresh token revoked/expired | Force full re-login, clear local state |
| OAuth email already exists as email/password account | Prompt to link accounts rather than silently creating a duplicate `users` row |
| Guardian consent never completes | Time-box it — after N days, restrict to read-only onboarding state rather than leaving access ambiguous |
