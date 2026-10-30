# Plano Web runbook

## Local development

1. Install Node.js 24.22.1 and pnpm 11.25.0.
2. Copy `.env.example` to `.env.local` and add only the Supabase project URL and publishable key.
3. Run `pnpm install` once registry access is available.
4. Use `pnpm dev` for local development. Use `pnpm lint`, `pnpm typecheck`, `pnpm test -- --run`, and `pnpm build` for checks.

## OAuth values to verify

- Google Authorized redirect URI: `https://hhpuedvauylgcwdpphjg.supabase.co/auth/v1/callback`.
- Supabase Site URL: exact production origin after Pages project creation.
- Supabase allowed redirect URLs: exact local callback (`http://localhost:5173/auth/callback`), approved preview callback, and production callback. Avoid wildcard entries.
- The Google provider and OAuth credentials are already configured per owner; do not recreate or change them without G3 approval.

## GitHub controls

- The remote repository already exists and is public. Review visibility before first code push.
- Configure protected GitHub Environments: `cloudflare-preview`, `cloudflare-production`, and `supabase-production`, with required reviewers before publishing/production operations.
- Do not push before G1 approval. Do not add secrets before G4 approval.

## Cloudflare Pages

- No Pages project exists yet. Create/configure it only after G6/G9 approvals as applicable.
- Workflows use a project named `plano-web` and Wrangler direct uploads. Configure `CLOUDFLARE_ACCOUNT_ID` as an environment variable and `CLOUDFLARE_API_TOKEN` as an environment secret after approval.
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` as environment variables on each Cloudflare GitHub Environment; these are browser-visible public configuration values. Workflows fail before building when missing. Preview and production are separate manually confirmed workflows and separate protected environments.

## Supabase protected operations

- Target project ref: `hhpuedvauylgcwdpphjg`.
- The workflow requires `SUPABASE_ACCESS_TOKEN` and `SUPABASE_DB_PASSWORD` as protected environment secrets. Do not place their values in files or chat. A write operation also requires its operation-specific confirmation input and exact project ref.
- Run the migration dry-run and review its output before any production apply. A production migration requires G2 approval for that specific migration.
- Deploy one explicitly named Edge Function only after its code review and applicable production approval. Do not run the workflow as a substitute for owner approval.
- Groq is read by the server function from a project-level Edge Function secret using `Deno.env.get("GROQ_API_KEY")`; verify presence without displaying the value before live AI is enabled.

## Rollback and recovery

- Frontend: use the Cloudflare Pages deployment history to redeploy the last known-good deployment. Verify the site and sign-in afterward.
- Supabase: do not assume migrations are reversible. Prefer reviewed additive forward-fixes. Before an approved migration, capture the migration diff and confirm the project backup/restore options and current retention. Recovery that restores or rewrites production data requires explicit approval.
- OAuth: preserve existing values and export/record current redirect configuration before any approved change.
- Secrets: never log or paste values. Rotate only after approval and verify the consumer without returning the value.
