---
title: Evidence result
description: The typed result foundation for future Codex SEO capabilities.
---

# Evidence result

Future Codex SEO capabilities will return a structured evidence result. The
contract is implemented in the repository today, but no user-facing capability
produces one yet.

## Fields

| Field | Meaning |
| --- | --- |
| `schemaVersion` | The version of the result format. |
| `status` | Whether the result is `success`, `error`, or `setup_required`. |
| `data` | Capability-specific output on a successful result. |
| `warnings` | Safe, reader-visible qualifications about the result. |
| `provenance` | Context about where and when the evidence was collected. |
| `error` | A stable public error when the status is `error`. |
| `setupRequirements` | Explicit prerequisites when the status is `setup_required`. |

## Public-safety boundary

The evidence contract is designed for JSON serialization and redacts secrets
from public values. That boundary is groundwork for future skills; it is not
an SEO workflow that can be invoked from this version.
