import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_manifest_declares_the_initial_semantic_version() -> None:
    manifest = json.loads((ROOT / ".codex-plugin" / "plugin.json").read_text())

    assert manifest["name"] == "codex-seo"
    assert manifest["version"] == "0.0.1"
    assert manifest["skills"] == "./skills/"
    assert "hooks" not in manifest
