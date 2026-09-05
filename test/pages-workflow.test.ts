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
