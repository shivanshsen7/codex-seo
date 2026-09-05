# Codex SEO

Codex SEO is a native Codex plugin for evidence-backed SEO workflows.

## Status

`0.0.1` is the plugin baseline. It establishes the native plugin manifest,
quality gates, a TypeScript-first runtime boundary, and a versioned parity path
from `codex-seo-legacy`. It does not yet provide end-user SEO commands,
installers, published binaries, or NPM packages.

## Development

```bash
uv sync --locked --dev
uv run pytest
uv run ruff check .
uv run ruff format --check .

pnpm install --frozen-lockfile
pnpm check
```

New plugin-facing capabilities are TypeScript/Node implementations. The
`uv` environment remains only for the current manifest-quality check; it is
not a basis for new production Python scripts. Go is deferred until the
Common Crawl workload meets the measured graduation criteria in
`docs/adr/0001-typescript-default-go-graduation.md`.
