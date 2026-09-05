import { describe, expect, it } from "vitest";

import {
  type EvidenceResult,
  evidenceError,
  evidenceSetupRequired,
  evidenceSuccess,
} from "../../src/contracts/evidence.js";

const provenance = {
  source: "codex-seo",
  collectedAt: "2026-09-06T00:00:00.000Z",
};

describe("evidence envelopes", () => {
  it("creates a JSON-serializable success envelope with stable metadata", () => {
    const result = evidenceSuccess(
      { title: "Codex SEO" },
      { provenance, warnings: ["The page was served from cache."] },
    );

    expect(result).toEqual({
      schemaVersion: "0.1",
      status: "success",
      data: { title: "Codex SEO" },
      warnings: ["The page was served from cache."],
      provenance,
    });
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
  });

  it("creates a JSON-serializable error envelope with only a stable public error", () => {
    const result: EvidenceResult<never> = evidenceError(
      {
        code: "FETCH_FAILED",
        message: "The public page could not be fetched.",
      },
      { provenance },
    );

    expect(result).toEqual({
      schemaVersion: "0.1",
      status: "error",
      data: null,
      warnings: [],
      provenance,
      error: {
        code: "FETCH_FAILED",
        message: "The public page could not be fetched.",
      },
    });
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
    expect(result).not.toHaveProperty("cause");
    expect(result.error).not.toHaveProperty("stack");
  });

  it("creates a JSON-serializable setup-required envelope with explicit requirements", () => {
    const result = evidenceSetupRequired(
      [
        {
          id: "google-search-console",
          description:
            "Connect Google Search Console before running this audit.",
        },
      ],
      { provenance, warnings: ["No Google credentials were used."] },
    );

    expect(result).toEqual({
      schemaVersion: "0.1",
      status: "setup_required",
      data: null,
      warnings: ["No Google credentials were used."],
      provenance,
      setupRequirements: [
        {
          id: "google-search-console",
          description:
            "Connect Google Search Console before running this audit.",
        },
      ],
    });
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
  });

  it("redacts secrets from public error messages", () => {
    const result = evidenceError(
      {
        code: "UPSTREAM_FAILURE",
        message:
          "Bearer eyJhbGciOiJIUzI1NiJ9.very-secret; request to https://client:password@example.com/audit?token=query-secret failed.",
      },
      { provenance },
    );

    expect(result.error.message).toBe(
      "Bearer [REDACTED]; request to https://[REDACTED]@example.com/audit?token=[REDACTED] failed.",
    );
    expect(result.error.message).not.toContain("very-secret");
    expect(result.error.message).not.toContain("password");
    expect(result.error.message).not.toContain("query-secret");
  });

  it("sanitizes error codes, messages, warnings, and provenance", () => {
    const result = evidenceError(
      {
        code: "Authorization: Basic basic-code-secret",
        message:
          "Bearer bearer-message-secret; upstream returned https://user:password@example.com/audit?access_token=message-token.",
      },
      {
        provenance: {
          ...provenance,
          requestUrl:
            "https://client:credential@example.com/audit?api_key=provenance-key",
        },
        warnings: ["Cookie: session=warning-cookie; preference=dark"],
      },
    );

    expect(result).toMatchObject({
      error: {
        code: "Authorization: Basic [REDACTED]",
        message:
          "Bearer [REDACTED]; upstream returned https://[REDACTED]@example.com/audit?access_token=[REDACTED].",
      },
      warnings: ["Cookie: [REDACTED]"],
      provenance: {
        requestUrl: "https://[REDACTED]@example.com/audit?api_key=[REDACTED]",
      },
    });
  });

  it("sanitizes setup requirements and nested success data without changing JSON types", () => {
    const setup = evidenceSetupRequired(
      [
        {
          id: "provider?token=setup-token",
          description:
            "Use https://setup-user:setup-password@example.com/connect?api_key=setup-key.",
        },
      ],
      { provenance },
    );
    const success = evidenceSuccess(
      {
        headers: {
          authorization: "Authorization: Basic nested-basic-secret",
          cookie: "Cookie: nested-cookie-secret",
        },
        links: [
          "https://example.com/audit?access_token=nested-token",
          { diagnostic: "Bearer nested-bearer-secret" },
        ],
        attempts: 3,
        complete: true,
      },
      { provenance },
    );

    expect(setup.setupRequirements).toEqual([
      {
        id: "provider?token=[REDACTED]",
        description:
          "Use https://[REDACTED]@example.com/connect?api_key=[REDACTED].",
      },
    ]);
    expect(success.data).toEqual({
      headers: {
        authorization: "[REDACTED]",
        cookie: "[REDACTED]",
      },
      links: [
        "https://example.com/audit?access_token=[REDACTED]",
        { diagnostic: "Bearer [REDACTED]" },
      ],
      attempts: 3,
      complete: true,
    });
    expect(JSON.parse(JSON.stringify(success))).toEqual(success);
  });

  it("redacts sensitive nested keys in every public envelope", () => {
    const success = evidenceSuccess(
      {
        apiKey: "camel-api-key",
        access_token: "snake-access-token",
        nested: {
          clientSecret: "camel-client-secret",
          password: "nested-password",
        },
      },
      { provenance },
    );
    const error = evidenceError(
      {
        code: "UPSTREAM_FAILURE token=error-code-token",
        message: "The upstream returned api_key=error-message-key.",
      },
      {
        provenance: {
          ...provenance,
          connection: { authorization: "nested-authorization" },
          client_secret: "provenance-client-secret",
        },
        warnings: ["password=warning-password"],
      },
    );

    expect(success.data).toEqual({
      apiKey: "[REDACTED]",
      access_token: "[REDACTED]",
      nested: {
        clientSecret: "[REDACTED]",
        password: "[REDACTED]",
      },
    });
    expect(error).toMatchObject({
      error: {
        code: "UPSTREAM_FAILURE token=[REDACTED]",
        message: "The upstream returned api_key=[REDACTED].",
      },
      warnings: ["password=[REDACTED]"],
      provenance: {
        connection: { authorization: "[REDACTED]" },
        client_secret: "[REDACTED]",
      },
    });
    expect(JSON.stringify({ success, error })).not.toMatch(
      /camel-api-key|snake-access-token|camel-client-secret|nested-password|error-code-token|error-message-key|warning-password|nested-authorization|provenance-client-secret/,
    );
  });
});
