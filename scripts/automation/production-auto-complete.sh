#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

export DATABASE_URL="${DATABASE_URL:-postgresql://dev@127.0.0.1:55432/pli}"
export PAYMENT_GATEWAY_WEBHOOK_SECRET="${PAYMENT_GATEWAY_WEBHOOK_SECRET:-auto-dev-webhook-secret}"
export PRODUCTION_AUTO_FORCE="${PRODUCTION_AUTO_FORCE:-0}"
export PRODUCTION_AUTO_MAX_CYCLES="${PRODUCTION_AUTO_MAX_CYCLES:-1}"
export PRODUCTION_AUTO_CONTINUE_ON_FAIL="${PRODUCTION_AUTO_CONTINUE_ON_FAIL:-1}"

EVID_ROOT="$ROOT_DIR/.codex/production-evidence"
mkdir -p "$EVID_ROOT"

LOCK_ROOT="$ROOT_DIR/.local-run/locks"
LOCK_DIR="$LOCK_ROOT/production-auto.lock"
mkdir -p "$LOCK_ROOT"
if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  echo "[PROD_AUTO] skip: another production-auto execution is already running"
  exit 0
fi
cleanup_lock() {
  rmdir "$LOCK_DIR" >/dev/null 2>&1 || true
}
trap cleanup_lock EXIT

has_phase_evidence() {
  local phase_tag="$1"
  find "$EVID_ROOT" -maxdepth 1 -type d -name "*-${phase_tag}" | grep -q .
}

run_phase() {
  local phase="$1"
  local cmd="$2"
  if [[ "$PRODUCTION_AUTO_FORCE" != "1" ]] && has_phase_evidence "$phase"; then
    echo "[PROD_AUTO] skip $phase (evidence exists)"
    return 0
  fi
  echo "[PROD_AUTO] run $phase force=${PRODUCTION_AUTO_FORCE}"
  if ! bash -lc "$cmd"; then
    echo "[PROD_AUTO] fail $phase"
    return 1
  fi
  echo "[PROD_AUTO] ok $phase"
}

count_open_tasks() {
  if [[ ! -f "$ROOT_DIR/tasks/NEXT_PRODUCTION.md" ]]; then
    echo "0"
    return
  fi
  awk '/^- \[ \]/{c++} END{print c+0}' "$ROOT_DIR/tasks/NEXT_PRODUCTION.md"
}

run_cycle() {
  local cycle="$1"
  local failures=0
  echo "[PROD_AUTO] cycle $cycle start"

  run_phase phase-a "pnpm -w production:phase-a" || failures=$((failures + 1))
  run_phase phase-b "pnpm -w production:phase-b" || failures=$((failures + 1))
  run_phase phase-c "pnpm -w production:phase-c" || failures=$((failures + 1))
  run_phase phase-d "pnpm -w production:phase-d" || failures=$((failures + 1))
  run_phase phase-e "pnpm -w production:phase-e" || failures=$((failures + 1))
  run_phase phase-f "pnpm -w production:phase-f" || failures=$((failures + 1))
  run_phase phase-g "pnpm -w production:phase-g" || failures=$((failures + 1))

  pnpm -w roadmap:sync-next:production
  local open_tasks
  open_tasks="$(count_open_tasks)"
  echo "[PROD_AUTO] cycle $cycle done failures=$failures open_tasks=$open_tasks"

  if [[ "$failures" -gt 0 && "$PRODUCTION_AUTO_CONTINUE_ON_FAIL" != "1" ]]; then
    echo "[PROD_AUTO] stop: failures detected and continue-on-fail disabled"
    return 2
  fi

  if [[ "$open_tasks" -eq 0 ]]; then
    echo "[PROD_AUTO] all production tasks closed"
    return 0
  fi
  return 1
}

if ! curl -fsS "http://127.0.0.1:4000/api/v1/health/db" >/dev/null 2>&1; then
  echo "[PROD_AUTO] local runtime not healthy; bootstrapping"
  DATABASE_URL="$DATABASE_URL" pnpm -w run:local:full || true
fi

cycles="${PRODUCTION_AUTO_MAX_CYCLES}"
if ! [[ "$cycles" =~ ^[0-9]+$ ]] || [[ "$cycles" -lt 1 ]]; then
  cycles=1
fi

done_ok=0
for i in $(seq 1 "$cycles"); do
  if run_cycle "$i"; then
    done_ok=1
    break
  fi
done

if [[ "$done_ok" -eq 1 ]]; then
  echo "PRODUCTION_AUTO_COMPLETE_OK cycles=$cycles force=$PRODUCTION_AUTO_FORCE"
  exit 0
fi

open_tasks="$(count_open_tasks)"
echo "PRODUCTION_AUTO_INCOMPLETE cycles=$cycles force=$PRODUCTION_AUTO_FORCE open_tasks=$open_tasks"
exit 0
