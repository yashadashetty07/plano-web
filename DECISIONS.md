# Plano Web decisions

## Confirmed

- Product name: Plano.
- New application: React + TypeScript + Vite; the old Flutter repository remains reference-only.
- UI: Tailwind CSS, shadcn/ui, Lucide icons, Recharts.
- Routing and server state: React Router and TanStack Query.
- Auth/data/backend: existing Supabase project, PostgreSQL, Google OAuth, RLS, and Edge Functions.
- AI: Groq called server-side from Supabase Edge Functions; no n8n or browser-side AI.
- Hosting and CI/CD: Cloudflare Pages and GitHub Actions with separate frontend CI, preview, production, and Supabase operation workflows.
- Repository: use the already-created `yashadashetty07/plano-web`; it is currently public and empty. No repository creation is planned.
- Ownership: individual user ownership remains the RLS boundary. Existing workspaces are retained as optional grouping; membership alone does not grant access.
- Finance: numeric amounts, explicit currency, transaction event types, recurring occurrence keys, refund references, separate investment transactions and valuation snapshots.
- Existing Supabase tables and data are to be preserved. Migrations remain additive and require approval before application.

## Current implementation choices

- Node.js 24.22.1, pnpm 11.25.0, React 19.3, Vite 8, and Tailwind CSS 4 are the initial compatibility targets based on current official release guidance.
- Supabase browser configuration uses only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
- OAuth uses Google through Supabase Auth and PKCE. Redirect allowlists still require verification.
- Cloudflare Pages deployment uses Wrangler from GitHub Actions. All deploy workflows are manual and environment-protected; no push trigger deploys a preview or production site.
- Supabase workflow is manual, target-bound to the existing project ref, and separates migration preview, migration apply, and one-function deployment.

## Not yet verified

- Dependency versions and lockfile: package registry DNS was unavailable during setup, so dependencies have not been resolved.
- Google callback registration and Supabase URL allowlist: requires dashboard/Google Console verification.
- Groq secret name availability: owner reports the key is configured; current integration cannot list secret names. Existing `assistant_action` source references n8n variables, not Groq.
- GitHub environment protection and repository visibility decision before first push.
- Cloudflare Pages project and credentials; none were created.
