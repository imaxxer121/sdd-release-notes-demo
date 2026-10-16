export function formatNotes(entries, limit) {
  if (!Array.isArray(entries)) throw new TypeError('Expected an array');
  for (const entry of entries) {
    if (!entry || typeof entry.title !== 'string' || typeof entry.kind !== 'string') throw new TypeError('Invalid entry');
  }
  const selected = limit === undefined ? entries : entries.slice(0, limit);
  return selected.map(entry=>`- **${entry.kind}**: ${entry.title}`).join('\n');
}
