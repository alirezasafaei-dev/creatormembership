# ROADMAP_PRODUCTION_PHASED (No Timeline)

این برنامه برای رسیدن از baseline فعلی به Production-grade طراحی شده است و زمان‌بندی تقویمی ندارد.
بستن هر فاز فقط با Evidence واقعی انجام می‌شود.

## Operating Constraints
- Local-first و عدم وابستگی اجباری خارجی حفظ شود.
- هر تغییر باید rollback-safe باشد.
- هیچ فاز بدون گذر از gateهای کیفیت و امنیت بسته نشود.

## Current Reality Baseline (2026-02-26)
- Evidence موجود در `.codex/production-evidence/` معتبر است، اما فعلا در سطح local/prod-sim اجرا شده و به معنی بسته‌شدن کامل production phases نیست.
- معیار «Done» برای هر Production Phase فقط وقتی معتبر است که Exit Criteria همان فاز در محیط واقعی (یا staging مستقل معادل production) اثبات شود.
- تا زمان تکمیل آیتم‌های باز، این سند باید به‌عنوان برنامه‌ی در حال اجرا در نظر گرفته شود، نه «برنامه‌ی کامل‌شده».
- Evidence محلی جدیدتر (gates): runId `20260223-205828` با `overallOk=true` (from `docs/RUNTIME/LOCAL_STATUS.md`).
- آخرین batch شواهد production-phase موجود در ریپو:
  - `.codex/production-evidence/20260221-130951-phase-a`
  - `.codex/production-evidence/20260221-131010-phase-b`
  - `.codex/production-evidence/20260221-131729-phase-c`
  - `.codex/production-evidence/20260221-131411-phase-d`
  - `.codex/production-evidence/20260221-131423-phase-e`
  - `.codex/production-evidence/20260221-131741-phase-f`
  - `.codex/production-evidence/20260221-131758-phase-g`
- موارد پیاده‌شده (اما هنوز معادل close کامل Production Phase C نیست):
  - CORS allowlist + preflight handling
  - CSRF block برای درخواست‌های cross-site state-changing
  - session device visibility + مدیریت سشن کاربر
- وضعیت برد Production (واقعی از `tasks/NEXT_PRODUCTION.md`):
  - Weekly checklist: `3/15` done (`20%`) و `12` آیتم باز
  - Production phase board: `8/22` done (`36.4%`) و `14` آیتم باز

## Production Phase A - Real Payment Go-Live
هدف: آماده‌سازی درگاه واقعی در سطح Production
- Scope:
  - فعال‌سازی provider واقعی در محیط Production
  - مدیریت secrets و key rotation
  - webhook signature enforcement + replay protection
  - reconciliation job و گزارش mismatch
- Exit Criteria:
  - تست end-to-end با provider واقعی پاس
  - callback/reconcile idempotent و auditable
  - runbook incident پرداخت کامل

## Production Phase B - Data Safety and DR
هدف: پایداری داده و بازیابی بحران
- Scope:
  - backup policy (full + incremental)
  - restore drill روی snapshot واقعی
  - migration safety checklist و forward-only policy
  - retention و data integrity checks
- Exit Criteria:
  - بازیابی دیتابیس روی محیط staging/prod-sim موفق
  - RPO/RTO هدف‌گذاری‌شده در سند تایید شده
  - گزارش DR drill ثبت و قابل ارجاع

## Production Phase C - Security Hardening
هدف: کاهش ریسک امنیتی و انطباق عملیاتی
- Scope:
  - تکمیل hardening سشن (anomaly flags, brute-force defense, policy review)
  - abuse controls قابل اندازه‌گیری (rate-limit baselines + abuse detection)
  - hardening پیشرفته CSRF برای flows مرورگرمحور + verification playbook
  - dependency vulnerability lifecycle (scan/triage/fix/evidence)
- Exit Criteria:
  - security checklist بدون finding بحرانی باز
  - smoke امنیتی و مسیرهای حساس پاس
  - incident response مسیر عملیاتی و تمرین‌شده

## Production Phase D - Observability and SRE
هدف: مانیتورینگ قابل اتکا و پاسخ سریع
- Scope:
  - structured logs + trace correlation
  - metrics + alert rules برای API/DB/Payments
  - SLO/SLI تعریف‌شده برای مسیرهای حیاتی
  - error budget review flow
- Exit Criteria:
  - داشبوردهای عملیاتی برای health/payment/subscription فعال
  - alertهای حیاتی تست‌شده و noise کنترل‌شده
  - runbook on-call برای top incidents آماده

## Production Phase E - Release Engineering
هدف: انتشار امن، تکرارپذیر، بدون downtime غیرضروری
- Scope:
  - release gates (contracts, perf, smoke, security)
  - deployment strategy (rolling/blue-green قابل‌اجرا)
  - rollback procedure با smoke پس از rollback
  - artifact provenance و build reproducibility
- Exit Criteria:
  - dry-run release + rollback با evidence کامل
  - checklist انتشار بدون مورد باز بحرانی
  - معیار پذیرش release توسط owner تایید شده

## Production Phase F - Performance and Cost Efficiency
هدف: حفظ کیفیت سرویس با هزینه بهینه
- Scope:
  - profiling مسیرهای داغ API/DB
  - query/index optimization و caching strategy
  - static/dynamic web performance budget tuning
  - infra/runtime cost guardrails
- Exit Criteria:
  - latency و throughput مسیرهای حیاتی در سطح هدف
  - perf budget بدون regressions بحرانی
  - گزارش بهینه‌سازی هزینه و ظرفیت ثبت‌شده

## Production Phase G - Compliance and Operational Governance
هدف: کنترل فرآیند و پایداری بلندمدت
- Scope:
  - access governance و least privilege
  - audit trail completeness validation
  - policy enforcement automation (docs drift, API drift, secret policy)
  - periodic production-readiness review cadence
- Exit Criteria:
  - governance gates خودکار و پایدار
  - evidence چرخه‌ای برای audit داخلی کامل
  - ready-for-scale signoff ثبت‌شده

## Global Production Gates (Before Final Signoff)
- `pnpm -w docs:validate`
- `pnpm -w lint`
- `pnpm -w typecheck`
- `pnpm -w local-first:scan`
- `pnpm -w test`
- `pnpm -w build`
- `pnpm -w contracts:check`
- `pnpm -w perf:check`
- `pnpm -w smoke:all`
- `pnpm -w evidence:record`

## Execution Mode
- One-shot bootstrap: `pnpm -w run:local:full`
- Continuous non-redundant loop: `pnpm -w autopilot:phase-loop`
- Background autonomous execution: `pnpm -w autopilot:daemon:start`

## Production Execution Pack
- Phase A (payment go-live evidence):
  - `DATABASE_URL=... PAYMENT_GATEWAY_WEBHOOK_SECRET=... pnpm -w production:phase-a`
- Phase B (DR drill evidence):
  - `DATABASE_URL=... pnpm -w production:phase-b`
