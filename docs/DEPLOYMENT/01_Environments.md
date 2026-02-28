# 01 Environments

## Local (Primary)
- API: `127.0.0.1:4000`
- Web: `127.0.0.1:3000`
- DB: local PostgreSQL

## Required Variables
- `DATABASE_URL`
- `PUBLIC_BASE_URL`
- `SESSION_SECRET`
- `PAYMENT_GATEWAY`
- `CONTENT_STORAGE_ROOT`
- `CORS_ALLOW_ORIGINS`
- payment provider vars when non-mock gateway is used:
  - `PAYMENT_GATEWAY_BASE_URL`
  - `PAYMENT_GATEWAY_WEBHOOK_SECRET`

## Production Guardrails
- `SESSION_SECRET` must not be placeholder (for example `change-me`).
- If `PAYMENT_GATEWAY != mock`, webhook secret must be set with a real value.
- Preferred check command before release:
  - `pnpm -w deploy:prepare`

## Environment Policy
- local-first first-class path
- no runtime dependency on external SaaS/CDN
- production-only secrets never committed
