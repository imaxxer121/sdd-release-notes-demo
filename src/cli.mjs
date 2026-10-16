import {formatNotes} from './format.mjs';
try {
  const args=process.argv.slice(2);
  let limit;
  let seenLimit=false;
  for (let index=0; index<args.length; index++) {
    if (args[index] !== '--limit') continue;
    if (seenLimit) throw new TypeError('--limit may only be supplied once');
    seenLimit=true;
    const value=args[index+1];
    if (value === undefined || value === '--limit') throw new TypeError('--limit requires a value');
    if (value.length === 0 || /[^0-9]/.test(value)) throw new TypeError('--limit must contain only ASCII decimal digits');
    limit=Number(value);
    if (limit < 1 || limit > 100) throw new RangeError('--limit must be between 1 and 100');
    index++;
  }
  let input='';
  for await (const chunk of process.stdin) input+=chunk;
  const out=formatNotes(JSON.parse(input),limit);
  process.stdout.write(out ? out+'\n' : '');
} catch(error) {
  process.stderr.write(error.message+'\n');
  process.exitCode=2;
}
