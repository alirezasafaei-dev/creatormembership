# Dependency Policy

Dependencies must be pinned through lockfiles, reviewed for license/security risk, and updated through CI-verified changes.

## Vulnerability Lifecycle
- Scan cadence: run `pnpm -w security:deps:scan` at least weekly and before production release gates.
- Triage: use `.codex/security/dependency-audit/latest-triage.md` and assign owners for high/critical findings.
- Severity SLA:
  - critical: mitigate within 24h
  - high: mitigate within 72h
  - moderate: mitigate within 7d
  - low/info: include in routine dependency refresh cycles
- Evidence: archive scan JSON + triage markdown for each production phase/security review.
- Gate rule: high/critical findings fail dependency gate until remediated or formally risk-accepted.
