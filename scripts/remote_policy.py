"""Shared git remote policy helpers for repo/bootstrap tasks."""

from __future__ import annotations

import re
import subprocess
from dataclasses import dataclass, field
from pathlib import Path

from scripts.common import run_or_throw

_GIT_URL_PATTERNS = (
    re.compile(
        r"^git@(?P<host>[^:]+):(?P<owner>[^/]+)/(?P<repo>[^/]+?)(?:\.git)?$"
    ),
    re.compile(
        r"^ssh://git@(?P<host>[^/]+)/(?P<owner>[^/]+)/(?P<repo>[^/]+?)(?:\.git)?$"
    ),
    re.compile(
        r"^https://(?P<host>[^/]+)/(?P<owner>[^/]+)/(?P<repo>[^/]+?)(?:\.git)?$"
    ),
)


@dataclass(frozen=True)
class ParsedGitUrl:
    host: str
    owner: str
    repo: str


@dataclass(frozen=True)
class RemoteTarget:
    fetch_url: str
    push_urls: tuple[str, ...] = ()


@dataclass(frozen=True)
class RepoRemotePolicy:
    clone_url: str
    origin: RemoteTarget
    extra_remotes: dict[str, RemoteTarget] = field(default_factory=dict)
    push_default: str | None = None


def parse_git_url(url: str) -> ParsedGitUrl | None:
    for pattern in _GIT_URL_PATTERNS:
        match = pattern.match(url.strip())
        if match:
            return ParsedGitUrl(
                host=match.group("host"),
                owner=match.group("owner"),
                repo=match.group("repo"),
            )
    return None


def repo_url_matches(url: str, owner: str, repo_name: str) -> bool:
    parsed = parse_git_url(url)
    return parsed is not None and parsed.owner == owner and parsed.repo == repo_name


def personal_github_url(owner: str, repo_name: str, github_host_alias: str) -> str:
    return f"git@{github_host_alias}:{owner}/{repo_name}.git"


def personal_codeberg_url(owner: str, repo_name: str, codeberg_host_alias: str) -> str:
    return f"git@{codeberg_host_alias}:{owner}/{repo_name}.git"


def build_repo_remote_policy(
    repo_name: str,
    *,
    owner: str,
    github_host_alias: str,
    codeberg_host_alias: str,
    openclaw_upstream_url: str = "https://github.com/openclaw/openclaw.git",
) -> RepoRemotePolicy:
    github_url = personal_github_url(owner, repo_name, github_host_alias)
    codeberg_url = personal_codeberg_url(owner, repo_name, codeberg_host_alias)

    if repo_name == "openclaw":
        return RepoRemotePolicy(
            clone_url=openclaw_upstream_url,
            origin=RemoteTarget(fetch_url=openclaw_upstream_url),
            extra_remotes={"fork": RemoteTarget(fetch_url=github_url, push_urls=(github_url,))},
            push_default="fork",
        )

    return RepoRemotePolicy(
        clone_url=github_url,
        origin=RemoteTarget(fetch_url=github_url, push_urls=(github_url, codeberg_url)),
    )


def list_git_remotes(repo_path: str | Path) -> list[str]:
    raw = run_or_throw(["git", "-C", str(repo_path), "remote"], quiet=True)
    return [line.strip() for line in raw.splitlines() if line.strip()]


def get_remote_urls(
    repo_path: str | Path, remote_name: str = "origin"
) -> tuple[str, list[str]] | None:
    repo = str(repo_path)
    try:
        fetch_url = run_or_throw(
            ["git", "-C", repo, "remote", "get-url", remote_name], quiet=True
        )
        push_raw = run_or_throw(
            ["git", "-C", repo, "remote", "get-url", "--push", "--all", remote_name],
            quiet=True,
        )
    except RuntimeError:
        return None

    push_urls = [line.strip() for line in push_raw.splitlines() if line.strip()]
    return fetch_url, push_urls


def get_remote_push_default(repo_path: str | Path) -> str | None:
    result = subprocess.run(
        ["git", "-C", str(repo_path), "config", "--get", "remote.pushDefault"],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        return None

    value = result.stdout.strip()
    return value or None


def apply_remote_target(repo_path: str | Path, remote_name: str, target: RemoteTarget) -> None:
    repo = str(repo_path)
    remotes = set(list_git_remotes(repo))

    if remote_name not in remotes:
        run_or_throw(
            ["git", "-C", repo, "remote", "add", remote_name, target.fetch_url],
            quiet=True,
        )

    run_or_throw(
        ["git", "-C", repo, "remote", "set-url", remote_name, target.fetch_url],
        quiet=True,
    )

    subprocess.run(
        ["git", "-C", repo, "config", "--unset-all", f"remote.{remote_name}.pushurl"],
        capture_output=True,
        text=True,
    )

    for push_url in target.push_urls:
        run_or_throw(
            [
                "git",
                "-C",
                repo,
                "remote",
                "set-url",
                "--add",
                "--push",
                remote_name,
                push_url,
            ],
            quiet=True,
        )


def apply_repo_remote_policy(repo_path: str | Path, policy: RepoRemotePolicy) -> None:
    repo = str(repo_path)

    apply_remote_target(repo, "origin", policy.origin)
    for remote_name, target in policy.extra_remotes.items():
        apply_remote_target(repo, remote_name, target)

    if policy.push_default:
        run_or_throw(
            ["git", "-C", repo, "config", "remote.pushDefault", policy.push_default],
            quiet=True,
        )
        return

    subprocess.run(
        ["git", "-C", repo, "config", "--unset", "remote.pushDefault"],
        capture_output=True,
        text=True,
    )
