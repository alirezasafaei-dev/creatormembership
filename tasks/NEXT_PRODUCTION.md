# Next Production Tasks (No Timeline)

> Updated: 2026-02-26
> Rule: production phases close only with evidence-backed exits in real/prod-like environments.

## Reality Metrics (2026-02-26)
- Weekly checklist completion: `3/15` (`20%`) | remaining: `12`
- Production phase board completion: `8/22` (`36.4%`) | remaining: `14`
- Global gates checklist completion: `10/10` (`100%`)

## Weekly Reality Checklist (Not Actually Closed Yet)
- [ ] Phase A: اجرای E2E واقعی با provider بیرونی (نه callback شبیه‌سازی‌شده محلی)
- [ ] Phase A: تایید owner برای go-live provider + incident runbook امضاشده
- [ ] Phase B: پیاده‌سازی backup incremental + retention policy قابل اجرا
- [ ] Phase B: DR drill روی staging/prod-sim مستقل + سند RPO/RTO تاییدشده
- [x] Phase C: enforce baseline CORS/CSRF policy در API (local/prod-sim)
- [ ] Phase C: dependency vulnerability workflow چرخه‌ای (scan/triage/fix/evidence)
- [x] Phase C: device visibility برای sessionها
- [ ] Phase D: metrics + alerts واقعی برای API/DB/Payments
- [ ] Phase D: تعریف و پایش SLO/SLI + error budget review
- [ ] Phase E: strategy deployment (rolling/blue-green) + dry-run مستند
- [ ] Phase E: artifact provenance + reproducible build evidence
- [ ] Phase F: profiling مسیرهای داغ + برنامه cache/index با before/after metrics
- [ ] Phase F: cost guardrails برای runtime/infra
- [ ] Phase G: least-privilege governance با automation قابل audit
- [x] Phase G: چرخه دوره‌ای production-readiness review با evidence تکرارشونده

## Production Phase Board
### Production Phase A - Real Payment Go-Live
- [ ] Run real provider E2E in controlled prod-like environment
- [x] Verify callback/reconcile idempotency in local/prod-sim evidence
- [ ] Finalize and sign off payment incident runbook

### Production Phase B - Data Safety and DR
- [ ] Add incremental backup workflow
- [ ] Define retention/data integrity checks
- [x] Execute and record DR drill (local/prod-sim evidence)
- [ ] Publish approved RPO/RTO targets

### Production Phase C - Security Hardening
- [x] Enforce baseline CORS/CSRF policy and verification checks
- [ ] Implement dependency vulnerability pipeline and triage process
- [x] Add device/session visibility controls

### Production Phase D - Observability and SRE
- [x] Implement ops baseline (health/contracts/perf/RBAC evidence)
- [ ] Define and test critical alert rules
- [ ] Define SLO/SLI and error-budget review cadence

### Production Phase E - Release Engineering
- [ ] Implement and test rolling/blue-green deployment plan
- [x] Validate rollback procedure with post-rollback smoke + RC gates
- [ ] Add artifact provenance + reproducible build checks

### Production Phase F - Performance and Cost Efficiency
- [x] Performance baseline checks (perf + regression evidence)
- [ ] Define caching/index strategy with benchmark evidence
- [ ] Add runtime/infra cost guardrails and report

### Production Phase G - Compliance and Operational Governance
- [ ] Enforce least-privilege access governance workflow
- [ ] Validate audit trail completeness on periodic cycle
- [x] Execute recurring production-readiness review with archived evidence

## Global Production Gates
- [x] `pnpm -w docs:validate`
- [x] `pnpm -w lint`
- [x] `pnpm -w typecheck`
- [x] `pnpm -w local-first:scan`
- [x] `pnpm -w test`
- [x] `pnpm -w build`
- [x] `pnpm -w contracts:check`
- [x] `pnpm -w perf:check`
- [x] `pnpm -w smoke:all`
- [x] `pnpm -w evidence:record`

## Automation Commands
- `pnpm -w roadmap:sync-next:production`
- `pnpm -w production:phase-a`
- `pnpm -w production:phase-b`
- `pnpm -w production:phase-c`
- `pnpm -w production:phase-d`
- `pnpm -w production:phase-e`
- `pnpm -w production:phase-f`
- `pnpm -w production:phase-g`
