from __future__ import annotations

from pathlib import Path

import pytest

from scripts.tasks import sync_openclaw as sync_openclaw_module


def test_sync_openclaw_aborts_before_git_when_errors_present(
    monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    repo_root = tmp_path / "repo"
    repo_root.mkdir()
    workspace = tmp_path / "workspace"
    workspace.mkdir()
    openclaw_root = tmp_path / "openclaw-root"
    openclaw_root.mkdir()

    git_calls: list[list[str]] = []

    monkeypatch.setattr(sync_openclaw_module, "REPO_ROOT", repo_root)
    monkeypatch.setattr(sync_openclaw_module, "OPENCLAW_WORKSPACE", workspace)
    monkeypatch.setattr(sync_openclaw_module, "OPENCLAW_ROOT", openclaw_root)
    monkeypatch.setattr(sync_openclaw_module, "ROOT_FILES", [])
    monkeypatch.setattr(sync_openclaw_module, "MAIN_MARKDOWN_DIRS", [])
    monkeypatch.setattr(sync_openclaw_module, "EXTRA_FILES", [])
    monkeypatch.setattr(
        sync_openclaw_module,
        "_sync_specialists",
        lambda result: result.errors.append("forced sync failure"),
    )
    monkeypatch.setattr(sync_openclaw_module.sys, "argv", ["sync:openclaw", "--commit"])
    monkeypatch.setattr(
        sync_openclaw_module,
        "run_or_throw",
        lambda command, **kwargs: git_calls.append(command) or "",
    )

    with pytest.raises(RuntimeError, match="nothing was committed"):
        sync_openclaw_module.sync_openclaw()

    assert git_calls == []
