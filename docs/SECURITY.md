# SECURITY

## Secrets Policy
- Never commit real secrets; keep only variable names in example env files.
- Rotate payment and session secrets using operational scripts when required.

## Reporting
- Report vulnerabilities internally first with reproduction steps and impact.

## Security/Audit Commands
```bash
pnpm security:scan
pnpm security:deps:triage
pnpm access:governance:audit
pnpm audit:trail:check
```
