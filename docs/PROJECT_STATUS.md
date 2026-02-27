# Project Status (Reality Check)

Last verified: 2026-02-27

## Reality Metrics (2026-02-27)
- Core roadmap checklist (`tasks/NEXT.md`): `40/40` done (`100%`).
- Production roadmap checklist (`tasks/NEXT_PRODUCTION.md`): `23/50` done (`46.0%`), `27` remaining.
- Open pull requests in upstream repo (`parsairaniiidev/creatormembership`): `0`.
- Repository default branch: `main`.
- Last upstream push: `2026-02-27T23:43:58Z`.

## Verified Done
- API MVP is running:
  - Auth (`signup/signin/me`)
  - Creator + plan creation
  - Subscription checkout
  - Mock gateway callback
  - Audit/admin baseline endpoints
- Web app public experience upgraded beyond skeleton:
  - landing page + static trust pages (`/about`, `/how-it-works`, `/pricing`, `/privacy`)
  - shared site shell (`SiteHeader`, `SiteFooter`, `Container`)
  - SEO routes (`robots.txt`, `sitemap.xml`) + metadata/JSON-LD baseline
- Database schema and migrations run at API startup.
- Quality and governance gates are green:
  - `docs:validate`, `lint`, `typecheck`, `local-first:scan`, `test`, `build`, `test:integration`, `test:e2e`
- Real smoke flow is validated:
  - `signup -> creator -> plan -> checkout -> callback -> ACTIVE subscription`
  - duplicate callback remains safe (idempotent)
  - payment detail endpoint is owner-only
  - cancel flow transitions subscription to `CANCELED`
- Phase 1 API starts implemented:
  - `POST /api/v1/subscriptions/cancel`
  - `GET /api/v1/payments/:id` (owner-only)
  - `GET /api/v1/health/db`
- Phase 2 payment adapter baseline implemented:
  - multi-gateway adapter factory (`mock`, `idpay`)
  - webhook signature verification (`PAYMENT_WEBHOOK_SIGNATURE_INVALID`)
  - `pending/succeeded/failed` callback mapping
  - structured reconcile report via `POST /api/v1/payments/reconcile`
  - deterministic reconcile behavior in local mode (no pseudo-random status mutation)
  - payment event ledger (`payment_events`) for callback/reconcile traceability
- Phase 3 security baseline implemented:
  - admin authorization based on session role (no `x-admin-key`)
  - roles enforced: `platform_admin`, `support_admin`, `auditor`
  - tighter per-route rate limits for auth and callback routes
  - session lifecycle hardening: `auth/refresh`, `auth/signout`, `auth/signout-all`
- Production Phase C partial hardening implemented in code:
  - dependency vulnerability workflow automation added (`security:deps:scan`, `security:deps:triage`) with evidence artifacts under `.codex/security/dependency-audit/`
  - allowlist-based CORS policy + preflight handling in API hooks
  - CSRF protection for cross-site mutating requests
  - session device visibility (`user_agent`, `ip_address`, `last_seen_at`)
  - user session management endpoints:
    - `GET /api/v1/auth/sessions`
    - `DELETE /api/v1/auth/sessions/:sessionId`
- Latest local evidence run:
  - latest gates evidence: runId `20260223-205828` (`overallOk=true`) from `docs/RUNTIME/LOCAL_STATUS.md`
  - latest production-phase evidence batch in repo: `.codex/production-evidence/20260221-131758-phase-g`
- Phase 4 content-protection baseline implemented:
  - content metadata + publish endpoints
  - tokenized download URL (`GET /api/v1/download/:token`)
  - membership-gated access token issuance and download checks
- Phase 5 discovery baseline implemented:
  - public creator endpoints (`/api/v1/creators`, `/api/v1/creators/:slug`, `/api/v1/creators/:slug/plans`)
  - web public pages (`/creators`, `/creators/[slug]`)
  - SEO baseline (`sitemap`, page metadata, JSON-LD on creator page)
- Phase 6 ops baseline implemented:
  - local runtime scripts for `api` + `web` (no Docker dependency)
  - operational start/stop/status flow for local stack
  - optional host reverse-proxy runtime scripts (`local:proxy:start|status|stop`) for nginx-based local routing
  - end-to-end local runtime automation command (`pnpm -w run:local:full`)
