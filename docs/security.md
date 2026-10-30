# Security model

## Browser and session

- Google OAuth only through Supabase Auth; no custom password login/signup.
- Use the publishable Supabase key only in the browser. RLS remains mandatory.
- Auth redirects must be exact allowlisted origins for local, preview and production. The expected Google provider callback is the Supabase project callback, distinct from app redirect URLs.
- Handle sign-in errors, restored sessions, expired sessions, sign-out, and missing configuration without exposing tokens.

## Database

- Enable RLS on every exposed user-owned table.
- Scope policies to `authenticated` and match `auth.uid()` to owner identity. Updates require both matching `USING` and `WITH CHECK` predicates.
- Foreign-key relationships between owned rows must prevent cross-user linking.
- Workspace membership alone does not bypass individual ownership.
- Protect views and functions against RLS bypass; prefer invoker security and explicit grants.
- Test select/insert/update/delete isolation for two users across every owned table.

## Edge Functions and Groq

- Verify the Supabase user token and derive identity server-side.
- Validate HTTP method, payload size, schema, enum values, dates, numeric bounds, account/category ownership, rate limits and allowed origins.
- Query minimal user-authorized context. Never send full transaction history by default.
- Treat model output and user notes as untrusted. Use validated structured output and fixed operation allowlists; never execute generated SQL.
- Require explicit confirmation for destructive, bulk, or financially consequential actions.
- Use idempotency and verify database writes before reporting success.
- Keep `GROQ_API_KEY` only in Supabase Edge Function secrets. The configured key's existence/name still needs a names-only check; never return its value.

## Workflow and repository

- CI receives no production secrets.
- Deployment uses protected GitHub Environments and manual dispatch.
- Supabase migration preview/apply/function deploy are separate operations and point only to the existing project ref.
- The repository is public. Do not commit secrets, `.env.local`, generated bundles with secret values, user data, or production exports.
- Public preview, production deployment, OAuth changes, secrets, migrations/RLS changes and paid resources each require their own owner approval.
