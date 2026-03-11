"""Safely inspect and normalize git remote policies under ~/github."""

from __future__ import annotations

import sys
from dataclasses import dataclass
from pathlib import Path

from scripts.common import is_git_repo, log_step
from scripts.remote_policy import (
    apply_repo_remote_policy,
    build_repo_remote_policy,
    get_remote_push_default,
    get_remote_urls,
    list_git_remotes,
    repo_url_matches,
)

DEFAULTS = {
    "root": str(Path.home() / "github"),
    "owner": "dunamismax",
    "gh_alias": "github.com-dunamismax",
    "cb_alias": "codeberg.org-dunamismax",
    "openclaw_upstream_url": "https://github.com/openclaw/openclaw.git",
}


@dataclass
class RepoResult:
    name: str
    status: str  # "ok" | "todo" | "skip" | "fixed" | "error"
    detail: str = ""


def _is_correct(fetch_url: str, push_urls: list[str], gh_url: str, cb_url: str) -> bool:
    if fetch_url != gh_url:
        return False
    if len(push_urls) != 2:
        return False
    return push_urls[0] == gh_url and push_urls[1] == cb_url


def _custom_topology_reason(repo_path: str, repo_name: str, fetch_url: str) -> str | None:
    remotes = sorted(list_git_remotes(repo_path))
    push_default = get_remote_push_default(repo_path)

    if push_default and push_default != "origin":
        return f"custom pushDefault={push_default}"

    extra_remotes = [remote for remote in remotes if remote != "origin"]
    if extra_remotes:
        return f"custom remotes: {', '.join(extra_remotes)}"

    if not repo_url_matches(fetch_url, DEFAULTS["owner"], repo_name):
        return f"origin fetch preserved: {fetch_url}"

    return None


def _process_repo(repo_path: str, fix: bool) -> RepoResult:
    name = Path(repo_path).name

    if not is_git_repo(repo_path):
        return RepoResult(name, "skip", "not a git repo")

    urls = get_remote_urls(repo_path)
    if urls is None:
        return RepoResult(name, "skip", "no origin remote")

    fetch_url, push_urls = urls
    policy = build_repo_remote_policy(
        name,
        owner=DEFAULTS["owner"],
        github_host_alias=DEFAULTS["gh_alias"],
        codeberg_host_alias=DEFAULTS["cb_alias"],
        openclaw_upstream_url=DEFAULTS["openclaw_upstream_url"],
    )
    custom_reason = _custom_topology_reason(repo_path, name, fetch_url)

    if len(policy.origin.push_urls) == 2:
        gh_url, cb_url = policy.origin.push_urls
        if _is_correct(fetch_url, push_urls, policy.origin.fetch_url, cb_url):
            return RepoResult(name, "ok")

        if custom_reason is not None:
            return RepoResult(name, "skip", custom_reason)

        if not fix:
            issues: list[str] = []
            if fetch_url != policy.origin.fetch_url:
                issues.append(f"fetch: {fetch_url} (want {policy.origin.fetch_url})")
            if len(push_urls) != 2:
                issues.append(f"push url count: {len(push_urls)} (want 2)")
            else:
                if push_urls[0] != gh_url:
                    issues.append(f"push[0]: {push_urls[0]} (want {gh_url})")
                if push_urls[1] != cb_url:
                    issues.append(f"push[1]: {push_urls[1]} (want {cb_url})")
            return RepoResult(name, "todo", "; ".join(issues))

        try:
            apply_repo_remote_policy(repo_path, policy)
            return RepoResult(name, "fixed")
        except RuntimeError as exc:
            return RepoResult(name, "error", str(exc))

    return RepoResult(name, "skip", custom_reason or "non-mirror policy repo")


def _discover_repos(root: str) -> list[str]:
    root_path = Path(root)
    return sorted(
        str(path)
        for path in root_path.iterdir()
        if path.is_dir() and not path.name.startswith(".")
    )


def sync_remotes() -> None:
    fix = "--fix" in sys.argv
    root = DEFAULTS["root"]

    log_step(
        "Syncing managed mirror remotes (fix mode)"
        if fix
        else "Checking managed mirror remotes (dry run — pass --fix to apply)"
    )

    print(f"  root:     {root}")
    print(f"  owner:    {DEFAULTS['owner']}")
    print(f"  github:   {DEFAULTS['gh_alias']}")
    print(f"  codeberg: {DEFAULTS['cb_alias']}")

    repos = _discover_repos(root)
    results = [_process_repo(repo, fix) for repo in repos]

    print()

    ok = [result for result in results if result.status == "ok"]
    todo = [result for result in results if result.status == "todo"]
    fixed = [result for result in results if result.status == "fixed"]
    skipped = [result for result in results if result.status == "skip"]
    errors = [result for result in results if result.status == "error"]

    for result in ok:
        print(f"  [ok]    {result.name}")
    for result in todo:
        print(f"  [todo]  {result.name} — {result.detail}")
    for result in fixed:
        print(f"  [fixed] {result.name}")
    for result in skipped:
        print(f"  [skip]  {result.name} — {result.detail}")
    for result in errors:
        print(f"  [error] {result.name} — {result.detail}")

    print(
        f"\n  ok={len(ok)} todo={len(todo)} fixed={len(fixed)} skipped={len(skipped)} errors={len(errors)}"
    )

    if errors:
        sys.exit(1)
