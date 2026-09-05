# Codex SEO truthful documentation site

## Purpose

Publish a GitHub Pages documentation site for Codex SEO that helps readers
understand what the plugin is, which skills are actually available, and how to
install and use it when that becomes possible. The first release must not
present planned SEO capabilities as shipped features.

## Current-product boundary

The repository at `0.0.1` provides:

- a native Codex plugin manifest;
- the TypeScript evidence-envelope contract; and
- development quality checks.

It does not provide end-user SEO skills, commands, installers, published
packages, or distributed binaries. The `skills/` directory is empty. The site
must represent this as an availability state, not as a setup failure.

## Reader experience

The site is a static Blume documentation site, served as a GitHub Pages project
site under `/codex-seo/`. Readers land on a concise product overview followed
immediately by the current availability statement. Navigation contains:

1. **Overview** — the product purpose and evidence-backed workflow principle.
2. **Skills** — an explicit empty state: no skills have shipped in `0.0.1`.
3. **Install** — an explicit unavailable state: no end-user installation path
   exists in `0.0.1`; readers are directed to watch the repository rather than
   being given speculative commands.
4. **Use** — an explicit unavailable state: no runnable SEO command or skill
   is present; the evidence-result model is explained as a technical foundation,
   not as a usable audit feature.
5. **Reference** — the evidence envelope, including success, error, warning,
   provenance, and setup-required outcomes.

The site has no roadmap, fake examples, release promises, forms, analytics,
server endpoints, or credentials. Its search, sitemap, raw Markdown pages,
and AI-readable indexes come from Blume's static build.

## Implementation

- Add Blume as the documentation build dependency and scripts for local preview
  and static production build.
- Add `blume.config.ts` with title, description, project-site base
  `/codex-seo`, and canonical GitHub Pages URL
  `https://shivanshsen7.github.io/codex-seo`.
- Add Markdown content pages in a dedicated documentation directory. Each page
  is sourced from the repository's manifest, README, and evidence contract.
- Add a GitHub Actions Pages workflow that installs the locked pnpm workspace,
  builds the static site, uploads `dist/`, and deploys through GitHub Pages.
- Keep existing TypeScript quality checks intact.

## Failure handling

The build fails on invalid Blume configuration or Markdown. The Pages job does
not deploy if the docs build fails. No runtime feature requires a secret or
external service.

## Validation

- A new documentation-content test asserts the published claims: version
  `0.0.1`, absence of shipped skills, absence of installation and usage paths,
  and the canonical documentation URL/base path.
- The test is written first and observed failing before content/configuration is
  added.
- `pnpm check` and the static Blume build both pass.
- The generated output contains the expected pages and files for the project
  subpath.

## Non-goals

- Implementing an SEO skill, installer, or command.
- Publishing packages, binaries, or release assets.
- Claiming that a user can install or use a capability which is not present.
