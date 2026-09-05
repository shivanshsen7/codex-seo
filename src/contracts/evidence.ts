export type JsonPrimitive = boolean | null | number | string;

export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface EvidenceProvenance {
  readonly source: string;
  readonly collectedAt: string;
  readonly [field: string]: JsonValue;
}

export interface EvidenceError {
  readonly code: string;
  readonly message: string;
}

export interface EvidenceSetupRequirement {
  readonly id: string;
  readonly description: string;
}

interface EvidenceOptions {
  readonly provenance: EvidenceProvenance;
  readonly warnings?: string[];
}

export interface EvidenceSuccess<T extends JsonValue> {
  readonly schemaVersion: "0.1";
  readonly status: "success";
  readonly data: T;
  readonly warnings: string[];
  readonly provenance: EvidenceProvenance;
}

export interface EvidenceFailure {
  readonly schemaVersion: "0.1";
  readonly status: "error";
  readonly data: null;
  readonly warnings: string[];
  readonly provenance: EvidenceProvenance;
  readonly error: EvidenceError;
}

export interface EvidenceSetupRequired {
  readonly schemaVersion: "0.1";
  readonly status: "setup_required";
  readonly data: null;
  readonly warnings: string[];
  readonly provenance: EvidenceProvenance;
  readonly setupRequirements: EvidenceSetupRequirement[];
}

export type EvidenceResult<T extends JsonValue> =
  | EvidenceFailure
  | EvidenceSetupRequired
  | EvidenceSuccess<T>;

const sensitiveKeys = new Set([
  "apikey",
  "accesstoken",
  "token",
  "authorization",
  "cookie",
  "password",
  "clientsecret",
]);

function isSensitiveKey(key: string): boolean {
  return sensitiveKeys.has(key.replace(/[^a-z\d]/gi, "").toLowerCase());
}

function sanitizePublicString(value: string): string {
  return value
    .replace(/\bbearer\s+[^\s,;]+/gi, "Bearer [REDACTED]")
    .replace(
      /\bauthorization\s*:\s*basic\s+[^\s,;]+/gi,
      "Authorization: Basic [REDACTED]",
    )
    .replace(/\bcookie\s*:\s*[^\r\n]*/gi, "Cookie: [REDACTED]")
    .replace(
      /([a-z][a-z\d+.-]*:\/\/)[^/?#\s@]+(?::[^/?#\s@]*)?@/gi,
      "$1[REDACTED]@",
    )
    .replace(
      /([?&](?:access_token|api_key|token)=)[^&#\s,.;!?)}\]]*/gi,
      "$1[REDACTED]",
    )
    .replace(
      /(\b(?:api[_-]?key|access[_-]?token|token|authorization|cookie|password|client[_-]?secret)\s*=\s*)(?!\[REDACTED\])[^\s,;.&!?)}\]]+/gi,
      "$1[REDACTED]",
    );
}

function sanitizePublicOutput<T>(value: T): T {
  if (typeof value === "string") {
    return sanitizePublicString(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map(sanitizePublicOutput) as T;
  }

  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        isSensitiveKey(key) ? "[REDACTED]" : sanitizePublicOutput(entry),
      ]),
    ) as T;
  }

  return value;
}

export function evidenceSuccess<T extends JsonValue>(
  data: T,
  options: EvidenceOptions,
): EvidenceSuccess<T> {
  return {
    schemaVersion: "0.1",
    status: "success",
    data: sanitizePublicOutput(data),
    warnings: sanitizePublicOutput(options.warnings ?? []),
    provenance: sanitizePublicOutput(options.provenance),
  };
}

export function evidenceError(
  error: EvidenceError,
  options: EvidenceOptions,
): EvidenceFailure {
  return {
    schemaVersion: "0.1",
    status: "error",
    data: null,
    warnings: sanitizePublicOutput(options.warnings ?? []),
    provenance: sanitizePublicOutput(options.provenance),
    error: sanitizePublicOutput(error),
  };
}

export function evidenceSetupRequired(
  setupRequirements: EvidenceSetupRequirement[],
  options: EvidenceOptions,
): EvidenceSetupRequired {
  return {
    schemaVersion: "0.1",
    status: "setup_required",
    data: null,
    warnings: sanitizePublicOutput(options.warnings ?? []),
    provenance: sanitizePublicOutput(options.provenance),
    setupRequirements: sanitizePublicOutput(setupRequirements),
  };
}
