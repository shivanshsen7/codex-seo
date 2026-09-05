# Codex SEO

Codex SEO is a native Codex plugin for evidence-backed SEO workflows.

## Status

`0.0.1` is the plugin baseline. It establishes the native plugin manifest,
quality gates, and a versioned parity path from `codex-seo-legacy`. It does not
yet provide end-user SEO commands, installers, published binaries, or NPM
packages.

## Development

```bash
uv sync --locked --dev
uv run pytest
uv run ruff check .
uv run ruff format --check .
```
