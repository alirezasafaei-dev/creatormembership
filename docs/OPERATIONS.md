# OPERATIONS

## Run Locally
```bash
pnpm install
pnpm api:dev
pnpm dev
```

## Local Stack Helpers
```bash
pnpm local:stack:start
pnpm local:stack:status
pnpm local:proxy:start
pnpm run:local:full
```

## Build
```bash
pnpm build
```

## Health Checks
- API DB health endpoint used in release evidence:
  - `GET http://127.0.0.1:4000/api/v1/health/db`

## Validation and Release Gates
```bash
pnpm docs:validate
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm test:e2e
pnpm local-first:scan
pnpm release:rc:gates
pnpm release:go-no-go:evidence
```

## Troubleshooting
- If API startup fails, verify `DATABASE_URL` and DB reachability.
- If smoke tests fail, run targeted checks: `pnpm smoke:mock-payment` and `pnpm smoke:all`.
- If release gate fails, inspect the latest report under `docs/release/reports/`.
