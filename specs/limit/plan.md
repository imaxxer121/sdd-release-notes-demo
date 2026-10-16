## Proposed `specs/limit/plan.md`

Based on the supplied repository snapshot and agreed specification. No files were written, commands run, or work delegated. This delivery contains only the implementation plan; all product changes below are future work.

### Contract and execution

Follow `specs/limit/spec.md` as supplied. Accept one separate `--limit N` pair, with ASCII digits and numeric value 1–100 inclusive; accept leading zeros. Reject invalid or missing values and duplicate occurrences with nonempty stderr, empty stdout and status 2 before reading stdin. Preserve default output, input order, full-array validation, empty-array output and offline operation.

Use one implementer sequentially. This implementer owns all shared product files; no migration is needed. Planning writes are confined to `specs/limit/plan.md`. Future implementation paths below are ownership assignments, not changes authorized during this planning delivery.

Relevant guidance: supplied AGENTS.md and onion-architecture context. Preserve the actual import `./format.mjs`; argument validation stays in `src/cli.mjs`, and formatting remains pure in `src/format.mjs`. No additional layers, dependencies or skills are needed for implementation.

### Tasks

| ID / owner | Exact owned paths | Dependencies | Action and acceptance coverage |
|---|---|---|---|
| T0 / planner | `specs/limit/plan.md` | None | Record the agreed contracts, ownership, checks and gates. AC-01–AC-08. |
| T1 / implementer | `src/format.mjs`, `test/format.test.mjs` | T0 | Extend `formatNotes(entries, limit)` with an optional validated limit. Keep complete-array validation before prefix selection. Preserve omitted-limit output, stable ordering and purity. Add focused formatter tests. AC-01, AC-02, AC-05, AC-06, AC-07. |
| T2 / same implementer | `src/cli.mjs`, `test/cli.test.mjs` (new) | T1 | Parse arguments and count occurrences before consuming stdin. Validate decimal syntax and range, report argument failures, and pass the validated limit to the formatter. Add CLI process tests covering the complete verification matrix. Preserve JSON-error handling and newline behavior. AC-01–AC-07. |
| T3 / independent reviewers | None; read-only review | T2 | Run separate architecture and plan-verification gates, review scope, and record actual evidence. AC-01–AC-08. |

T1 establishes the formatter contract before T2 consumes it. No concurrent edits are planned. Review findings return to the same file owner.

### Verification commands and expected evidence

Commands below are proposed for future implementation verification, from the repository root. Use the existing Node test runner and built-in modules; add no dependencies.

- T1: `node --test test/format.test.mjs`. Existing tests and new prefix, ordering, empty-array and full-validation cases pass.
- T2: `node --test test/cli.test.mjs`. Spawn Node with explicit argv and stdin; assert exit status and exact stdout, plus empty stderr on successful cases and meaningful nonempty stderr on failures.
- Final verification: `npm test`, whose actual package script is `node --test`. All existing and new tests pass. Record the result only after execution.

Use 101 valid entries with unique, deliberately unsorted titles. Derive expected output independently from explicit fixture prefixes, including the final newline.

| Arguments / input | Required evidence |
|---|---|
| `--limit 1` / 101 entries | Status 0; exactly first entry and newline. |
| `--limit 100` / 101 entries | Status 0; exactly first 100 entries in input order and final newline. |
| `--limit 0`, `--limit 101` | Each: status 2, empty stdout, diagnostic identifying invalid range. |
| `--limit 1.5`, `--limit abc` | Each: status 2, empty stdout, diagnostic identifying invalid decimal value. |
| `--limit` | Status 2, empty stdout, missing-value diagnostic. |
| `--limit 1 --limit 2`, `--limit 1 --limit 1` | Each: status 2, empty stdout, duplicate-option diagnostic. |
| `--limit 0x10`, `--limit 1e2`, `--limit +1`, `--limit -1`, whitespace-containing value, empty-string value | Each: decimal-syntax rejection, status 2 and empty stdout. Pass whitespace and empty strings as explicit argv elements. |
| `--limit 01` | Status 0; exactly first entry and newline. |
| `--limit 100` / two entries | Both entries in original order. |
| No arguments / valid entries | Exact existing output bytes, including ordering and final newline. |
| No arguments and `--limit 1` / `[]` | Status 0; zero stdout bytes and empty stderr. |
| `--limit 1` / malformed second entry | Status 2, empty stdout and input-validation diagnostic. |
| No arguments / wrong shape, malformed entry, invalid JSON or empty stdin | Existing rejection behavior retained. |

For every argument-failure case, include a process test that leaves stdin open and requires the child to exit with status 2 within a bounded timeout. Register cleanup to terminate a stalled child and close streams; a timeout is a failure, never passing evidence. Include a following-option missing-value case such as `--limit --limit 1`; it must fail without awaiting stdin. Exact error precedence is not contractual.

Gotchas: check lexical syntax before numeric conversion; track option occurrences rather than overwriting a value; validate all entries before slicing; preserve zero-byte output for `[]`. The separate-pair contract does not require `--limit=N` support. Avoid unrelated argument-policy changes.

### Independent gates and bounded fixes

1. **architecture-review:architecture-reviewer** — independently inspect the final diff against AGENTS.md and the supplied architecture guidance. Verify the real `./format.mjs` import, pure formatter, CLI-boundary argument validation, full-array validation and absence of network calls or added dependencies. Cite concrete paths and local rules for any finding. This is a read-only review, separate from verification.
2. **sdd-engineering:plan-verifier** — independently trace every AC to tasks and evidence. Check all mandatory values, duplicates, default bytes, stable order, empty arrays, invalid suffix entries and failure before stdin closes. Require the final `npm test` result and confirm planning delivery stayed within its designated scope.

Both gates must pass independently. Reviewers own no product paths. Allow at most three correction cycles (`max-fix:3`) across the gates; the implementer applies fixes, reruns affected checks, and obtains renewed relevant reviews. Exit with unresolved findings if a cycle makes no measurable progress or the third cycle still fails. Do not claim completion or passing checks without evidence.

### AC traceability

| AC | Tasks | Required evidence |
|---|---|---|
| AC-01 | T1, T2, T3 | Limits 1 and 100, short input and stable prefix ordering. |
| AC-02 | T1, T2, T3 | Existing formatter tests, byte-exact default CLI output and existing input failures. |
| AC-03 | T2, T3 | Invalid-value matrix and open-stdin failure tests. |
| AC-04 | T2, T3 | Identical and differing duplicate flags rejected. |
| AC-05 | T1, T2, T3 | Empty-array zero-byte output and nonempty final newline. |
| AC-06 | T1, T2, T3 | Malformed entry beyond selected prefix still rejected. |
| AC-07 | T1, T2, T3 | Independent boundary, import and offline-operation review. |
| AC-08 | T0, T3 | Proposed plan only, real paths and `npm test`; no execution, implementation or publication claimed. |
