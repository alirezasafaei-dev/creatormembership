# Go/No-Go Evidence Bundle

- Timestamp (UTC): 20260228T035902Z
- Commit: aeb47c5
- Branch: main
- API URL: http://127.0.0.1:4000
- WEB URL: http://127.0.0.1:3000
- Require WEB health: 1

## Gate Results
- docs:validate: 0
- lint: 0
- typecheck: 0
- test: 0
- build: 0
- smoke:all: 0

## Runtime Checks
- GET http://127.0.0.1:4000/api/v1/health/db -> 200
- GET http://127.0.0.1:3000/ -> 200

## Artifacts
- artifacts/go-no-go-20260228T035902Z.docs.log
- artifacts/go-no-go-20260228T035902Z.lint.log
- artifacts/go-no-go-20260228T035902Z.typecheck.log
- artifacts/go-no-go-20260228T035902Z.test.log
- artifacts/go-no-go-20260228T035902Z.build.log
- artifacts/go-no-go-20260228T035902Z.smoke.log

## Decision
- Suggested decision: **GO**
