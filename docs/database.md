# Database reuse and migration plan

## Discovery baseline

Supabase project `plano` (`hhpuedvauylgcwdpphjg`) is active and healthy in the existing Free organization. Two migrations are recorded. The inspected public schema contains twelve tables, all with RLS enabled; the current application-table counts are zero. Existing tables and policies must be preserved and reviewed before modification.

The project has an active `assistant_action` Edge Function with JWT verification. Its current assistant path calls n8n and reads n8n secret names; this behavior is out of scope for the new React application. No storage buckets were found.

## Existing tables

| Table | Role |
|---|---|
| `profiles` | User preferences/profile |
| `workspaces`, `workspace_members` | Workspace metadata and membership |
| `projects`, `tasks`, `activity_logs` | Productivity |
| `habits`, `habit_checkins` | Recurring behavior |
| `learning_sessions` | Learning/activity records |
| `health_summaries`, `integration_connections` | Existing reference resources, not in initial web scope |
| `assistant_audit_logs` | Existing assistant audit metadata |

## Ownership model

Continue to use per-user ownership and `auth.uid()` as the access boundary. Keep optional workspace grouping and existing membership tables, but membership is not an authorization grant in the initial product. Every new table will have RLS and user ownership. Any foreign keys to another user-owned row must verify matching ownership. Avoid trusting `user_id` from browser payloads or model output.

## Additive migration families

1. Finance categories and manual accounts, with account classes for cash, bank, credit-card liability, loan liability, investment, and other asset.
2. Financial transaction events for income, expense, transfer, card repayment, refund, and linked investment funding. Use positive `numeric` source and destination amounts with explicit currency codes (separately stored for cross-currency transfers), optional applied rate/source/as-of time, occurrence date/time, timezone, idempotency key, and source/destination constraints.
3. Recurring rules and occurrence rows, unique by rule and occurrence key, with statuses for due, posted, skipped, and cancelled.
4. Budgets, salary plans and allocation lines, financial calendar events.
5. Assets/liabilities, dated net-worth snapshots and snapshot items.
6. Goals and goal contributions.
7. Investment accounts, holdings, contributions/distributions/fees/disposals, and manual valuation snapshots. A contribution may reference one unique funding transaction; exclude linked funding movements from expense aggregates.
8. AI idempotency and audit metadata, reusing or safely extending the existing audit design after inspection.

## Financial invariants

- Transfers and credit-card repayments never count as income or expense.
- Credit-card purchases count once as expenses; repayments settle the liability.
- Refunds reference the original charge, support partial amounts, and reduce net category spend; enforce cumulatively that refunds do not exceed the original charge.
- A recurring occurrence key prevents duplicate posting after retries or repeated scheduler runs.
- Investment contributions are cash allocation, not performance. Valuations are dated user-entered estimates; returns are derived from actual cash flows and valuations.
- Currency totals remain separated unless an explicit rate, source, and as-of date are provided.
- Date-only obligations use `date`; event instants use `timestamptz` with the user's timezone stored for interpretation.

No migration has been created or applied. Before writing migration files, inspect the original SQL in both deployed migrations, verify constraints/indexes/policies/functions, and decide how to represent deployed migration history locally. Apply nothing to the remote project before G2 approval.
