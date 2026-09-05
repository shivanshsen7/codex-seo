# TypeScript Runtime Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a locked, strict TypeScript quality foundation for native Codex plugin capabilities while retaining the existing uv manifest check.

**Architecture:** TypeScript and pnpm become the default runtime for new plugin-facing code. The current Python/uv setup remains only for the manifest validator until that validator is deliberately migrated. Go remains issue-only until the measured Common Crawl workload in #30 begins.

**Tech Stack:** Node.js 22 LTS, pnpm, TypeScript, Biome, Vitest, GitHub Actions, uv.

**Spec:** GitHub issues #25, #26, #28, and #29.

## Global Constraints

- Version remains `0.0.1`.
- Do not add production Python scripts.
- Do not add NPM publishing, releases, installers, binaries, or live-network CI tests.
- Keep the uv lock and manifest validation job working.
- All TypeScript must pass strict type checking, Biome, and offline tests.

---

### Task 1: Document the runtime boundary

**Files:**
- Create: `docs/adr/0001-typescript-default-go-graduation.md`

**Interfaces:**
- Produces the runtime decision required by #25 and referenced by later ports.

- [ ] Write the ADR with TypeScript as default, uv as temporary manifest-quality tooling, and Go graduation criteria limited to #30.
- [ ] Link #25, #26, #28, #29, and #30; explicitly exclude Rust, release assets, NPM publishing, and installers from `0.0.x`.

### Task 2: Add the TypeScript quality workspace

**Files:**
- Create: `package.json`
- Create: `pnpm-lock.yaml`
- Create: `tsconfig.json`
- Create: `biome.json`
- Create: `.node-version`
- Modify: `.github/workflows/quality.yml`
- Modify: `.gitignore`

**Interfaces:**
- Produces `pnpm check`, running lint, formatting, strict type checks, and offline tests.

- [ ] Write the failing TypeScript manifest test before creating its implementation helper.
- [ ] Add Node 22 and pnpm configuration with lockfile enforcement.
- [ ] Add Biome and Vitest commands, then make `pnpm check` execute all TypeScript gates.
- [ ] Extend CI with a cached Node/pnpm job while retaining the uv job.

### Task 3: Add the common evidence envelope

**Files:**
- Create: `src/contracts/evidence.ts`
- Create: `test/contracts/evidence.test.ts`
- Create: `test/plugin-manifest.test.ts`

**Interfaces:**
- Produces `EvidenceResult<T>` and `EvidenceError` for future adapters.

- [ ] Write failing tests for success and error envelopes with stable schema version, status, warnings, and provenance.
- [ ] Implement the smallest typed factories that satisfy those tests.
- [ ] Verify outputs stay JSON serializable without secrets.

### Task 4: Verify and record the foundation

**Files:**
- Modify: `README.md`

**Interfaces:**
- Documents exact uv and pnpm verification commands.

- [ ] Run `uv lock --check`, `uv run pytest`, and plugin validation.
- [ ] Run `pnpm install --frozen-lockfile` and `pnpm check`.
- [ ] Update README with both toolchains and the TypeScript-first rule.
- [ ] Commit the foundation without creating a release or publishing package.
