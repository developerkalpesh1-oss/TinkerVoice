#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEV_PORTS=(3000 3001 5000 5555)

matches_pattern() {
  local comm="$1"
  local cmd="$2"

  case "$comm:$cmd" in
    node:*/pnpm\ dev* | \
    node:*/pnpm\ run\ dev* | \
    node:*/node_modules/.bin/next\ dev* | \
    node:*/next/dist/bin/next\ dev* | \
    node:*/tsx/dist/cli.mjs\ watch\ src/index.ts* | \
    node:*/node_modules/.bin/tsx\ watch\ src/index.ts* | \
    node:*tsx/dist/preflight.cjs*src/index.ts* | \
    next-server*:* | \
    sh:sh\ -c\ next\ dev* | \
    sh:sh\ -c\ tsx\ watch\ src/index.ts* | \
    python*:*main.py\ api* | \
    python*:*main.py\ dev* | \
    python*:*main.py\ worker*)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

under_root() {
  local cmd="$1"
  local cwd="$2"
  [[ "$cmd" == *"$ROOT"* || "$cwd" == "$ROOT"* ]]
}

add_pid() {
  local pid="$1"
  local existing
  for existing in "${pids[@]+"${pids[@]}"}"; do
    if [ "$existing" = "$pid" ]; then
      return
    fi
  done
  pids+=("$pid")
}

pids=()

while read -r pid comm cmd; do
  if [ -z "$pid" ] || [ "$pid" = "$$" ]; then
    continue
  fi

  cwd=""
  if [ -e "/proc/$pid/cwd" ]; then
    cwd="$(readlink "/proc/$pid/cwd" 2>/dev/null || true)"
  fi

  if matches_pattern "$comm" "$cmd" && under_root "$cmd" "$cwd"; then
    add_pid "$pid"
  fi
done < <(ps -eo pid=,comm=,args=)

# Also clear listeners still holding QuickVoice ports when the process is ours.
for port in "${DEV_PORTS[@]}"; do
  while read -r pid; do
    [ -z "$pid" ] && continue
    [ "$pid" = "$$" ] && continue
    cmd="$(tr '\0' ' ' < "/proc/$pid/cmdline" 2>/dev/null || true)"
    cwd=""
    if [ -e "/proc/$pid/cwd" ]; then
      cwd="$(readlink "/proc/$pid/cwd" 2>/dev/null || true)"
    fi
    if under_root "$cmd" "$cwd"; then
      add_pid "$pid"
    fi
  done < <(ss -H -tlnp "sport = :$port" 2>/dev/null | grep -oP 'pid=\K[0-9]+' | sort -u || true)
done

if [ "${#pids[@]}" -eq 0 ]; then
  printf '[ok] no QuickVoice dev processes found\n'
  exit 0
fi

printf 'stopping QuickVoice dev processes: %s\n' "${pids[*]}"
kill "${pids[@]}" >/dev/null 2>&1 || true

sleep 1

survivors=()
for pid in "${pids[@]}"; do
  if kill -0 "$pid" >/dev/null 2>&1; then
    survivors+=("$pid")
  fi
done

if [ "${#survivors[@]}" -gt 0 ]; then
  printf 'force stopping QuickVoice dev processes: %s\n' "${survivors[*]}"
  kill -KILL "${survivors[@]}" >/dev/null 2>&1 || true
fi

printf '[ok] QuickVoice dev processes cleared\n'
