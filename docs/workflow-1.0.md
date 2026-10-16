# Installed SDD 1.0 workflow — release-notes limit

The installed **sdd-engineering 1.0.0** workflow reached both independent PASS
gates for this target. Root then supplied the final execution evidence:
`npm test` passed **45/45, zero skips**, with a reported duration of **2.578 s**
at **2026-10-16 14:12 UTC**; `git diff --check` passed.
The baseline is `fc0c152`. This documentation step did not run tests or models.

Machine-readable provenance, file digests, scoped measurements and the full
AC matrix are in [workflow-1.0.json](evidence/workflow-1.0.json).

## Installation and runtime provenance

The public source is [dev-digest-ai-marketplace](https://github.com/imaxxer121/dev-digest-ai-marketplace).
The historical installation used commit
[`15af4ceeff1e26e959649e9173f6cb651c882fe8`](https://github.com/imaxxer121/dev-digest-ai-marketplace/tree/15af4ceeff1e26e959649e9173f6cb651c882fe8).
The [sanitized installation receipt](https://github.com/imaxxer121/dev-digest-ai-marketplace/blob/main/docs/evidence/install-1.0.json)
records Claude Code CLI 2.1.301 installing SDD plus three dependencies:

| Plugin | Manifest version | Historical project state |
| --- | --- | --- |
| sdd-engineering | 1.0.0 | installed, enabled |
| engineering-paved-path | 1.0.0 | installed, enabled |
| research-tools | 1.0.0 | installed, enabled |
| architecture-review | 1.0.0 | installed, enabled |

The three dependency cache labels include the historical commit suffix
`1.0.0-15af4ceeff1e`; their manifests remain 1.0.0. Claude was used for
installation/dependency resolution only. **No Claude inference is claimed.**
The retained Codex receipt `work/course-tools/codex-plugin-installed.json`
independently records all four plugins installed/enabled at 1.0.0.

Execution used an explicit Codex adapter: planning loaded the actual installed
cache profiles into a subscribed CLI request; delegated roles read their
installed profile instructions. The controlled planning trial disabled native
implicit plugin loading. This establishes an installed-profile Codex workflow,
not native Claude agent execution or automatic equivalence of their tool systems.

The target has its own [AGENTS.md](../AGENTS.md), source and tests. Its
`.claude/settings.json` registers the four plugins; there are no local
`.claude/agents`, `.claude/skills` or `.codex/agents` profile copies.
Retained runtime documentation under `work/course-tools/docs/` explains the
adapter context; documentation is not itself proof of a model execution.
Later cache rotation belongs to the separate 1.1 task and does not change the
historical 1.0 evidence.

## Actual sequence

1. **Spec → plan:** real subscribed CLI calls using installed
   `spec-creator` and `implementation-planner` profiles produced retained
   treatment-3, blind label A. Their model was `gpt-6.1-sol`, as recorded by
   the controlled adapter. The [spec](../specs/limit/spec.md),
   [spec JSON](../specs/limit/spec.json), [plan](../specs/limit/plan.md) and
   [plan JSON](../specs/limit/plan.json) retain those original proposals.
   JSON objects match the original stage results; Markdown matches after
   trimming only surrounding whitespace. No proposal was rewritten to fit the
   implementation or later review.
2. **Installed researcher:** `research-tools:researcher` inspected source
   without editing. It identified full-array validation before formatting and
   the fact that string titles can contain newlines. Those facts require
   validating malformed suffix entries and counting entries rather than
   rendered lines.
3. **One delegated implementer, T1 → T2:** T1 changed
   [formatter](../src/format.mjs) and [formatter tests](../test/format.test.mjs);
   T2 changed [CLI](../src/cli.mjs) and added
   [CLI tests](../test/cli.test.mjs). These are the four product/test paths.
   The implementer did not execute Bash or the test suite; root owned execution.
   No distinct installed implementer profile is asserted beyond the agreed
   installed-workflow plan.
4. **Root verification:** the actual package command is `npm test`
   (`node --test`, [package.json](../package.json)). Root reported 45 passed,
   zero failed/skipped, and a clean diff whitespace check.
5. **Independent gates in parallel:** the installed architecture reviewer and
   installed plan-verifier each returned PASS. The plan-verifier did not read
   unfinished architecture conclusions and did not execute tests.

The earlier automatic **cost-trial** checker recorded treatment-3
`success:false` with `task ownership/checks`. Its rule rejected any empty
`owned_paths`, including the intentionally read-only T3 reviewer task.
That historical result remains preserved. The later independent gates examined
the explicit read-only ownership and passed it; their result does not rewrite
the original experiment into a pass.

| Loaded installed profile | SHA256 |
| --- | --- |
| sdd-engineering 1.0.0 / spec-creator | `141e10e4eb5095a9393d46d5592e13ccc4612e78baa68acf4a0860092a09baec` |
| sdd-engineering 1.0.0 / implementation-planner | `94a74ada783fbb1a9fd6c4d09bee6c0aa0862acde1a48877ca24037b41235bd0` |
| research-tools 1.0.0 / researcher | `1276d942c09f2200c43386d11138bae29b93d5d1ed8327d7738ce5f8debeb51b` |
| architecture-review 1.0.0 / architecture-reviewer | `612cf83c04b80d0cac60cb24822fef2e7eff39b0c890d867afbfe434747c1907` |
| sdd-engineering 1.0.0 / plan-verifier | `a028a98d7a26f6cec01b1f4c56b2d3634fc98f05177df533052dc226d4d083e1` |

## Acceptance evidence

All R-01–R-10 map to ACs, and the plan assigns each task explicit writable paths
or read-only ownership. These findings combine independent source/test inspection
with root's executed 45-test result.

| AC | Gate | Source and test coverage |
| --- | --- | --- |
| AC-01 | PASS | [format lines 6–7](../src/format.mjs#L6), [CLI tests 49–64](../test/cli.test.mjs#L49): limits 1/100, stable prefix, short inputs and leading zeros. |
| AC-02 | PASS | [format line 6](../src/format.mjs#L6), [CLI tests 66–72](../test/cli.test.mjs#L66) and 139–147: default bytes, unrelated arguments and existing input rejection. |
| AC-03 | PASS | [CLI lines 10–18](../src/cli.mjs#L10), [test matrix 85–124](../test/cli.test.mjs#L85): invalid/missing/nondecimal/range values fail with exit 2, stderr and no stdout before stdin closes. Timeout fails the open-stdin test. |
| AC-04 | PASS | [CLI lines 5–11](../src/cli.mjs#L5), [tests 94–95](../test/cli.test.mjs#L94): identical and different duplicates rejected. |
| AC-05 | PASS | [CLI line 20](../src/cli.mjs#L20), [tests 80–82](../test/cli.test.mjs#L80): zero bytes for `[]`, retained final newline for nonempty output. |
| AC-06 | PASS | [format lines 3–6](../src/format.mjs#L3), [tests 127–136](../test/cli.test.mjs#L127): malformed entries beyond the selected prefix still fail. |
| AC-07 | PASS | [CLI](../src/cli.mjs), [pure formatter](../src/format.mjs), [package](../package.json): process boundary retained, no network calls or added dependencies. |
| AC-08 | PASS, planning phase | [spec line 38](../specs/limit/spec.md#L38), [plan ownership](../specs/limit/plan.md#L15): planning-only delivery was complete before the user separately authorized implementation. Original proposals remain unchanged. |

The implemented contract accepts a separate `--limit N` with ASCII digits and
numeric value 1–100, including leading zeros. Complete-array validation occurs
before selection. No-limit output, stable order, multiline titles, valid empty
arrays and offline operation remain covered. Support for `--limit=N` was
outside the agreed change.

## Manual workflow retrospective

This concise retro was explicitly requested for the course; it was not triggered
by a hook. The observed sequence was planning → source research → sequential
T1/T2 implementation → root verification → two independent read-only gates.

The useful source discoveries were small and consequential: slicing before
validation would hide malformed suffix entries, and truncating output by newline
would split a single entry. The tests cover both. Explicit four-file ownership
kept the implementation small, while independent gates preserved the distinction
between planning authorization and the later implementation phase.

For a future workflow, retain the open-stdin failure checks and malformed-suffix
cases. Make automated ownership rubrics distinguish read-only reviewers from
writers, without rewriting historical outcomes. These are recommendations;
this documentation task applied no source/profile fixes.

The retained planning CLI stages report 10,961 input / 2,593 output tokens and
13,340 input / 2,256 output tokens, respectively; each reports zero cached input
tokens and one completed turn. These are **planning-only** measurements.
Researcher, implementer and reviewer model identities, token/cache/tool counters
and spans are unavailable from collaboration telemetry and remain `null` with
reasons in the JSON. `inherit` is not an observed model ID. Complete workflow
totals, cache efficiency, parallelism and billed USD cannot be calculated from
that partial evidence.

## Separate pending stage

The plugin 1.1 update, fresh execution and rollback are a separate root-owned
task. This historical 1.0 report does not certify that stage complete.
