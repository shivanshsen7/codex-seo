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
