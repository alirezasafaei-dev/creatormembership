# Dependency Vulnerability Triage

generated_at: 2026-02-28T03:53:15.960Z

## Summary

| Severity | Count | SLA | Action |
| --- | ---: | --- | --- |
| critical | 0 | 24h | Immediate hotfix / pin / rollback |
| high | 0 | 72h | Prioritized patch in next release candidate |
| moderate | 0 | 7d | Queue upgrade and verify regression tests |
| low | 0 | 30d | Batch dependency refresh cycle |
| info | 0 | backlog | Track for hygiene only |

## Evidence Checklist

- [ ] Scan output archived in `.codex/security/dependency-audit/`
- [ ] Owner assigned for each high/critical finding
- [ ] Fix PR or risk acceptance linked
- [ ] Re-scan after fix with passing severity gate

## Notes

- Use `pnpm -w security:deps:scan` for CI gate and JSON evidence.
- Use `pnpm -w security:deps:triage` when preparing incident/security review updates.
