# ExecPlan — 3 Phase Execution (No Timeline)

مرجع‌های وضعیت واقعی:
- `docs/PROJECT_STATUS.md`
- `docs/ROADMAP_PRODUCTION_PHASED.md`
- `tasks/NEXT.md`
- `tasks/NEXT_PRODUCTION.md`

## Baseline واقعی (2026-02-23)
- [x] آخرین evidence کامل سبز است: runId `20260223-123432` (`overallOk=true`)
- [x] Public Web + SEO baseline در کد فعال است (`layout/metadata/json-ld/robots/sitemap/pages`)
- [x] امنیت پایه Phase C در کد پیاده شده است (CORS/CSRF baseline + session device visibility)
- [ ] 26 آیتم Production هنوز برای close نهایی باز است (موارد بیرونی/production-grade)

## Phase 1 — Stabilize & Standardize
### Goal
بستن شکاف‌های حیاتی کم‌ریسک برای امنیت، کیفیت UI/SEO و همگام‌سازی docs با کد.

### Entry Criteria
- آخرین `pnpm -w evidence:record:gates` سبز باشد.
- `docs/PROJECT_STATUS.md` با وضعیت واقعی کد همگام باشد.

### Work Packages
- Security:
  - dependency vulnerability workflow (scan/triage/fix/evidence)
  - CSRF hardening تکمیلی برای flowهای مرورگرمحور
- UX/SEO quick wins:
  - تکمیل heading/meta/canonical consistency در صفحات عمومی
  - تکمیل loading/empty/error/success states در صفحات کلیدی
  - رفع a11y پایه (focus, keyboard, contrast, semantics)
- Docs/Data sync:
  - همگام‌سازی `docs/RUNTIME/LOCAL_STATUS.md` با latest evidence
  - همگام‌سازی `tasks/NEXT_PRODUCTION.md` با وضعیت واقعی Phase C

### Exit Criteria
- [ ] هیچ مورد P0 امنیت/UX/SEO باز نباشد
- [ ] `pnpm -w docs:validate && pnpm -w lint && pnpm -w typecheck && pnpm -w build` سبز باشد
- [ ] checklist فاز 1 در docs بسته شود

## Phase 2 — Systemize & Refactor
### Goal
کاهش debt و تکرار با استانداردسازی سیستم کامپوننت، محتوا، فرم و الگوهای SEO.

### Entry Criteria
- Phase 1 بسته شده باشد.
- baseline تست/گیت‌ها پایدار بماند.

### Work Packages
- Design System:
  - تثبیت tokenها (color/spacing/typography/radius/shadow)
  - یکپارچه‌سازی component states/variants در صفحات عمومی
- Forms/States:
  - الگوی یکسان validation + error/help copy
  - الگوی reusable برای loading/empty/error/success
- SEO/IA:
  - metadata template rules برای همه templateها
  - internal linking blueprint (nav/footer/related/breadcrumb)
  - schema coverage برای page-typeهای اصلی

### Exit Criteria
- [ ] duplication محسوس در componentهای کلیدی کاهش یافته باشد
- [ ] الگوهای فرم/استیت reusable و مستند باشند
- [ ] QA UX + SEO بدون regression بحرانی پاس شود

## Phase 3 — Optimize & Production Hardening
### Goal
بستن شکاف‌های production-grade، بهینه‌سازی تجربه و فعال‌سازی measurement واقعی.

### Entry Criteria
- فاز 2 بسته شده باشد.
- مسیر release و rollback حداقلی قابل اتکا باشد.

### Work Packages
- Production Go-Live:
  - E2E واقعی provider بیرونی (Phase A)
  - DR drill + RPO/RTO + incremental/retention (Phase B)
  - observability/SLO/alerts + release strategy/provenance (Phase D/E)
- Performance & Cost:
  - hot-path profiling + cache/index optimization (Phase F)
  - cost guardrails
- Growth/Measurement:
  - KPI instrumentation (GSC/GA4/event taxonomy)
  - baseline experimentation hooks برای CTR/conversion

### Exit Criteria
- [ ] فازهای Production A تا G با evidence production-like بسته شوند
- [ ] `pnpm -w smoke:all && pnpm -w contracts:check && pnpm -w perf:check` سبز باشد
- [ ] گزارش نهایی readiness در docs ثبت شود

## Global Gate (برای بستن هر فاز)
- `pnpm -w docs:validate`
- `pnpm -w lint`
- `pnpm -w typecheck`
- `pnpm -w local-first:scan`
- `pnpm -w test`
- `pnpm -w build`
