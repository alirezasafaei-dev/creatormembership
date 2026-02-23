# asdev-creator-membership-ir

Local-first creator membership platform with governance-first delivery.

## Current Status (Verified)
As of 2026-02-20:
- Quality gates are green: `docs:validate`, `lint`, `typecheck`, `local-first:scan`, `test`, `build`, `test:integration`, `test:e2e`
- Core flow is verified with smoke suite:
  - `signup -> creator -> plan -> checkout -> callback -> ACTIVE subscription`
- Adapter callback signature, RBAC admin policy, and content tokenized download are verified via smoke tests.
- Phased backlog is tracked without timeline and auto-synced from roadmap.

See:
- `docs/PROJECT_STATUS.md`
- `docs/ROADMAP_PHASED.md`

## Quick Start (Local)
Prereqs:
- Node.js 20+
- `pnpm`
- PostgreSQL (local or remote)

Install:
- `pnpm install`

Run API:
- set `DATABASE_URL` (see `.env.example` or `apps/api/.env.example`)
- `pnpm api:dev`

Run Web:
- `pnpm dev`

No Docker requirement:
- `DATABASE_URL=... pnpm -w local:stack:start`
- `pnpm -w local:stack:status`
- `pnpm -w local:stack:stop`
- Optional host reverse proxy (nginx installed locally):
- `pnpm -w local:proxy:start`
- `pnpm -w local:proxy:status`
- `pnpm -w local:proxy:stop`
- Full local automation (stack + proxy + seed + evidence):
- `pnpm -w run:local:full`

Quality gates:
- `pnpm -w docs:validate && pnpm -w lint && pnpm -w typecheck && pnpm -w local-first:scan && pnpm -w test && pnpm -w build`

Smoke test (mock payment):
- requires `DATABASE_URL`
- `pnpm -w smoke:mock-payment`

## Documentation Sync (2026-02-23)

Summary (FA): این ریپو یک پلتفرم عضویت با معماری local-first و زنجیرهٔ governance/release خودکار است.

### 1) Overview
Monorepo for creator membership platform with web, API, worker, and phased release automation.

### 2) Stack & Architecture
- pnpm workspace monorepo (`pnpm-workspace.yaml`)
- `apps/web`: Next.js + React + TypeScript
- `apps/api`: Fastify + TypeScript
- PostgreSQL-backed flows with `DATABASE_URL`
- Automated release, smoke, and governance scripts from root `package.json`

### 3) Prerequisites
- Node.js
- pnpm `9.12.0`
- PostgreSQL accessible for API and smoke flows

### 4) Install & Run
```bash
pnpm install
pnpm api:dev
pnpm dev
```
Local-first stack and proxy:
```bash
pnpm local:stack:start
pnpm local:proxy:start
pnpm run:local:full
```

### 5) Tests & Quality
```bash
pnpm docs:validate
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm test:e2e
pnpm local-first:scan
pnpm security:scan
```

### 6) Config & Env
From `.env.example` and `apps/api/.env.example`:
- `ADMIN_API_KEY`, `CONTENT_STORAGE_ROOT`, `CORS_ALLOW_ORIGINS`, `CSRF_ENABLED`
- `DATABASE_URL`, `HOST`, `PORT`, `WEB_PORT`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `SESSION_SECRET`
- `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`
- `PAYMENT_GATEWAY`, `PAYMENT_GATEWAY_BASE_URL`, `PAYMENT_GATEWAY_TIMEOUT_MS`, `PAYMENT_GATEWAY_WEBHOOK_SECRET`
- `PUBLIC_BASE_URL`

### 7) Deploy/Operations
- Production phased scripts: `production:phase-a` ... `production:phase-g`
- Release controls: `release:rc:gates`, `release:go-no-go:evidence`, `release:deploy:dry-run`, `release:rollback:validate`
- Runtime health report: `pnpm runtime:health:report`
- API health evidence in reports references `GET /api/v1/health/db`

### 8) Links
- Repo: https://github.com/alirezasafaeisystems/asdev-creator-membership-ir
- Issues: https://github.com/alirezasafaeisystems/asdev-creator-membership-ir/issues
- Discussions: https://github.com/alirezasafaeisystems/asdev-creator-membership-ir/discussions

### 9) Status & Compatibility
- Last documentation sync: 2026-02-23
- Base sync snapshot: `main`, `dirty`, `ahead 1`, `behind 0`
