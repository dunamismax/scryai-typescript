from __future__ import annotations

import subprocess
from pathlib import Path

from scripts.remote_policy import build_repo_remote_policy, get_remote_urls
from scripts.tasks.sync_remotes import _process_repo


def _init_repo(tmp_path: Path, name: str) -> Path:
    repo = tmp_path / name
    repo.mkdir()
    subprocess.run(["git", "init"], cwd=repo, check=True, capture_output=True, text=True)
    return repo


def test_build_repo_remote_policy_preserves_openclaw_contribution_clone() -> None:
    policy = build_repo_remote_policy(
        "openclaw",
        owner="dunamismax",
        github_host_alias="github.com-dunamismax",
        codeberg_host_alias="codeberg.org-dunamismax",
    )

    assert policy.clone_url == "https://github.com/openclaw/openclaw.git"
    assert policy.origin.fetch_url == "https://github.com/openclaw/openclaw.git"
    assert policy.origin.push_urls == ()
    assert policy.extra_remotes["fork"].fetch_url == (
        "git@github.com-dunamismax:dunamismax/openclaw.git"
    )
    assert policy.push_default == "fork"


def test_sync_remotes_skips_custom_contribution_clone(tmp_path: Path) -> None:
    repo = _init_repo(tmp_path, "openclaw")
    subprocess.run(
        ["git", "remote", "add", "origin", "https://github.com/openclaw/openclaw.git"],
        cwd=repo,
        check=True,
        capture_output=True,
        text=True,
    )
    subprocess.run(
        [
            "git",
            "remote",
            "add",
            "fork",
            "git@github.com-dunamismax:dunamismax/openclaw.git",
        ],
        cwd=repo,
        check=True,
        capture_output=True,
        text=True,
    )
    subprocess.run(
        ["git", "config", "remote.pushDefault", "fork"],
        cwd=repo,
        check=True,
        capture_output=True,
        text=True,
    )

    result = _process_repo(str(repo), fix=False)

    assert result.status == "skip"
    assert "pushDefault=fork" in result.detail


def test_sync_remotes_marks_simple_personal_clone_as_todo_and_can_fix(
    tmp_path: Path,
) -> None:
    repo = _init_repo(tmp_path, "boring-go-web")
    subprocess.run(
        ["git", "remote", "add", "origin", "https://github.com/dunamismax/boring-go-web.git"],
        cwd=repo,
        check=True,
        capture_output=True,
        text=True,
    )

    preview = _process_repo(str(repo), fix=False)
    assert preview.status == "todo"

    applied = _process_repo(str(repo), fix=True)
    assert applied.status == "fixed"

    urls = get_remote_urls(repo)
    assert urls == (
        "git@github.com-dunamismax:dunamismax/boring-go-web.git",
        [
            "git@github.com-dunamismax:dunamismax/boring-go-web.git",
            "git@codeberg.org-dunamismax:dunamismax/boring-go-web.git",
        ],
    )
