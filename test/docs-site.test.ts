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
    expect(install).toContain(
      "There is no end-user installation path in 0.0.1.",
    );
    expect(use).toContain(
      "There is no runnable SEO command or skill in 0.0.1.",
    );
  });
});
