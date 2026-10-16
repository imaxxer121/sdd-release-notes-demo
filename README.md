# Release notes CLI

A small standalone teaching repository for a real plugin installation rehearsal.
It has its own code, tests and instructions before any marketplace is installed.
Feed a JSON array of `{title, kind}` entries on stdin; the CLI prints Markdown
release notes. Entry order is stable. No local files from another app are needed.

```sh
npm test
node src/cli.mjs < examples/changes.json
node src/cli.mjs --limit 2 < examples/changes.json
```

`--limit N` selects the first 1–100 entries in their original order. Invalid or
duplicate limits write a diagnostic to stderr and exit 2 before reading stdin.
All entries are validated before limiting output, including entries after the
selected prefix. Without a limit the existing output is preserved.

The [actual 1.0 workflow](docs/workflow-1.0.md) records installed profiles,
unchanged model-generated spec/plan, implementation, 45 passing tests and two
independent review gates. No local SDD agents or skill copies are in this repo.
Portable marketplace/config files select the published current channel;
the stable channel is retained but disabled after the rollback rehearsal.
See the marketplace [release verification](https://github.com/imaxxer121/dev-digest-ai-marketplace/blob/main/docs/VERIFICATION.md)
for separate update, stable smoke and restored-current evidence. Claude CLI was
used for installer checks; actual model execution used Codex under subscription.
