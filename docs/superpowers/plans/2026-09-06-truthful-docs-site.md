# Truthful Codex SEO Documentation Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a static Blume documentation site that accurately describes the current Codex SEO plugin baseline.

**Architecture:** Blume reads a dedicated `site/` Markdown tree and emits static assets to `dist/`. A filesystem-backed Vitest contract verifies that the site states its actual `0.0.1` availability and never invents installation, use, or skills. A separate GitHub Pages workflow builds that same locked pnpm workspace and deploys only its generated `dist/` artifact.

**Tech Stack:** Blume, TypeScript, Vitest, pnpm, GitHub Actions, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-06-truthful-docs-site-design.md`

## Global Constraints

- Publish a static GitHub Pages project site under `/codex-seo/`.
- Use `https://shivanshsen7.github.io` as the Blume deployment origin and
  `/codex-seo` as its base path, producing the canonical site URL
  `https://shivanshsen7.github.io/codex-seo`.
- Document only the `0.0.1` manifest, evidence-envelope contract, and development-quality foundation.
- State that no end-user skills, commands, or installation path are available; do not create speculative commands or examples.
- Do not implement an SEO skill, installer, command, package publication, binary, release asset, runtime service, analytics, form, or credential flow.
- Preserve the existing TypeScript quality workflow and keep all validation offline.

---

## File structure

- `blume.config.ts` — static site metadata, dedicated content root, theme, repository links, and GitHub Pages deployment URL/base.
- `site/index.md` — product overview and current availability.
- `site/skills.md` — shipped-skill status, represented as an explicit empty state.
- `site/install.md` — truthful installation availability statement.
- `site/use.md` — truthful usage availability statement and the distinction between a foundation and a workflow.
- `site/reference/evidence.md` — reader-facing summary of the public evidence envelope.
- `test/docs-site.test.ts` — regression contract for the configuration and reader-visible availability claims.
- `.github/workflows/pages.yml` — repository-owned static build, artifact upload, and GitHub Pages deployment.
- `test/pages-workflow.test.ts` — regression contract for the Pages workflow's build and artifact behavior.
- `package.json` and `pnpm-lock.yaml` — Blume dependency and local docs scripts.
- `.gitignore` — generated Blume output ignored without hiding authored content.

## Task 1: Create the truthful static documentation build

**Files:**
- Create: `test/docs-site.test.ts`
- Create: `blume.config.ts`
- Create: `site/index.md`
- Create: `site/skills.md`
- Create: `site/install.md`
- Create: `site/use.md`
- Create: `site/reference/evidence.md`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: `.codex-plugin/plugin.json` version and skill-directory declaration; `src/contracts/evidence.ts` public result vocabulary.
- Produces: `pnpm docs:dev`, `pnpm docs:build`, and a static `dist/` whose links work from `/codex-seo/`.

- [ ] **Step 1: Write the failing documentation contract test**

```ts
import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

const readProjectFile = (path: string) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

describe("published documentation baseline", () => {
  it("uses the GitHub Pages project URL and a dedicated content tree", async () => {
    const config = await readProjectFile("blume.config.ts");

    expect(config).toContain('root: "site"');
    expect(config).toContain('base: "/codex-seo"');
    expect(config).toContain(
      'site: "https://shivanshsen7.github.io/codex-seo"',
    );
  });

  it("does not claim that skills, installation, or usage are available", async () => {
    const [overview, skills, install, use] = await Promise.all([
      readProjectFile("site/index.md"),
      readProjectFile("site/skills.md"),
      readProjectFile("site/install.md"),
      readProjectFile("site/use.md"),
    ]);

    expect(overview).toContain("0.0.1");
    expect(skills).toContain("No skills have shipped yet.");
    expect(install).toContain("There is no end-user installation path in 0.0.1.");
    expect(use).toContain("There is no runnable SEO command or skill in 0.0.1.");
  });
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `pnpm test -- test/docs-site.test.ts`

Expected: FAIL with `ENOENT` for `blume.config.ts` or one of the new `site/` pages.

- [ ] **Step 3: Add the Blume dependency and documentation scripts**

Update `package.json` with the exact scripts and development dependency:

```json
{
  "scripts": {
    "docs:dev": "blume dev",
    "docs:build": "blume build"
  },
  "devDependencies": {
    "blume": "^1.6.0"
  }
}
```

Run `pnpm install` to update `pnpm-lock.yaml`. Add `.blume/` and `dist/` to
`.gitignore` if they are not already ignored.

- [ ] **Step 4: Add the site configuration**

Create `blume.config.ts`:

```ts
import { defineConfig } from "blume";