- Phase 7 optimization baseline implemented:
  - performance budget checker (`pnpm -w perf:check`)
  - contracts drift checker (`pnpm -w contracts:check`)
  - consolidated regression smoke (`pnpm -w smoke:all`)
- Local runtime demo flow is executable end-to-end:
  - `pnpm -w seed:local-demo` creates creator/plan + buyer checkout/callback and verifies `SUCCEEDED` payment + `ACTIVE` subscription.
- Production hardening progress (new):
  - callback replay protection via `webhook_receipts` (duplicate webhook/callback guarded)
  - baseline security headers enforced at API edge (`nosniff`, `frame deny`, `referrer policy`, `permissions policy`)
  - database backup/restore automation scripts (`db:backup`, `db:restore`)
  - release governance automation imported/adapted from production sibling repos:
    - release candidate gates runner (`scripts/release/run-rc-gates.mjs`)
    - rollback drill checklist validator (`scripts/release/validate-rollback-drill.mjs`)
    - go/no-go evidence generator (`scripts/release/generate-go-no-go-evidence.sh`)
  - production phase automation executed end-to-end with force rerun across A..G:
    - evidence batches generated under `.codex/production-evidence/*-phase-{a..g}`
- Codex import hardening progress (new):
  - imported membership blueprint pack to `docs/blueprints/codex-import/` with index
  - normalization utilities implemented in `apps/api/src/normalize.ts`
  - ops summary JSON v1 endpoint implemented: `GET /api/v1/admin/ops/summary` (+ alias `/api/admin/ops/summary`)
  - db-backed worker queue implemented (`jobs` table, `worker:dev`, `jobs:enqueue:ops`)
  - minimal admin ops page implemented at `/admin/ops`

## Not Done Yet
- Production Phase A (Real Payment Go-Live):
  - `smoke:idpay-callback` فقط callback محلی را شبیه‌سازی می‌کند و هنوز E2E واقعی با provider بیرونی ندارد.
  - شواهدی از فعال‌سازی provider واقعی روی محیط Production و تایید owner ثبت نشده است.
- Production Phase B (Data Safety and DR):
  - سیاست backup افزایشی (incremental) و retention policy در اسکریپت‌ها پیاده نشده است.
  - سند تاییدشده RPO/RTO و گزارش DR drill روی محیط staging/prod-sim مستقل ثبت نشده است.
- Production Phase C (Security Hardening):
  - hardening پیشرفته CSRF (double-submit token/nonce برای فرم‌های مرورگرمحور) هنوز اضافه نشده است.
  - anomaly detection برای session abuse (rules + alerts) هنوز پیاده نشده است.
- Production Phase D (Observability and SRE):
  - متریک‌های عملیاتی و alert ruleهای واقعی (API/DB/Payments) پیاده‌سازی نشده‌اند.
  - SLO/SLI و error-budget review flow به‌صورت اجرایی ثبت نشده است.
- Production Phase E (Release Engineering):
  - strategy عملیاتی deployment (rolling/blue-green) تعریف و تست نشده است.
  - artifact provenance و build reproducibility با شواهد قابل ارجاع تکمیل نشده است.
- Production Phase F (Performance and Cost Efficiency):
  - profiling واقعی مسیرهای داغ API/DB و برنامه caching/index optimization تکمیل نشده است.
  - cost guardrailهای runtime/infra تعریف و enforce نشده‌اند.
- Production Phase G (Compliance and Governance):
  - least-privilege access governance به‌صورت policy + automation قابل اثبات بسته نشده است.
  - periodic review اجرا شده، اما هنوز signoff رسمی governance/owner برای بستن فاز ثبت نشده است.

## Progress Snapshot (Pragmatic)
- Engineering baseline and delivery pipeline: strong
- Core monetization MVP path: working with mock gateway
- Production readiness and feature-complete scope: still in progress (`27` آیتم باز در `tasks/NEXT_PRODUCTION.md`)

Use `docs/ROADMAP_PHASED.md` as the baseline no-deadline execution plan.
Use `docs/ROADMAP_PRODUCTION_PHASED.md` for production-grade phased execution.
