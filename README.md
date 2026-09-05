# Codex SEO

**Evidence-backed SEO workflows for Codex.**

Codex SEO is a native [Codex](https://openai.com/codex/) plugin foundation for
building SEO workflows that return structured, reviewable evidence instead of
opaque conclusions. It is being rebuilt as a TypeScript-first project with
clear contracts for data, provenance, warnings, and failures.

> [!NOTE]
> This is an early `0.0.1` foundation, not yet an end-user SEO toolkit. There
> are no installable commands, published packages, or release binaries today.

## What is here

- Native Codex plugin metadata and a quality-gated development baseline.
- A versioned evidence envelope for consistent success, error, and
  setup-required results.
- Public-output sanitization that redacts credentials and sensitive values.
- A documented, intentional path for porting legacy capabilities—without
  copying their scripts wholesale.

## Install

Codex SEO is not yet published in a Codex plugin marketplace and does not ship
an end-user command surface. To work with the current foundation, clone the
repository and use the local development setup below:

```bash
git clone https://github.com/shivanshsen7/codex-seo.git
cd codex-seo
```

> [!IMPORTANT]
> A marketplace installation command will be added when the plugin has a
> supported, usable release. Until then, the repository is for development and
> evaluation only.

## Direction

New plugin-facing work is written in TypeScript on Node.js. Python currently
remains only for the plugin-manifest check; it is not the runtime for new
production workflows. A Go component is considered only if a measured Common
Crawl workload demonstrates a focused need. See the
[runtime decision](docs/adr/0001-typescript-default-go-graduation.md) and the
[legacy capability inventory](docs/legacy-script-inventory.md) for the full
context.

## Develop locally

Requirements: Node.js `24.20.0`, pnpm `11.24.0`, and Python `3.11+` with
[`uv`](https://docs.astral.sh/uv/).

```bash
# TypeScript contracts and quality checks
pnpm install --frozen-lockfile
pnpm check

# Plugin-manifest quality checks
uv sync --locked --dev
uv run pytest
uv run ruff check .
uv run ruff format --check .
```

## Project shape

| Path | Purpose |
| --- | --- |
| `.codex-plugin/plugin.json` | Native plugin manifest |
| `src/contracts/` | Shared, sanitized evidence contracts |
| `test/` | TypeScript contract and manifest tests |
| `tests/` | Existing Python manifest test |
| `docs/adr/` | Architecture decisions |

## Principles

Codex SEO is designed to make every workflow traceable: preserve the source
and collection context, distinguish setup gaps from operational failures, and
never expose credentials in public output. Each future capability must define
its command or skill interface, structured output, credential-free behavior,
URL policy where relevant, and tests before implementation.
