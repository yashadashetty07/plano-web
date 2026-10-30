# Plano Web

Plano is a responsive productivity and personal finance application. This repository contains the fresh React implementation; the existing Flutter repository is reference-only.

## Current state

The local foundation contains React, TypeScript, Vite, Tailwind CSS, a Google-only Supabase Auth entry point, and guarded CI/deployment workflow templates. It is not yet a complete product. No Supabase migration, Edge Function deployment, public preview, production deployment, or remote Git push has been performed.

The GitHub repository currently exists as a public, empty repository. Review its visibility before approving the first push. See [implementation status](IMPLEMENTATION_STATUS.md).

## Local setup

Requirements: Node.js 24.22.1 and pnpm 11.25.0.

1. Copy `.env.example` to `.env.local`.
2. Fill in the existing Supabase project URL and publishable key. These are browser-visible values; never put service-role or Groq keys in `VITE_*` variables.
3. Install dependencies with `pnpm install` after package registry access is available.
4. Start the development server with `pnpm dev`.

Google sign-in redirects to `/auth/callback`. Supabase Auth must allow the exact local redirect URL before sign-in can complete. No OAuth setting has been changed by this setup.

## Project documents

- [Agent guidance](AGENTS.md)
- [Decisions](DECISIONS.md)
- [Implementation status](IMPLEMENTATION_STATUS.md)
- [Operations runbook](RUNBOOK.md)
- [Architecture and ERD](docs/architecture.md)
- [Database and finance design](docs/database.md)
- [Security model](docs/security.md)
- [Deployment workflows](docs/deployment.md)
