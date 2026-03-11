from __future__ import annotations

import hashlib
import json
import tarfile
from pathlib import Path

import pytest

from scripts.crypto import encrypt
from scripts.tasks.verify_config_backup import CONFIG_FORMAT, verify_config_backup


def _write_encrypted_backup(
    repo_root: Path,
    source_root: Path,
    *,
    passphrase: str,
    included_paths: list[str],
    encrypted_sha256: str | None = None,
) -> None:
    vault_dir = repo_root / "vault" / "config"
    vault_dir.mkdir(parents=True, exist_ok=True)

    tar_path = vault_dir / "critical-configs.tar"
    with tarfile.open(tar_path, "w") as archive:
        for rel_path in included_paths:
            archive.add(source_root / rel_path, arcname=rel_path)

    payload = encrypt(tar_path.read_bytes(), passphrase, CONFIG_FORMAT)
    encrypted_file = vault_dir / "critical-configs.tar.enc"
    encrypted_file.write_bytes(payload)
    tar_path.unlink()

    metadata = {
        "includedPaths": included_paths,
        "encryptedBackupSha256": encrypted_sha256 or hashlib.sha256(payload).hexdigest(),
        "sourceFingerprint": "test-fingerprint",
    }
    (vault_dir / "critical-configs.meta.json").write_text(json.dumps(metadata))


def test_verify_config_backup_uses_metadata_included_paths(
    monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    repo_root = tmp_path / "repo"
    repo_root.mkdir()
    source_root = tmp_path / "source"
    source_root.mkdir()

    rel_path = ".openclaw/openclaw.json"
    target = source_root / rel_path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text('{"ok":true}\n')

    passphrase = "correct horse battery"
    _write_encrypted_backup(
        repo_root,
        source_root,
        passphrase=passphrase,
        included_paths=[rel_path],
    )

    monkeypatch.chdir(repo_root)
    monkeypatch.setenv("SCRY_CONFIG_BACKUP_PASSPHRASE", passphrase)

    verify_config_backup()


def test_verify_config_backup_rejects_sha_mismatch(
    monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    repo_root = tmp_path / "repo"
    repo_root.mkdir()
    source_root = tmp_path / "source"
    source_root.mkdir()

    rel_path = ".openclaw/openclaw.json"
    target = source_root / rel_path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text('{"ok":true}\n')

    passphrase = "correct horse battery"
    _write_encrypted_backup(
        repo_root,
        source_root,
        passphrase=passphrase,
        included_paths=[rel_path],
        encrypted_sha256="0" * 64,
    )

    monkeypatch.chdir(repo_root)
    monkeypatch.setenv("SCRY_CONFIG_BACKUP_PASSPHRASE", passphrase)

    with pytest.raises(RuntimeError, match="SHA-256"):
        verify_config_backup()
