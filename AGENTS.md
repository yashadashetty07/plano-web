# Plano Web agent guidance

## Product and stack

- Build a web-only React + TypeScript application with Vite.
- Use Tailwind CSS, shadcn/ui, Lucide, Recharts, React Router, TanStack Query, Supabase Auth/PostgreSQL/Edge Functions, and server-side Groq.
- Do not add Flutter, Android, n8n, custom password authentication, client-side AI calls, bank synchronization, brokerage execution, or payment initiation.
- Tasks are intended work; activities are completed work; habits are recurring behavior.

## Security and data

- Every user-owned row must be protected by RLS and tied to verified `auth.uid()` identity.
- Keep the current workspace tables and relationships. Workspaces group records but do not grant team access in the initial product.
- Use `numeric` for money and explicit currency codes. Do not combine currencies without a dated conversion rate.
- Do not trust browser or model `user_id` values. Derive ownership from verified JWT claims.
- Keep Groq and Supabase secret credentials server-side. Never place secrets in a browser variable, build output, source map, Git, or log.
- AI uses allowlisted operations, validated schemas, idempotency, minimal context, confirmation for consequential mutations, and verified writes. Never execute model-generated SQL.
- Do not count transfers or card repayments as expenses. Keep refunds linked to original transactions. Keep investment contributions distinct from valuations and returns.

## Approval gates

- Local changes are allowed after G0. Never push or publish code until G1 approval.
- Do not apply migrations or change production RLS before G2 approval.
- Do not change Google OAuth configuration before G3 approval.
- Do not add or rotate secrets before G4 approval.
- Do not enable live AI with user data before G5 approval.
- Do not publish a preview before G6 approval.
- Do not deploy production before G7 approval.
- Do not add financial integrations, incur paid costs, or perform destructive actions without their respective approvals.
- The existing `plano` Flutter repository must remain untouched.

## Workflow discipline

- Make small, reviewable changes and keep documentation current.
- Do not claim tests, builds, integration checks, or deployments passed unless they were actually run and passed.
- Keep the project within the user's 70% Codex usage ceiling. The platform currently exposes no reliable allowance meter; be conservative and avoid parallel agents or repeated broad scans.
- Before Supabase implementation, consult current official Supabase documentation and inspect the existing production schema again. Never use production as a test sandbox.
