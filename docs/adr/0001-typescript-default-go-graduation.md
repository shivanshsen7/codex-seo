# ADR 0001: TypeScript default; Go only after a measured graduation decision

- Status: Accepted
- Date: 2026-09-06
- Related: [#25](https://github.com/shivanshsen7/codex-seo/issues/25), [#26](https://github.com/shivanshsen7/codex-seo/issues/26), [#28](https://github.com/shivanshsen7/codex-seo/issues/28), [#29](https://github.com/shivanshsen7/codex-seo/issues/29), [#30](https://github.com/shivanshsen7/codex-seo/issues/30)

## Decision

TypeScript running on Node.js is the default runtime for all new plugin-facing
commands, API adapters, evidence shaping, HTML analysis, and browser-backed
workflows. It is the shared implementation boundary for native Codex skills.

`uv` and the existing Python project remain temporary quality tooling only for
the plugin-manifest validator and its tests. They do not authorize new
production Python scripts. That validator may be migrated deliberately in a
future decision.

Go is not a second default runtime. It may be introduced only if the measured
Common Crawl workload in [#30](https://github.com/shivanshsen7/codex-seo/issues/30)
shows that a focused local scan or streaming workload cannot meet an agreed
TypeScript implementation target. The graduation decision must record the
representative input, measurement method and results, target that was missed,
and the cross-platform build, test, and maintenance cost. A Go component must
remain a single-purpose internal implementation behind the same structured
evidence contract; it is not a reason to create a general binary platform.

Rust is excluded unless a later ADR presents a concrete, measured need that Go
and TypeScript cannot satisfy.

## Consequences

- [#26](https://github.com/shivanshsen7/codex-seo/issues/26) establishes the
  locked TypeScript workspace and its CI quality gates.
- [#28](https://github.com/shivanshsen7/codex-seo/issues/28) defines the
  common command and evidence contract used by each runtime.
- [#29](https://github.com/shivanshsen7/codex-seo/issues/29) implements the
  shared TypeScript public-URL security boundary before URL-aware ports.
- [#25](https://github.com/shivanshsen7/codex-seo/issues/25) tracks this
  architecture decision and governs later port work.

For the entire `0.0.x` line, NPM publishing, GitHub Release assets,
end-user installers, download scripts, and distributed binaries are explicitly
out of scope. The repository can use a Node package manager for development
without publishing a package.
