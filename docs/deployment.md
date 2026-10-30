# Deployment design

## Workflow separation

### Frontend CI — `.github/workflows/frontend-ci.yml`

Runs on pull requests to `main` and pushes to `main`. Installs from the pnpm lockfile, then runs lint, TypeScript, unit tests and a production build. It has read-only repository permission and no production secrets.

### Preview deployment — `.github/workflows/preview-deploy.yml`

Manual dispatch from a non-main branch. It builds and uploads `dist/` to a Pages preview branch through Wrangler. The `cloudflare-preview` GitHub Environment must require owner review before public preview publication. No automatic preview is triggered by a push.

### Production deployment — `.github/workflows/production-deploy.yml`

Manual dispatch from `main` only. It reruns quality checks, then deploys `dist/` to the `main` Pages branch. The `cloudflare-production` environment must require owner approval. It is not configured to deploy on every push.

### Supabase operations — `.github/workflows/supabase-controlled.yml`

Manual dispatch from `main` with one selected operation: migration dry-run, migration apply, or deployment of one named Edge Function. Production writes require the exact project-ref confirmation and the `supabase-production` environment. A workflow run is not a substitute for the owner's G2/G7 approval.

## Required protected environment values

Configure only after the applicable approval:

- Cloudflare environments: `CLOUDFLARE_ACCOUNT_ID` variable and scoped `CLOUDFLARE_API_TOKEN` secret.
- Supabase environment: `SUPABASE_ACCESS_TOKEN` and `SUPABASE_DB_PASSWORD` secrets; the project ref is fixed in the workflow.
- Groq remains in Supabase project secrets, never GitHub or frontend variables.

The Cloudflare Pages project and GitHub environment protections do not yet exist. Workflows are templates and have not been run. Cloudflare's current direct-upload guidance uses Wrangler in GitHub Actions; this avoids a competing Git-based Pages deployment trigger. [Cloudflare Pages CI deployment guide](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/).

## Rollback

- Frontend rollback: choose a previously successful Pages deployment and redeploy it, then run smoke checks for page load and auth routing.
- Supabase migration recovery: review the exact SQL and backup/restore options before application. Prefer a corrective forward migration. Do not assume an inverse migration can safely restore data.
- Never combine production schema changes and frontend publication into one automatic push-triggered workflow.
