export function formatNotes(entries) {
  if (!Array.isArray(entries)) throw new TypeError('Expected an array');
  for (const entry of entries) {
    if (!entry || typeof entry.title !== 'string' || typeof entry.kind !== 'string') throw new TypeError('Invalid entry');
  }
  return entries.map(entry=>`- **${entry.kind}**: ${entry.title}`).join('\n');
}
