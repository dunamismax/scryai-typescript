from __future__ import annotations

from scripts.tasks.audit_openclaw_docs import PathReference, _is_soft_missing_path


def test_application_probe_paths_are_soft_missing() -> None:
    ref = PathReference(
        token="/Applications/Blender.app/Contents/MacOS/Blender",
        line="- `/Applications/Blender.app/Contents/MacOS/Blender --version | head -n1`",
    )

    assert _is_soft_missing_path(ref) is True
