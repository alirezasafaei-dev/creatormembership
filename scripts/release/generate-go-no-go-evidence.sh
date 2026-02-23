#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

API_URL="${API_URL:-http://127.0.0.1:4000}"
WEB_URL="${WEB_URL:-http://127.0.0.1:3000}"
OUT_DIR="${OUT_DIR:-docs/release/reports}"

TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$OUT_DIR"
mkdir -p artifacts

BASENAME="go-no-go-${TIMESTAMP}"
REPORT_FILE="$OUT_DIR/${BASENAME}.md"

run_and_capture() {
  local label="$1"
  local command="$2"
  local logfile="artifacts/${BASENAME}.${label}.log"
  set +e
  bash -lc "$command" >"$logfile" 2>&1
  local exit_code=$?
  set -e
  echo "$exit_code"
}

docs_ec="$(run_and_capture "docs" "pnpm -w docs:validate")"
lint_ec="$(run_and_capture "lint" "pnpm -w lint")"
typecheck_ec="$(run_and_capture "typecheck" "pnpm -w typecheck")"
test_ec="$(run_and_capture "test" "pnpm -w test")"
build_ec="$(run_and_capture "build" "pnpm -w build")"
smoke_ec="$(run_and_capture "smoke" "pnpm -w smoke:all")"

api_health="$(curl -fsS -o /dev/null -w "%{http_code}" "${API_URL%/}/api/v1/health/db" || true)"
web_health="$(curl -fsS -o /dev/null -w "%{http_code}" "${WEB_URL%/}/" || true)"

decision="NO-GO"
if [[ "$docs_ec" == "0" && "$lint_ec" == "0" && "$typecheck_ec" == "0" && "$test_ec" == "0" && "$build_ec" == "0" && "$smoke_ec" == "0" && "$api_health" == "200" ]]; then
  decision="GO"
fi

cat > "$REPORT_FILE" <<REPORT
# Go/No-Go Evidence Bundle

- Timestamp (UTC): ${TIMESTAMP}
- Commit: $(git rev-parse --short HEAD)
- Branch: $(git rev-parse --abbrev-ref HEAD)
- API URL: ${API_URL}
- WEB URL: ${WEB_URL}

## Gate Results
- docs:validate: ${docs_ec}
- lint: ${lint_ec}
- typecheck: ${typecheck_ec}
- test: ${test_ec}
- build: ${build_ec}
- smoke:all: ${smoke_ec}

## Runtime Checks
- GET ${API_URL%/}/api/v1/health/db -> ${api_health}
- GET ${WEB_URL%/}/ -> ${web_health}

## Artifacts
- artifacts/${BASENAME}.docs.log
- artifacts/${BASENAME}.lint.log
- artifacts/${BASENAME}.typecheck.log
- artifacts/${BASENAME}.test.log
- artifacts/${BASENAME}.build.log
- artifacts/${BASENAME}.smoke.log

## Decision
- Suggested decision: **${decision}**
REPORT

echo "GO_NO_GO_EVIDENCE_OK report=${REPORT_FILE} decision=${decision}"
