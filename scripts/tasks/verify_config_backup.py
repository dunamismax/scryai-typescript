"""Verify encrypted config backup can be decrypted and matches recorded metadata."""

from __future__ import annotations

import hashlib
import json
import os
import shutil
import tempfile
from pathlib import Path

from scripts.common import log_step, run_or_throw
from scripts.crypto import CryptoFormat, decrypt

CONFIG_FORMAT = CryptoFormat(magic="SCRYCFG1")


def _load_metadata(metadata_file: Path) -> dict:
    if not metadata_file.exists():
        raise RuntimeError(f"Config backup metadata file not found: {metadata_file}")

    try:
        metadata = json.loads(metadata_file.read_text())
    except json.JSONDecodeError as exc:
        raise RuntimeError(f"Config backup metadata is invalid JSON: {metadata_file}") from exc

    included_paths = metadata.get("includedPaths")
    if not isinstance(included_paths, list) or not all(
        isinstance(item, str) and item for item in included_paths
    ):
        raise RuntimeError(
            "Config backup metadata is missing a valid includedPaths list."
        )

    return metadata


def verify_config_backup() -> None:
    passphrase = os.environ.get("SCRY_CONFIG_BACKUP_PASSPHRASE", "")
    repo_root = Path.cwd().resolve()
    encrypted_file = Path(
        os.environ.get(
            "SCRY_CONFIG_BACKUP_FILE",
            str(repo_root / "vault" / "config" / "critical-configs.tar.enc"),
        )
    )
    metadata_file = Path(
        os.environ.get(
            "SCRY_CONFIG_METADATA_FILE",
            str(repo_root / "vault" / "config" / "critical-configs.meta.json"),
        )
    )

    log_step("Checking config backup verification prerequisites")

    if len(passphrase) < 16:
        raise RuntimeError(
            "Set SCRY_CONFIG_BACKUP_PASSPHRASE with at least 16 characters before verification."
        )

    if not encrypted_file.exists():
        raise RuntimeError(f"Encrypted backup file not found: {encrypted_file}")

    metadata = _load_metadata(metadata_file)
    encrypted = encrypted_file.read_bytes()
    expected_sha256 = metadata.get("encryptedBackupSha256")
    if expected_sha256:
        actual_sha256 = hashlib.sha256(encrypted).hexdigest()
        if actual_sha256 != expected_sha256:
            raise RuntimeError(
                "Encrypted backup SHA-256 does not match metadata. "
                f"metadata={expected_sha256} actual={actual_sha256}"
            )

    log_step("Decrypting and extracting backup payload to temp workspace")

    temp_dir = Path(tempfile.mkdtemp(prefix="scry-config-verify-"))

    try:
        plaintext = decrypt(encrypted, passphrase, CONFIG_FORMAT)
        tar_path = temp_dir / "critical-configs.tar"
        tar_path.write_bytes(plaintext)

        run_or_throw(["tar", "-xf", str(tar_path), "-C", str(temp_dir)])

        log_step("Validating recorded backup contents")
        missing: list[str] = []
        included_paths = metadata["includedPaths"]

        for rel_path in included_paths:
            abs_path = temp_dir / rel_path
            if not abs_path.exists():
                missing.append(rel_path)

        if missing:
            raise RuntimeError(
                f"Restore preview missing recorded paths: {', '.join(missing)}"
            )

        tar_size = tar_path.stat().st_size

        log_step("Config backup verification passed")
        print(f"artifact: {encrypted_file}")
        print(f"metadata: {metadata_file}")
        print(f"decrypted tar bytes: {tar_size}")
        print(f"recorded backup paths: {len(included_paths)} present")
        print(f"source fingerprint: {metadata.get('sourceFingerprint', 'unknown')}")
        print(f"home reference: {os.environ.get('HOME', str(Path.home()))}")
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)
