#!/bin/zsh
set -euo pipefail

latest_file=/Users/sawyer/.openclaw/workspace-codex-orchestrator/runs/latest-targeted-codex-swarm.txt
if [[ ! -f "$latest_file" ]]; then
  echo "No targeted swarm run recorded."
  exit 1
fi

runroot=$(<"$latest_file")
ledger="$runroot/ledger.tsv"
if [[ ! -f "$ledger" ]]; then
  echo "Missing ledger: $ledger"
  exit 1
fi

python3 - "$runroot" "$ledger" <<'PY'
import os
import signal
import sys
from pathlib import Path

runroot = sys.argv[1]
ledger = Path(sys.argv[2])
print(f"runroot\t{runroot}")
print("task\tpid\tproc\treport\tbytes")
lines = ledger.read_text().splitlines()
for line in lines[1:]:
    parts = line.split("\t") if "\t" in line else line.split("\\t")
    if len(parts) < 8:
        print(f"malformed\t-\t-\t-\t0")
        continue
    task, pid, mode, workdir, output_file, log_file, prompt_file, lane_status = parts[:8]
    proc = "dead"
    if pid != "-":
        try:
            os.kill(int(pid), 0)
            proc = "running"
        except Exception:
            proc = "dead"
    report = "missing"
    bytes_count = 0
    p = Path(output_file)
    if p.exists():
        report = "present"
        bytes_count = p.stat().st_size
    print(f"{task}\t{pid}\t{proc}\t{report}\t{bytes_count}")
PY
