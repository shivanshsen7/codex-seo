import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

describe("plugin manifest", () => {
  it("declares the initial native Codex plugin contract", async () => {
    const source = await readFile(
      new URL("../.codex-plugin/plugin.json", import.meta.url),
      "utf8",
    );
    const manifest: unknown = JSON.parse(source);

    expect(manifest).toMatchObject({
      name: "codex-seo",
      version: "0.0.1",
      skills: "./skills/",
    });
    expect(manifest).not.toHaveProperty("hooks");
  });
});
