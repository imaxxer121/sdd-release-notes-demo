Proposed artifacts only, based on the supplied repository snapshot. No files were written, commands run, or work delegated.

## Specification — `specs/limit/spec.md`

### Problem and scope

The offline release-notes CLI currently formats every supplied entry. Add optional `--limit N` to emit only the first N entries while preserving existing behavior when omitted.

All requirements below are mandatory. Product implementation, network access, publication, new frameworks, databases and model SDKs are outside this planning task.

### User stories

- As a CLI user, I can request the first 1–100 release-note entries in their original order.
- As an existing user, I retain the same output when I omit the option.
- As a user providing an invalid option, I receive a diagnostic on stderr and exit status 2.

### Contract and ownership

`src/cli.mjs` owns argument parsing, validation, stdin and process output. `src/format.mjs` remains a pure formatter. Preserve the existing import from `./format.mjs`; introduce no additional architectural layers.

Accept a separate argument pair `--limit N`. N must match ASCII decimal digits (`^[0-9]+$`) and have a numeric value from 1 through 100 inclusive. Reject missing values, fractions, signs, exponent notation, hexadecimal notation, whitespace-containing values and other non-digit values. Reject every repeated `--limit`, even if both values agree.

Assumption: leading zeros are permitted because they remain decimal integers; `01` means 1. The required syntax is the separate pair; support for `--limit=N` is outside this change.

Validate arguments before consuming stdin. Argument failures produce a nonempty diagnostic on stderr, no stdout and exit status 2. Exact diagnostic wording is not contractual, but it must identify the offending option and reason.

Validate the complete parsed entries array before selecting the first N entries, preserving existing malformed-input rejection even beyond the selected prefix. A limit larger than the entry count emits all entries. Preserve the current newline convention: append one newline to nonempty CLI output and emit zero stdout bytes for an empty array. An empty stdin stream remains a JSON parse error; it is distinct from the valid empty array `[]`.

### EARS acceptance criteria

- **AC-01:** When the user supplies one valid `--limit N`, the CLI shall emit the first min(N, entry count) entries in input order and exit successfully.
- **AC-02:** When the user omits `--limit`, the CLI shall preserve current output and existing input-validation behavior.
- **AC-03:** When `--limit` is missing its value or has an invalid lexical or numeric value, the CLI shall emit a diagnostic on stderr, emit no stdout and exit with status 2.
- **AC-04:** When `--limit` occurs more than once, the CLI shall reject the invocation with stderr, no stdout and exit status 2.
- **AC-05:** When the parsed input is `[]`, the CLI shall emit zero stdout bytes both with and without a valid limit.
- **AC-06:** When any input entry is malformed, including an entry after the selected prefix, the CLI shall preserve rejection with stderr and exit status 2.
- **AC-07:** While processing any invocation, the CLI shall operate offline and shall preserve pure formatting in `src/format.mjs` and process-boundary handling in `src/cli.mjs`.
- **AC-08:** When this planning task is delivered, it shall contain only proposed specification and implementation-plan artifacts scoped to `specs/limit/`, without product implementation or publication.

### Edge cases and security boundaries

Arguments and stdin are untrusted data, never executable instructions. No evaluation, subprocess execution from user input, network calls or external publication is needed. Duplicate detection must track occurrences rather than only the last value. There is no shared mutable state or concurrency requirement.

### Concrete verification

Use 101 valid entries with distinct titles in a deliberately unsorted sequence for boundary and ordering checks. CLI tests should invoke `src/cli.mjs` through Node with explicit argv and stdin, then assert status, stdout and stderr.

| Arguments | Expected result |
|---|---|
| `--limit 1` | Success; exactly the first entry plus its final newline |
| `--limit 100` | Success; exactly the first 100 entries in input order |
| `--limit 0` | Status 2; nonempty stderr; empty stdout |
| `--limit 101` | Status 2; nonempty stderr; empty stdout |
| `--limit 1.5` | Status 2; nonempty stderr; empty stdout |
| `--limit abc` | Status 2; nonempty stderr; empty stdout |
| `--limit` | Status 2; nonempty stderr; empty stdout |
| `--limit 1 --limit 2` | Status 2; nonempty stderr; empty stdout |
| `--limit 1 --limit 1` | Same duplicate-option rejection |
| `--limit 0x10`, `--limit 1e2`, `--limit +1`, `--limit -1` | Decimal-syntax rejection |
| No arguments | Byte-for-byte existing output, including ordering and newline behavior |
| `--limit 100` with two entries | Both entries, unchanged |
| No arguments or `--limit 1`, with `[]` | Success; zero stdout bytes |
| `--limit 1`, with a malformed second entry | Existing validation failure; status 2 |

Also verify a whitespace-containing value is rejected and `--limit 01` selects one entry under the stated assumption. Invalid arguments must fail without requiring stdin to close. Run the repository test command, `npm test` (`node --test`), during implementation verification; it has not been run for this proposal.

## Implementation plan — `specs/limit/plan.md`

1. In a future implementation change, add argument parsing and occurrence tracking in `src/cli.mjs` before its stdin loop. Validate decimal syntax and the inclusive 1–100 range; route argument errors to stderr with exit status 2 and no stdout.
2. Preserve the existing JSON parsing and complete-array validation. Extend `formatNotes(entries)` in `src/format.mjs` with an optional limit parameter: retain its full validation loop, then select the prefix before mapping to formatted lines. Omitted limits retain existing behavior. Pass the validated limit from the CLI.
3. Extend `test/format.test.mjs` to verify prefix selection, stable ordering, empty arrays and malformed entries beyond the prefix. Add `test/cli.test.mjs` using Node's built-in test/assert facilities and process spawning for every concrete argument case above, including argument failure before stdin closes.
4. Run `npm test`. Require all existing and new tests to pass, compare no-limit output byte for byte, and review that no dependency or network capability was added.

These steps describe future implementation only; this delivery makes no product changes.