export default defineConfig({
  title: "Codex SEO",
  description: "Evidence-backed SEO workflows for Codex.",
  content: { root: "site" },
  github: { owner: "shivanshsen7", repo: "codex-seo" },
  theme: { accent: "teal", mode: "system", radius: "md" },
  ai: { llmsTxt: true },
  deployment: {
    output: "static",
    base: "/codex-seo",
    site: "https://shivanshsen7.github.io",
  },
});
```

- [ ] **Step 5: Add only the approved reader content**

Create the five Markdown pages with titles and frontmatter. Use the exact
availability sentences tested above. The overview describes Codex SEO as a
native plugin for evidence-backed workflows; the skills, install, and use
pages state their unavailable status without suggesting commands. The evidence
reference explains `schemaVersion`, `status`, `data`, `warnings`,
`provenance`, `error`, and `setupRequirements` as the contract used by future
capabilities, with no claim that a reader can invoke it today.

- [ ] **Step 6: Run the focused test to verify it passes**

Run: `pnpm test -- test/docs-site.test.ts`

Expected: PASS with two documentation baseline assertions.

- [ ] **Step 7: Build the static site and inspect the generated routes**

Run: `pnpm docs:build && test -f dist/index.html && test -f dist/skills/index.html && test -f dist/install/index.html && test -f dist/use/index.html && test -f dist/reference/evidence/index.html && test -f dist/llms.txt && test -f dist/sitemap.xml`

Expected: exit code 0; all five routes and Blume's AI/SEO outputs exist.

- [ ] **Step 8: Run the complete TypeScript quality suite**

Run: `pnpm check`

Expected: PASS for lint, formatting, strict type checking, and all Vitest tests.

- [ ] **Step 9: Commit the docs build**

```bash
git add .gitignore blume.config.ts package.json pnpm-lock.yaml site test/docs-site.test.ts
git commit -m "feat: add truthful Codex SEO docs site"
```

## Task 2: Deploy the verified static build to GitHub Pages

**Files:**
- Create: `test/pages-workflow.test.ts`
- Create: `.github/workflows/pages.yml`

**Interfaces:**
- Consumes: the `docs:build` script from Task 1 and its `dist/` output.
- Produces: a GitHub Pages deployment workflow triggered by pushes to `main` and manual dispatch.

- [ ] **Step 1: Write the failing Pages-workflow contract test**

```ts
import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

describe("GitHub Pages workflow", () => {
  it("builds the static docs artifact from main", async () => {
    const workflow = await readFile(
      new URL("../.github/workflows/pages.yml", import.meta.url),
      "utf8",
    );

    expect(workflow).toContain("workflow_dispatch:");
    expect(workflow).toContain("branches: [main]");
    expect(workflow).toContain("pnpm install --frozen-lockfile");
    expect(workflow).toContain("pnpm docs:build");
    expect(workflow).toContain("path: dist");
    expect(workflow).toContain("actions/deploy-pages");
  });
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `pnpm test -- test/pages-workflow.test.ts`

Expected: FAIL with `ENOENT` for `.github/workflows/pages.yml`.

- [ ] **Step 3: Add the Pages workflow**

Create `.github/workflows/pages.yml` with the pinned action flow below:

```yaml
name: Deploy documentation

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: pnpm/action-setup@v4
        with:
          version: 11.24.0
      - uses: actions/setup-node@v6
        with:
          node-version-file: .node-version
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm docs:build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `pnpm test -- test/pages-workflow.test.ts`

Expected: PASS with the GitHub Pages workflow assertion.

- [ ] **Step 5: Run full validation**

Run: `pnpm check && pnpm docs:build && git diff --check`

Expected: PASS and no whitespace errors.

- [ ] **Step 6: Commit the deployment workflow**

```bash
git add .github/workflows/pages.yml test/pages-workflow.test.ts
git commit -m "ci: deploy docs to GitHub Pages"
```

## Final verification

- [ ] Confirm `git status --short` is empty after the two commits.
- [ ] Confirm the Pages workflow is visible in the remote repository after the branch is pushed and merged to `main`.
- [ ] Confirm the public site renders at `https://shivanshsen7.github.io/codex-seo/` only after GitHub Pages has been enabled for the repository and the deployment has completed.
