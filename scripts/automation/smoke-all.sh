#!/usr/bin/env bash
set -euo pipefail

PG_BIN="/usr/lib/postgresql/16/bin"
PG_ROOT="/tmp/asdev_pg_smoke_all"
PG_DATA="$PG_ROOT/data"
PG_LOG="$PG_ROOT/postgres.log"
PG_PORT="${PG_PORT:-55438}"

port_in_use() {
  local port="$1"
  if command -v ss >/dev/null 2>&1; then
    ss -ltn "( sport = :${port} )" | tail -n +2 | grep -q .
    return
  fi
  if command -v lsof >/dev/null 2>&1; then
    lsof -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1
    return
  fi
  return 1
}

while port_in_use "$PG_PORT"; do
  PG_PORT=$((PG_PORT + 1))
done

rm -rf "$PG_ROOT"
mkdir -p "$PG_ROOT"
"$PG_BIN/initdb" -D "$PG_DATA" -A trust >/tmp/asdev_pg_smoke_all_init.log
"$PG_BIN/pg_ctl" -D "$PG_DATA" -l "$PG_LOG" -o "-p ${PG_PORT} -k ${PG_ROOT}" start
"$PG_BIN/createdb" -h 127.0.0.1 -p "$PG_PORT" pli

cleanup() {
  "$PG_BIN/pg_ctl" -D "$PG_DATA" stop >/dev/null 2>&1 || true
}
trap cleanup EXIT

export DATABASE_URL="postgresql://dev@127.0.0.1:${PG_PORT}/pli"

API_PORT=4040 HOST=127.0.0.1 pnpm -w smoke:mock-payment
API_PORT=4041 HOST=127.0.0.1 PAYMENT_GATEWAY_WEBHOOK_SECRET=local-idpay-secret pnpm -w smoke:idpay-callback
API_PORT=4042 HOST=127.0.0.1 pnpm -w smoke:rbac-admin
API_PORT=4043 HOST=127.0.0.1 pnpm -w smoke:content-download
API_PORT=4044 HOST=127.0.0.1 pnpm -w smoke:auth-session

echo "SMOKE_ALL_OK"
