from __future__ import annotations

from pathlib import Path

import pytest

from scripts.tasks import sync_work_desktop as sync_work_desktop_module


def test_sync_clouds_does_not_count_failed_copy_or_update(
    monkeypatch: pytest.MonkeyPatch, capsys: pytest.CaptureFixture[str], tmp_path: Path
) -> None:
    g_files = {
        "copy.txt": {
            "abs_path": tmp_path / "g-copy.txt",
            "mtime_ms": 10_000,
            "size": 10,
        },
        "update.txt": {
            "abs_path": tmp_path / "g-update.txt",
            "mtime_ms": 20_000,
            "size": 20,
        },
    }
    o_files = {
        "update.txt": {
            "abs_path": tmp_path / "o-update.txt",
            "mtime_ms": 1_000,
            "size": 5,
        },
    }

    def fake_walk(root: Path) -> dict[str, dict]:
        if root == sync_work_desktop_module.GDRIVE_WD:
            return g_files
        if root == sync_work_desktop_module.ONEDRIVE_WD:
            return o_files
        raise AssertionError(f"unexpected root: {root}")

    monkeypatch.setattr(sync_work_desktop_module, "_walk_dir", fake_walk)
    monkeypatch.setattr(
        sync_work_desktop_module,
        "_copy_with_mtime",
        lambda src, dest: (_ for _ in ()).throw(OSError("boom")),
    )

    sync_work_desktop_module._sync_clouds(dry_run=False)

    out = capsys.readouterr().out
    assert "result: 0 copied, 0 updated, 0 identical/skipped" in out
