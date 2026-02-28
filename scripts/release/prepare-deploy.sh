#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

ENV_FILE="${ENV_FILE:-}"
if [[ -n "$ENV_FILE" && -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$ENV_FILE"
fi

fail() {
  echo "DEPLOY_PREP_FAIL: $1" >&2
  exit 1
}

require_nonempty() {
  local key="$1"
  local val="${!key:-}"
  if [[ -z "$val" ]]; then
    fail "missing required env var: $key"
  fi
}

reject_placeholder() {
  local key="$1"
  local val="${!key:-}"
  case "$val" in
    ""|"change-me"|"change_me"|"dev-insecure-session-secret"|"REPLACE_ME")
      fail "unsafe placeholder value for env var: $key"
      ;;
  esac
}

for bin in node pnpm curl; do
  command -v "$bin" >/dev/null 2>&1 || fail "missing command: $bin"
done

require_nonempty DATABASE_URL
require_nonempty SESSION_SECRET
require_nonempty PUBLIC_BASE_URL
require_nonempty PAYMENT_GATEWAY
require_nonempty CONTENT_STORAGE_ROOT
require_nonempty CORS_ALLOW_ORIGINS

reject_placeholder SESSION_SECRET
if [[ "${PAYMENT_GATEWAY:-mock}" != "mock" ]]; then
  require_nonempty PAYMENT_GATEWAY_WEBHOOK_SECRET
  require_nonempty PAYMENT_GATEWAY_BASE_URL
  reject_placeholder PAYMENT_GATEWAY_WEBHOOK_SECRET
fi

pnpm -w release:rollback:validate
pnpm -w release:rc:gates

OUT_DIR="docs/release/reports"
mkdir -p "$OUT_DIR"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
REPORT="$OUT_DIR/deploy-ready-${TIMESTAMP}.md"
LATEST="$OUT_DIR/deploy-ready-latest.md"
RC_REPORT="$OUT_DIR/rc-gates-latest.json"

cat > "$REPORT" <<EOF
# Deploy Readiness Report

- Timestamp (UTC): ${TIMESTAMP}
- Commit: $(git rev-parse --short HEAD)
- Branch: $(git rev-parse --abbrev-ref HEAD)
- Env source: ${ENV_FILE:-process environment}

## Environment Gates
- DATABASE_URL: set
- SESSION_SECRET: set (non-placeholder)
- PUBLIC_BASE_URL: set
- PAYMENT_GATEWAY: ${PAYMENT_GATEWAY}
- CONTENT_STORAGE_ROOT: set
- CORS_ALLOW_ORIGINS: set
- PAYMENT_GATEWAY_WEBHOOK_SECRET: $(if [[ "${PAYMENT_GATEWAY}" == "mock" ]]; then echo "not required (mock)"; else echo "set (non-placeholder)"; fi)

## Validation Gates
- rollback drill contract: passed
- release candidate gates (extended tier): passed
- rc report: \`${RC_REPORT}\`

## Verdict
- READY_FOR_DEPLOY: true
EOF

cp "$REPORT" "$LATEST"
echo "DEPLOY_PREP_OK report=$REPORT latest=$LATEST"
