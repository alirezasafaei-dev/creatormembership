# 03 Release Runbook

## Pre-Release
1. Validate deploy readiness (env + release checks):
   - `pnpm -w deploy:prepare`
2. Run full quality gates.
3. Confirm roadmap/task/docs sync.
4. Review schema-impact and rollback path.

## Release Verification
1. API health: `/health`, `/api/v1/health/db`
2. Auth + checkout + callback smoke
3. Admin ops summary reachable for authorized role
4. Production phase automations:
   - `DATABASE_URL=... PAYMENT_GATEWAY_WEBHOOK_SECRET=... pnpm -w production:phase-a`
   - `DATABASE_URL=... pnpm -w production:phase-b`
5. Generate go/no-go evidence bundle:
   - `pnpm -w release:go-no-go:evidence`

## Rollback
- revert deployment artifact
- restore DB backup if schema/data corruption risk exists
- rerun smoke to confirm service stability
