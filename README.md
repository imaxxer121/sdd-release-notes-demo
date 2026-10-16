# Release notes CLI

A small standalone teaching repository for a real plugin installation rehearsal.
It has its own code, tests and instructions before any marketplace is installed.
Feed a JSON array of `{title, kind}` entries on stdin; the CLI prints Markdown
release notes. Entry order is stable. No local files from another app are needed.

```sh
npm test
node src/cli.mjs < examples/changes.json
```
