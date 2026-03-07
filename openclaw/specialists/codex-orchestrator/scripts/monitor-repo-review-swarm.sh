#!/bin/zsh
set -euo pipefail

latest_file=/Users/sawyer/.openclaw/workspace-codex-orchestrator/runs/latest-repo-review-swarm.txt
if [[ ! -f "$latest_file" ]]; then
  echo "No swarm run recorded."
  exit 1
fi

runroot=$(<"$latest_file")
ledger="$runroot/ledger.tsv"
if [[ ! -f "$ledger" ]]; then
  echo "Missing ledger: $ledger"
  exit 1
fi

printf 'runroot\t%s\n' "$runroot"
printf 'repo\tpid\tproc\treview\tbytes\n'

tail -n +2 "$ledger" | while IFS=$'\t' read -r repo pid review_file log_file prompt_file status; do
  proc="dead"
  if kill -0 "$pid" 2>/dev/null; then
    proc="running"
  fi
  review="missing"
  bytes=0
  if [[ -f "$review_file" ]]; then
    review="present"
    bytes=$(wc -c < "$review_file" | tr -d ' ')
  fi
  printf '%s\t%s\t%s\t%s\t%s\n' "$repo" "$pid" "$proc" "$review" "$bytes"
done
